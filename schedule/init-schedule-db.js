// Schedule Database Initialization
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'schedule.db');
const db = new Database(dbPath);

console.log('📅 Initializing Schedule Database...');

// Create family_members table
db.exec(`
  CREATE TABLE IF NOT EXISTS family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    role TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ Created family_members table');

// Create schedules table
db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    activity TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    duration_minutes INTEGER,
    location TEXT,
    notes TEXT,
    added_by TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reminded_at DATETIME,
    FOREIGN KEY (member_id) REFERENCES family_members(id)
  )
`);

console.log('✅ Created schedules table');

// Create indexes for performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(event_date);
  CREATE INDEX IF NOT EXISTS idx_schedules_member ON schedules(member_id);
`);

console.log('✅ Created indexes');

// Insert default family members (from shopping list)
const insertMember = db.prepare(`
  INSERT OR IGNORE INTO family_members (name, role) VALUES (?, ?)
`);

const members = [
  ['Mom', 'parent'],
  ['Dad', 'parent'],
  ['Emma', 'child']
];

for (const [name, role] of members) {
  insertMember.run(name, role);
  console.log(`✅ Added family member: ${name}`);
}

console.log('\n🎉 Schedule database initialized successfully!');
console.log(`📂 Database location: ${dbPath}`);

db.close();
