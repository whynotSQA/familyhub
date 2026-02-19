const Database = require('better-sqlite3');
const path = require('path');

function getSuggestions(username = 'Mom') {
  const dbPath = path.join(__dirname, 'shopping.db');
  const db = new Database(dbPath);
  
  try {
    // 获取当前清单
    const currentItems = db.prepare('SELECT name FROM shopping_items').all();
    const currentItemNames = currentItems.map(i => i.name.toLowerCase());
    
    // 获取购买历史
    const history = db.prepare(`
      SELECT item_name, purchased_at
      FROM purchase_history
      ORDER BY purchased_at DESC
    `).all();
    
    // 分析购买模式
    const itemStats = {};
    
    history.forEach(record => {
      const name = record.item_name;
      if (!itemStats[name]) {
        itemStats[name] = {
          name: name,
          purchases: [],
          count: 0
        };
      }
      itemStats[name].purchases.push(new Date(record.purchased_at));
      itemStats[name].count++;
    });
    
    const suggestions = [];
    const now = new Date();
    
    for (const [itemName, stats] of Object.entries(itemStats)) {
      // 跳过已在清单上的商品
      if (currentItemNames.includes(itemName.toLowerCase())) {
        continue;
      }
      
      // 至少购买过2次才建议
      if (stats.count < 2) {
        continue;
      }
      
      // 计算购买间隔
      const intervals = [];
      for (let i = 1; i < stats.purchases.length; i++) {
        const diff = stats.purchases[i - 1] - stats.purchases[i];
        intervals.push(diff / (1000 * 60 * 60 * 24)); // 转换为天数
      }
      
      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const daysSinceLastPurchase = (now - stats.purchases[0]) / (1000 * 60 * 60 * 24);
        
        // 如果接近或超过购买周期，建议购买
        if (daysSinceLastPurchase >= avgInterval * 0.8) {
          // 获取该商品的购买地点
          const storeInfo = db.prepare(
            'SELECT preferred_store FROM shopping_items WHERE LOWER(name) = LOWER(?) ORDER BY added_at DESC LIMIT 1'
          ).get(itemName);
          
          suggestions.push({
            item: itemName,
            reason: `您通常每 ${Math.round(avgInterval)} 天购买一次，已经 ${Math.round(daysSinceLastPurchase)} 天了`,
            priority: daysSinceLastPurchase >= avgInterval ? 'high' : 'medium',
            purchaseCount: stats.count,
            preferredStore: storeInfo?.preferred_store || null
          });
        }
      }
    }
    
    // 按优先级排序
    suggestions.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return 0;
    });
    
    return suggestions;
    
  } finally {
    db.close();
  }
}

module.exports = { getSuggestions };
