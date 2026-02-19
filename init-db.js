const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'shopping.db');
const db = new Database(dbPath);

// 创建购物清单表
db.exec(`
  CREATE TABLE IF NOT EXISTS shopping_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    quantity REAL DEFAULT 1,
    unit TEXT,
    added_by TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    preferred_store TEXT
  )
`);

// 创建购买历史表
db.exec(`
  CREATE TABLE IF NOT EXISTS purchase_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    purchased_by TEXT,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ Database initialized successfully!');
console.log(`📂 Database location: ${dbPath}`);

db.close();
