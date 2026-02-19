const Database = require('better-sqlite3');
const path = require('path');
const { categorizeItem } = require('./categorizer');

const dbPath = path.join(__dirname, 'shopping.db');
const db = new Database(dbPath);

const name = 'tofu';
const category = categorizeItem(name);
const quantity = 1;
const unit = null;
const added_by = 'You';
const preferred_store = 'H Mart';

db.prepare(`
  INSERT INTO shopping_items (name, category, quantity, unit, added_by, preferred_store)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(name, category, quantity, unit, added_by, preferred_store);

console.log(`✅ Added: ${name} to shopping list`);
console.log(`   Category: ${category}`);
console.log(`   Store: ${preferred_store}`);
console.log(`   Added by: ${added_by}`);

db.close();
