const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const { getSuggestions } = require('./suggestions');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Redirect root to dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard.html');
});

const dbPath = path.join(__dirname, 'shopping.db');

// API endpoints
app.get('/api/list', (req, res) => {
  const db = new Database(dbPath);
  try {
    const items = db.prepare(`
      SELECT id, name, category, quantity, unit, added_by, preferred_store,
             datetime(added_at, 'localtime') as added_at
      FROM shopping_items
      WHERE purchased_at IS NULL
      ORDER BY category, name
    `).all();
    
    const purchasedToday = db.prepare(`
      SELECT COUNT(*) as count
      FROM purchase_history
      WHERE DATE(purchased_at) = DATE('now')
    `).get();
    
    res.json({
      items,
      stats: {
        total: items.length,
        categories: [...new Set(items.map(i => i.category))].length,
        purchasedToday: purchasedToday.count
      }
    });
  } finally {
    db.close();
  }
});

app.get('/api/list-by-store', (req, res) => {
  const db = new Database(dbPath);
  try {
    const items = db.prepare(`
      SELECT id, name, category, quantity, unit, added_by, preferred_store
      FROM shopping_items
      ORDER BY preferred_store, category, name
    `).all();
    
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
    
    res.json({ byStore, total: items.length });
  } finally {
    db.close();
  }
});

app.get('/api/suggestions', (req, res) => {
  try {
    const suggestions = getSuggestions('Mom');
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bought/:id', (req, res) => {
  const db = new Database(dbPath);
  try {
    const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(req.params.id);
    if (item) {
      db.prepare('INSERT INTO purchase_history (item_name, purchased_by) VALUES (?, ?)').run(item.name, 'Mom');
      db.prepare('DELETE FROM shopping_items WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } finally {
    db.close();
  }
});

app.delete('/api/item/:id', (req, res) => {
  const db = new Database(dbPath);
  try {
    db.prepare('DELETE FROM shopping_items WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } finally {
    db.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Shopping List Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
});
