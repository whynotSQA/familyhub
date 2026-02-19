const Database = require('better-sqlite3');
const path = require('path');
const { categorizeItem } = require('./categorizer');
const { getSuggestions } = require('./suggestions');

const dbPath = path.join(__dirname, 'shopping.db');

function handleAction(action, username = 'Mom') {
  const db = new Database(dbPath);
  
  try {
    switch (action.action) {
      case 'add':
        return addItems(db, action.items, username);
      case 'list':
        return showList(db);
      case 'listByStore':
        return showListByStore(db);
      case 'bought':
        return markBought(db, action.items, username);
      case 'remove':
        return removeItems(db, action.items);
      case 'suggestions':
        return showSuggestions(username);
      default:
        return "抱歉，我不明白您的意思。试试说 'add milk' 或 'show list'";
    }
  } finally {
    db.close();
  }
}

function addItems(db, items, username) {
  const added = [];
  const duplicates = [];
  
  items.forEach(itemText => {
    const parsed = parseItemText(itemText);
    const category = categorizeItem(parsed.name);
    
    const existing = db.prepare('SELECT * FROM shopping_items WHERE LOWER(name) = LOWER(?)').get(parsed.name);
    
    if (existing) {
      duplicates.push(parsed.name);
    } else {
      db.prepare(`
        INSERT INTO shopping_items (name, category, quantity, unit, added_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(parsed.name, category, parsed.quantity, parsed.unit, username);
      
      added.push(`${parsed.name} (${category})`);
    }
  });
  
  let response = '';
  if (added.length > 0) {
    response += `✅ 已添加: ${added.join(', ')}\n`;
  }
  if (duplicates.length > 0) {
    response += `⚠️ 已存在: ${duplicates.join(', ')}`;
  }
  
  return response || '没有添加任何商品';
}

function showList(db) {
  const items = db.prepare(`
    SELECT name, category, quantity, unit, added_by, preferred_store, 
           datetime(added_at, 'localtime') as added_at
    FROM shopping_items
    ORDER BY category, name
  `).all();
  
  if (items.length === 0) {
    return '🛒 购物清单是空的';
  }
  
  const byCategory = {};
  items.forEach(item => {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
    }
    byCategory[item.category].push(item);
  });
  
  let output = `🛒 购物清单 (${items.length} 项)\n\n`;
  
  for (const [category, categoryItems] of Object.entries(byCategory)) {
    const emoji = getCategoryEmoji(category);
    output += `${emoji} ${category} (${categoryItems.length})\n`;
    categoryItems.forEach(item => {
      let line = `  • ${item.name}`;
      if (item.quantity && item.quantity !== 1) {
        line += ` (${item.quantity}${item.unit ? ' ' + item.unit : ''})`;
      }
      if (item.preferred_store) {
        line += ` 📍 ${item.preferred_store}`;
      }
      line += ` - ${item.added_by}`;
      output += line + '\n';
    });
    output += '\n';
  }
  
  return output.trim();
}

function showListByStore(db) {
  const items = db.prepare(`
    SELECT name, category, quantity, unit, added_by, preferred_store
    FROM shopping_items
    ORDER BY preferred_store, category, name
  `).all();
  
  if (items.length === 0) {
    return '🛒 购物清单是空的';
  }
  
  const byStore = {};
  items.forEach(item => {
    const store = item.preferred_store || '未指定商店';
    if (!byStore[store]) {
      byStore[store] = {};
    }
    const cat = item.category;
    if (!byStore[store][cat]) {
      byStore[store][cat] = [];
    }
    byStore[store][cat].push(item);
  });
  
  let output = `🛒 购物清单 (按商店) - ${items.length} 项\n\n`;
  
  for (const [store, categories] of Object.entries(byStore)) {
    const storeItems = Object.values(categories).flat();
    output += `📍 ${store} (${storeItems.length} 项)\n`;
    
    for (const [category, categoryItems] of Object.entries(categories)) {
      const emoji = getCategoryEmoji(category);
      output += `  ${emoji} ${category}:\n`;
      categoryItems.forEach(item => {
        let line = `    • ${item.name}`;
        if (item.quantity && item.quantity !== 1) {
          line += ` (${item.quantity}${item.unit ? ' ' + item.unit : ''})`;
        }
        output += line + '\n';
      });
    }
    output += '\n';
  }
  
  return output.trim();
}

function markBought(db, items, username) {
  const bought = [];
  const notFound = [];
  
  items.forEach(itemName => {
    const item = db.prepare('SELECT * FROM shopping_items WHERE LOWER(name) = LOWER(?)').get(itemName);
    
    if (item) {
      db.prepare('INSERT INTO purchase_history (item_name, purchased_by) VALUES (?, ?)').run(item.name, username);
      db.prepare('DELETE FROM shopping_items WHERE id = ?').run(item.id);
      bought.push(item.name);
    } else {
      notFound.push(itemName);
    }
  });
  
  let response = '';
  if (bought.length > 0) {
    response += `🎉 感谢${username}购买了: ${bought.join(', ')}\n`;
  }
  if (notFound.length > 0) {
    response += `⚠️ 清单上没有: ${notFound.join(', ')}`;
  }
  
  return response || '没有标记任何商品';
}

function removeItems(db, items) {
  const removed = [];
  const notFound = [];
  
  items.forEach(itemName => {
    const result = db.prepare('DELETE FROM shopping_items WHERE LOWER(name) = LOWER(?)').run(itemName);
    
    if (result.changes > 0) {
      removed.push(itemName);
    } else {
      notFound.push(itemName);
    }
  });
  
  let response = '';
  if (removed.length > 0) {
    response += `✅ 已删除: ${removed.join(', ')}\n`;
  }
  if (notFound.length > 0) {
    response += `⚠️ 未找到: ${notFound.join(', ')}`;
  }
  
  return response || '没有删除任何商品';
}

function showSuggestions(username) {
  const suggestions = getSuggestions(username);
  
  if (suggestions.length === 0) {
    return '💡 目前没有购物建议！';
  }
  
  let output = '💡 智能购物建议\n\n基于您的购买历史，以下商品可能需要补充：\n\n';
  
  suggestions.forEach(sug => {
    const emoji = sug.priority === 'high' ? '🔴' : '🟡';
    output += `${emoji} ${sug.item}`;
    if (sug.preferredStore) {
      output += ` 📍 ${sug.preferredStore}`;
    }
    output += `\n   ${sug.reason}\n`;
    output += `   已购买 ${sug.purchaseCount} 次\n`;
    output += `   💬 说 "add ${sug.item}" 添加到清单 (将由 ${username} 添加)\n\n`;
  });
  
  return output;
}

function parseItemText(text) {
  const quantityMatch = text.match(/^(\d+\.?\d*)\s*(.+)$/);
  
  if (quantityMatch) {
    const quantity = parseFloat(quantityMatch[1]);
    const rest = quantityMatch[2];
    
    const units = ['gallon', 'liter', 'pound', 'kg', 'oz', 'gram', 'bottle', 'can', 'box', 'pack'];
    let unit = null;
    let name = rest;
    
    for (const u of units) {
      const regex = new RegExp(`^${u}s?\\s+(.+)$`, 'i');
      const match = rest.match(regex);
      if (match) {
        unit = u;
        name = match[1];
        break;
      }
    }
    
    return { name, quantity, unit };
  }
  
  return { name: text, quantity: 1, unit: null };
}

function getCategoryEmoji(category) {
  const emojis = {
    Dairy: '🥛',
    Produce: '🥬',
    Meat: '🥩',
    Bakery: '🍞',
    Grains: '🌾',
    Snacks: '🍿',
    Beverages: '🥤',
    Canned: '🥫',
    Frozen: '🧊',
    Household: '🧹',
    Other: '📦'
  };
  return emojis[category] || '📦';
}

module.exports = { handleAction };
