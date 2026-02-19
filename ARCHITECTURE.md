# ARCHITECTURE.md - Code Architecture & Database Schema

**Project:** FamilyHub Shopping List Manager  
**Version:** 1.0.0 MVP  
**Last Updated:** February 19, 2026

---

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Database Schema](#database-schema)
3. [Code Architecture](#code-architecture)
4. [API Reference](#api-reference)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Design Decisions](#design-decisions)

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interfaces                        │
├──────────────────┬──────────────────┬──────────────────────┤
│  Web Dashboard   │   WhatsApp Bot   │   Chat Interface     │
│  (dashboard.html)│  (configured)    │   (OpenClaw)         │
└────────┬─────────┴────────┬─────────┴───────────┬──────────┘
         │                  │                      │
         │ HTTP/HTTPS       │ WhatsApp API         │ Internal
         │                  │                      │
         ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express API Server                         │
│                      (server.js)                              │
│  - RESTful endpoints                                          │
│  - Static file serving                                        │
│  - CORS enabled                                               │
│  - Port: 3000                                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                        │
├──────────────────┬──────────────────┬──────────────────────┤
│   handler.js     │  categorizer.js  │   parser.js          │
│   - Core CRUD    │  - Auto-classify │   - NLP commands     │
│   - List views   │  - 10+ categories│   - EN/CN support    │
│   - Suggestions  │  - Keywords      │   - Flexible syntax  │
└────────┬─────────┴────────┬─────────┴───────────┬──────────┘
         │                  │                      │
         └──────────────────┴──────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   suggestions.js                              │
│   - Purchase history analysis                                 │
│   - Cycle detection algorithm                                 │
│   - Priority scoring                                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                                │
│                  SQLite Database                              │
│                   (shopping.db)                               │
│  - shopping_items (current list)                              │
│  - purchase_history (archived purchases)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### **Database Engine:** SQLite3

**Rationale:**
- ✅ Lightweight (no separate server needed)
- ✅ Zero configuration
- ✅ ACID compliance
- ✅ Perfect for local/single-instance use
- ✅ Fast for read-heavy workloads
- ✅ Free and open-source

---

### **Table 1: `shopping_items`**

**Purpose:** Stores the current shopping list (unpurchased items)

```sql
CREATE TABLE IF NOT EXISTS shopping_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  quantity INTEGER DEFAULT 1,
  unit TEXT,
  added_by TEXT DEFAULT 'User',
  preferred_store TEXT,
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  purchased_at TEXT DEFAULT NULL
);
```

#### **Field Descriptions:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| **id** | INTEGER | NO | AUTO | Primary key, unique identifier |
| **name** | TEXT | NO | - | Product name (English only)<br>Examples: "milk", "bread", "laundry detergent" |
| **category** | TEXT | YES | 'Other' | Auto-assigned category<br>Values: Dairy, Produce, Meat, Bakery, Grains, Snacks, Beverages, Canned, Frozen, Household, Other |
| **quantity** | INTEGER | YES | 1 | Number of items<br>Examples: 1, 2, 3 |
| **unit** | TEXT | YES | NULL | Unit of measurement<br>Examples: "gallon", "bottle", "lb", "kg" |
| **added_by** | TEXT | YES | 'User' | User who added the item<br>Examples: "Mom", "Dad", "Emma" |
| **preferred_store** | TEXT | YES | NULL | Where to buy this item<br>Examples: "Costco", "Walmart", "JJ Bakery", "99 Ranch" |
| **added_at** | TEXT | YES | NOW | Timestamp when item was added<br>Format: "YYYY-MM-DD HH:MM:SS" (UTC) |
| **purchased_at** | TEXT | YES | NULL | Timestamp when item was marked bought<br>NULL = not yet purchased<br>NOT NULL = purchased (archived) |

#### **Indexes:**

```sql
CREATE INDEX idx_purchased_at ON shopping_items(purchased_at);
CREATE INDEX idx_category ON shopping_items(category);
CREATE INDEX idx_preferred_store ON shopping_items(preferred_store);
```

#### **Business Logic:**

- **Active items:** `WHERE purchased_at IS NULL`
- **Archived items:** `WHERE purchased_at IS NOT NULL`
- When user clicks "Bought", set `purchased_at = CURRENT_TIMESTAMP`
- Query for shopping list: `SELECT * FROM shopping_items WHERE purchased_at IS NULL`

---

### **Table 2: `purchase_history`**

**Purpose:** Archives all purchases for smart suggestion analysis

```sql
CREATE TABLE IF NOT EXISTS purchase_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL,
  purchased_by TEXT,
  purchased_at TEXT DEFAULT CURRENT_TIMESTAMP,
  preferred_store TEXT
);
```

#### **Field Descriptions:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| **id** | INTEGER | NO | AUTO | Primary key |
| **item_name** | TEXT | NO | - | Product name (copied from shopping_items) |
| **purchased_by** | TEXT | YES | NULL | User who marked as bought<br>Examples: "Mom", "Dad", "Emma" |
| **purchased_at** | TEXT | YES | NOW | Timestamp of purchase<br>Format: "YYYY-MM-DD HH:MM:SS" (UTC) |
| **preferred_store** | TEXT | YES | NULL | Store where item was (likely) purchased |

#### **Indexes:**

```sql
CREATE INDEX idx_item_name ON purchase_history(item_name);
CREATE INDEX idx_purchased_at_hist ON purchase_history(purchased_at);
```

#### **Business Logic:**

- **When user marks item as "Bought":**
  1. INSERT INTO purchase_history (item_name, purchased_by, purchased_at, preferred_store)
  2. UPDATE shopping_items SET purchased_at = CURRENT_TIMESTAMP WHERE id = ?
  
- **For smart suggestions:**
  - Query: `SELECT * FROM purchase_history WHERE item_name = ? ORDER BY purchased_at DESC`
  - Calculate average interval between purchases
  - Detect if item should be suggested again

---

### **Sample Data**

#### **shopping_items (14 active items):**

```
| id | name                    | category   | qty | unit   | added_by | preferred_store | added_at            | purchased_at |
|----|-------------------------|------------|-----|--------|----------|-----------------|---------------------|--------------|
| 1  | bread                   | Bakery     | 1   | NULL   | Dad      | JJ Bakery       | 2026-02-19 19:03:19 | NULL         |
| 2  | Wahaha Probiotic Drink  | Beverages  | 1   | NULL   | Mom      | 99 Ranch        | 2026-02-19 19:03:19 | NULL         |
| 3  | cheese                  | Dairy      | 1   | NULL   | Dad      | Costco          | 2026-02-19 19:03:19 | NULL         |
| 4  | rice                    | Grains     | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:03:19 | NULL         |
| 5  | chicken                 | Meat       | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:03:19 | NULL         |
| 6  | bananas                 | Produce    | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:03:19 | NULL         |
| 7  | broccoli                | Produce    | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:03:19 | NULL         |
| 8  | orange juice            | Produce    | 2   | gallon | Emma     | Costco          | 2026-02-19 19:03:19 | NULL         |
| 9  | milk                    | Dairy      | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:17:01 | NULL         |
| 10 | eggs                    | Dairy      | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:43:57 | NULL         |
| 11 | beef                    | Meat       | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:43:57 | NULL         |
| 12 | black pepper            | Snacks     | 1   | NULL   | Mom      | Costco          | 2026-02-19 19:52:35 | NULL         |
| 13 | sugar                   | Snacks     | 1   | NULL   | Mom      | Walmart         | 2026-02-19 19:55:59 | NULL         |
| 14 | laundry detergent       | Household  | 3   | bottle | Dad      | Walmart         | 2026-02-19 19:58:33 | NULL         |
```

#### **purchase_history (6 historical records):**

```
| id | item_name | purchased_by | purchased_at        | preferred_store |
|----|-----------|--------------|---------------------|-----------------|
| 1  | milk      | Mom          | 2026-02-05 10:00:00 | Costco          |
| 2  | milk      | Dad          | 2026-02-12 11:30:00 | Costco          |
| 3  | milk      | Mom          | 2026-02-19 09:15:00 | Costco          |
| 4  | eggs      | Emma         | 2026-02-03 14:00:00 | Costco          |
| 5  | eggs      | Mom          | 2026-02-13 10:45:00 | Costco          |
| 6  | eggs      | Dad          | 2026-02-23 16:20:00 | Costco          |
```

---

## 💻 Code Architecture

### **File Structure & Responsibilities**

```
familyhub-shopping/
│
├── server.js                   # 🚀 Entry point & API server
│   ├── Express.js setup
│   ├── Static file serving
│   ├── API route handlers
│   └── Database connection
│
├── handler.js                  # 🧠 Core business logic
│   ├── addItem(item, user)
│   ├── showList(user)
│   ├── showListByStore(user)
│   ├── markBought(itemId, user)
│   ├── removeItem(itemId)
│   └── showSuggestions(user)
│
├── categorizer.js              # 🏷️ Product categorization
│   └── categorize(productName)
│       ├── Keyword matching
│       ├── Category rules
│       └── Returns category string
│
├── parser.js                   # 🗣️ Natural language processing
│   └── parse(message)
│       ├── Detect command intent
│       ├── Extract product names
│       ├── Extract quantities/units
│       ├── Support EN & CN
│       └── Returns { action, items, ... }
│
├── suggestions.js              # 💡 Smart suggestion engine
│   └── getSuggestions(username)
│       ├── Query purchase_history
│       ├── Calculate purchase intervals
│       ├── Detect cycles
│       ├── Score priority
│       └── Returns suggestions array
│
├── dashboard.html              # 🎨 Main web UI
│   ├── Modern gradient design
│   ├── Dual view toggle
│   ├── Statistics cards
│   └── Interactive buttons
│
├── dashboard-debug.html        # 🐛 Debug/test page
│   └── Raw API response viewer
│
└── init-db.js                  # 🗄️ Database initialization
    └── Creates tables & indexes
```

---

### **Module Details**

#### **1. server.js** - Express API Server

**Purpose:** HTTP server, API endpoints, static file serving

**Dependencies:**
- `express` - Web framework
- `better-sqlite3` - SQLite driver
- `cors` - Cross-origin resource sharing

**Key Endpoints:**

```javascript
// GET endpoints
app.get('/', (req, res) => res.redirect('/dashboard.html'));
app.get('/api/list', handleGetList);
app.get('/api/list-by-store', handleGetListByStore);
app.get('/api/list-debug', handleGetListDebug);

// POST endpoints
app.post('/api/bought/:id', handleMarkBought);

// DELETE endpoints
app.delete('/api/item/:id', handleDeleteItem);

// Static files
app.use(express.static(__dirname));
```

**Database Connection:**
```javascript
const Database = require('better-sqlite3');
const db = new Database('./shopping.db');
```

---

#### **2. handler.js** - Business Logic Layer

**Purpose:** Core shopping list operations

**Public Functions:**

```javascript
/**
 * Add item to shopping list
 * @param {Object} item - { name, category, quantity, unit }
 * @param {string} username - User who is adding
 * @returns {Object} - { success, message, itemId }
 */
function addItem(item, username) { ... }

/**
 * Get shopping list grouped by category
 * @param {string} username - Current user
 * @returns {Object} - { items[], stats }
 */
function showList(username) { ... }

/**
 * Get shopping list grouped by store
 * @param {string} username - Current user
 * @returns {Object} - { byStore{}, total }
 */
function showListByStore(username) { ... }

/**
 * Mark item as purchased
 * @param {number} itemId - Item ID
 * @param {string} username - User marking as bought
 * @returns {Object} - { success, message }
 */
function markBought(itemId, username) { ... }

/**
 * Remove item from list
 * @param {number} itemId - Item ID
 * @returns {Object} - { success, message }
 */
function removeItem(itemId) { ... }

/**
 * Get smart purchase suggestions
 * @param {string} username - Current user
 * @returns {Object} - { suggestions[] }
 */
function showSuggestions(username) { ... }
```

**Database Queries:**

```javascript
// Get active items
const items = db.prepare('SELECT * FROM shopping_items WHERE purchased_at IS NULL').all();

// Mark as bought
db.prepare('UPDATE shopping_items SET purchased_at = CURRENT_TIMESTAMP WHERE id = ?').run(itemId);
db.prepare('INSERT INTO purchase_history (item_name, purchased_by, preferred_store) VALUES (?, ?, ?)').run(name, user, store);

// Delete item
db.prepare('DELETE FROM shopping_items WHERE id = ?').run(itemId);
```

---

#### **3. categorizer.js** - Auto-Categorization Engine

**Purpose:** Intelligently categorize products based on name

**Algorithm:**
```javascript
function categorize(productName) {
  const lower = productName.toLowerCase();
  
  // Check keywords for each category
  if (dairyKeywords.some(k => lower.includes(k))) return 'Dairy';
  if (produceKeywords.some(k => lower.includes(k))) return 'Produce';
  if (meatKeywords.some(k => lower.includes(k))) return 'Meat';
  // ... more categories
  
  return 'Other'; // Default fallback
}
```

**Category Rules:**

| Category | Keywords |
|----------|----------|
| **Dairy** | milk, cheese, yogurt, butter, cream |
| **Produce** | apple, banana, lettuce, tomato, carrot, broccoli, onion, orange juice |
| **Meat** | chicken, beef, pork, fish, lamb, turkey |
| **Bakery** | bread, bagel, muffin, croissant, cake |
| **Grains** | rice, pasta, cereal, oats, quinoa |
| **Snacks** | chips, cookies, crackers, nuts, candy, pepper, salt, sugar |
| **Beverages** | coffee, tea, soda, juice, water, drink |
| **Canned** | soup, beans, tuna, tomato sauce |
| **Frozen** | pizza, ice cream, frozen vegetables |
| **Household** | detergent, soap, shampoo, paper towels, cleaner |

---

#### **4. parser.js** - Natural Language Parser

**Purpose:** Interpret user commands in natural language

**Supported Command Patterns:**

```javascript
// Add commands
"add milk"
"add milk, eggs, bread"
"add 2 gallons of milk"
"需要买牛奶"
"购物: 牛奶, 鸡蛋"

// View commands
"show list"
"show shopping list"
"显示清单"
"what's on the list?"

// View by store
"show by store"
"按商店"
"by location"

// Mark bought
"bought milk"
"purchased eggs"
"已购买牛奶"

// Remove
"remove eggs"
"delete bread"
"删除鸡蛋"

// Suggestions
"suggestions"
"what should I buy?"
"建议"
```

**Parse Logic:**

```javascript
function parse(message) {
  const lower = message.toLowerCase();
  
  // Detect action
  if (/^(add|买|需要|购物)/i.test(lower)) {
    return { action: 'add', items: extractItems(message) };
  }
  if (/^(show|display|显示|查看).*list/i.test(lower)) {
    return { action: 'list' };
  }
  // ... more patterns
  
  return { action: 'unknown' };
}
```

---

#### **5. suggestions.js** - Smart Suggestion Engine

**Purpose:** Analyze purchase history and recommend items to buy

**Algorithm:**

```javascript
function getSuggestions(username) {
  const suggestions = [];
  
  // Get unique items from history
  const items = getUniqueItemsFromHistory();
  
  for (const item of items) {
    // Get all purchases of this item
    const purchases = getPurchaseHistory(item);
    
    if (purchases.length < 2) continue; // Need at least 2 data points
    
    // Calculate intervals between purchases
    const intervals = calculateIntervals(purchases);
    const avgInterval = average(intervals);
    const lastPurchase = purchases[0].purchased_at;
    const daysSince = daysBetween(lastPurchase, now());
    
    // Check if item is due for repurchase
    if (daysSince >= avgInterval * 0.9) { // 90% threshold
      suggestions.push({
        item: item,
        priority: daysSince >= avgInterval ? 'high' : 'medium',
        message: `You usually buy ${item} every ${avgInterval} days, it's been ${daysSince} days`,
        store: purchases[0].preferred_store
      });
    }
  }
  
  return suggestions.sort((a, b) => priorityScore(b) - priorityScore(a));
}
```

**Priority Scoring:**
- 🔴 **High Priority:** daysSince >= avgInterval (overdue)
- 🟡 **Medium Priority:** Frequently bought but no clear cycle

---

## 🔌 API Reference

### **Base URL:** `http://localhost:3000`

---

### **GET /api/list**

**Description:** Get shopping list grouped by category

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "milk",
      "category": "Dairy",
      "quantity": 1,
      "unit": null,
      "added_by": "Mom",
      "preferred_store": "Costco",
      "added_at": "2026-02-19 19:17:01"
    },
    ...
  ],
  "stats": {
    "total": 14,
    "categories": 7,
    "purchasedToday": 0
  }
}
```

---

### **GET /api/list-by-store**

**Description:** Get shopping list grouped by store

**Response:**
```json
{
  "byStore": {
    "Costco": {
      "Dairy": [
        { "id": 9, "name": "milk", ... }
      ],
      "Meat": [
        { "id": 5, "name": "chicken", ... }
      ]
    },
    "Walmart": {
      "Snacks": [
        { "id": 13, "name": "sugar", ... }
      ]
    }
  },
  "total": 14
}
```

---

### **POST /api/bought/:id**

**Description:** Mark item as purchased

**Parameters:**
- `id` (path) - Item ID

**Response:**
```json
{
  "success": true,
  "message": "Thanks Mom for buying milk! 🎉"
}
```

**Side Effects:**
1. Sets `purchased_at = CURRENT_TIMESTAMP` in shopping_items
2. Inserts record into purchase_history

---

### **DELETE /api/item/:id**

**Description:** Remove item from shopping list

**Parameters:**
- `id` (path) - Item ID

**Response:**
```json
{
  "success": true,
  "message": "Item removed from shopping list"
}
```

---

## 🔄 Data Flow

### **Adding an Item**

```
User Input: "add 2 gallons of milk"
         ↓
    parser.js
         ↓
  { action: 'add', items: [{ name: 'milk', qty: 2, unit: 'gallon' }] }
         ↓
  categorizer.js
         ↓
  { name: 'milk', category: 'Dairy', qty: 2, unit: 'gallon' }
         ↓
   handler.addItem()
         ↓
   Database INSERT
         ↓
   Response: "Added milk to shopping list"
```

---

### **Smart Suggestions**

```
User: "suggestions"
         ↓
  handler.showSuggestions()
         ↓
  suggestions.getSuggestions()
         ↓
  Query purchase_history
         ↓
  Calculate intervals
         ↓
  Detect due items
         ↓
  Return prioritized list
         ↓
  Response: "🔴 milk (7 day cycle, 7 days since last)"
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | v14+ | JavaScript runtime |
| **Web Framework** | Express.js | 4.x | HTTP server & routing |
| **Database** | SQLite3 | 3.x | Local relational DB |
| **DB Driver** | better-sqlite3 | 8.x | Fast synchronous SQLite API |
| **Frontend** | Vanilla JS | ES6+ | No framework overhead |
| **CSS** | Inline + CSS3 | - | Gradient design, responsive |
| **Deployment** | Cloudflare Tunnel | - | Free HTTPS public access |
| **Framework** | OpenClaw | - | Personal AI assistant platform |

**Total NPM Dependencies:** 3 (express, better-sqlite3, cors)

---

## 🎯 Design Decisions

### **Why SQLite over PostgreSQL/MySQL?**

**Rationale:**
- ✅ No separate server needed (simpler deployment)
- ✅ Zero configuration (works out of the box)
- ✅ Fast for read-heavy workloads
- ✅ Perfect for single-user/family use
- ✅ Easy backup (single file copy)
- ✅ ACID compliant
- ✅ Cross-platform

**Trade-offs:**
- ❌ Not ideal for concurrent writes (not an issue for family use)
- ❌ No built-in replication (not needed for MVP)

---

### **Why Vanilla JS over React/Vue?**

**Rationale:**
- ✅ No build step required
- ✅ Faster initial load
- ✅ Simpler to understand
- ✅ No framework lock-in
- ✅ Smaller codebase

**Trade-offs:**
- ❌ More manual DOM manipulation
- ❌ No component reusability (acceptable for MVP)

---

### **Why better-sqlite3 over node-sqlite3?**

**Rationale:**
- ✅ Synchronous API (simpler code)
- ✅ 2-3x faster performance
- ✅ No callback hell
- ✅ Better TypeScript support

**Trade-offs:**
- ❌ Blocks event loop (acceptable for low-concurrency use)

---

### **Why Cloudflare Tunnel over ngrok?**

**Rationale:**
- ✅ Completely free
- ✅ No account required for temp tunnels
- ✅ HTTPS included
- ✅ Fast & reliable

**Trade-offs:**
- ❌ Temporary URLs change on restart
- ✅ Can upgrade to named tunnels (with account)

---

## 📝 Future Architecture Considerations

### **Phase 2/3 Enhancements:**

1. **Add Redis caching layer** for faster reads
2. **Implement WebSockets** for real-time updates
3. **Add PostgreSQL option** for multi-device sync
4. **Implement GraphQL API** for flexible queries
5. **Add service worker** for offline support
6. **Implement proper ORM** (TypeORM or Prisma)

---

**Document Version:** 1.0.0  
**Last Updated:** February 19, 2026
