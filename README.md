# FamilyHub Shopping List Manager 🛒

**Version:** 1.0.0 MVP  
**Status:** ✅ Production Ready  
**Cost:** $0 (Completely Free)  
**Last Updated:** February 19, 2026

> **An AI-powered shopping list manager that learns your family's purchasing patterns and provides intelligent suggestions.**

---

## 🎯 At a Glance

- ✅ **Natural Language:** Add items by simply saying "add milk"
- 🧠 **Smart Suggestions:** AI learns your purchasing cycles and reminds you what to buy
- 👨‍👩‍👧‍👦 **Multi-User:** Track who added each item (Mom, Dad, Emma, etc.)
- 🏪 **Store Organization:** View your list by category or by store location
- 🌐 **Modern Dashboard:** Beautiful web interface with real-time updates
- 💰 **Zero Cost:** Completely free, no subscriptions or hidden fees

---

## 📖 Table of Contents

1. [Quick Start](#-quick-start)
2. [Features](#-features)
3. [Documentation](#-documentation)
4. [Screenshots](#-screenshots)
5. [Technology Stack](#️-technology-stack)
6. [Project Structure](#-project-structure)
7. [Roadmap](#-roadmap)
8. [Contributing](#-contributing)
9. [License](#-license)

---

## 🎯 Executive Summary

**FamilyHub Shopping List Manager** is the first module of the FamilyHub AI-powered family coordination platform. It transforms grocery shopping from chaos to harmony through intelligent list management, natural language interaction, and smart purchase suggestions.

### **Target Users**
Busy families with 2-6 members, particularly dual-income households with children aged 4-16.

### **Key Problems Solved**
- ❌ Redundant purchases & food waste
- ❌ Scattered shopping information (notes, verbal, memory)
- ❌ Forgetting what to buy while at the store
- ❌ Lack of coordination between family members

### **Key Differentiator**
Unlike generic shopping list apps, FamilyHub Shopping List Manager:
- 🧠 Learns your family's purchasing patterns
- 🤖 Provides intelligent suggestions based on history
- 👨‍👩‍👧‍👦 Tracks who added what (multi-user awareness)
- 🏪 Organizes by store location for efficient shopping
- 💬 Natural language interaction (English & Chinese)
- 📊 Web Dashboard with dual views (By Category / By Store)

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js v14+ 
- SQLite3
- OpenClaw Framework

### **Installation**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/familyhub-shopping.git
cd familyhub-shopping

# Install dependencies
npm install

# Initialize database
node init-db.js

# Start server
node server.js

# Access Dashboard
# Open http://localhost:3000/dashboard.html in your browser
```

### **Usage Examples**

#### **Via Chat/WhatsApp:**
```
"add milk to shopping list"
"show shopping list"
"bought eggs"
"what should I buy?"
```

#### **Via Web Dashboard:**
- Open `http://localhost:3000/dashboard.html`
- View by Category or by Store
- Click "Bought" to mark purchased
- Click "Remove" to delete items

---

## 📚 Documentation

For detailed information, please refer to:

- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - Complete feature requirements checklist (original requirements vs implemented)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Code architecture, database schema, and technical design
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Current implementation status and roadmap
- **[API_REFERENCE.md](./API_REFERENCE.md)** - REST API documentation
- **[SUMMARY.md](./SUMMARY.md)** - Project completion summary

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Database** | SQLite3 | Lightweight, local, zero-config storage |
| **Backend** | Node.js + Express | RESTful API server |
| **Frontend** | HTML + Vanilla JS | Modern gradient UI, responsive design |
| **AI/NLP** | Custom parser | Natural language command interpretation |
| **Deployment** | Cloudflare Tunnel | Free public HTTPS access |
| **Framework** | OpenClaw | Personal AI assistant framework |

**Total Infrastructure Cost:** $0 (completely free)

---

## 📂 Project Structure

```
familyhub-shopping/
├── README.md                   # This file - Project overview
├── REQUIREMENTS.md             # Detailed requirements checklist
├── ARCHITECTURE.md             # Code & database architecture
├── IMPLEMENTATION_STATUS.md    # Implementation status report
├── SUMMARY.md                  # Project completion summary
├── GIT_COMMIT_GUIDE.md         # Git commit instructions
├── .gitignore                  # Git ignore rules
│
├── shopping.db                 # SQLite database (excluded from git)
├── init-db.js                  # Database initialization script
│
├── server.js                   # Express API server (main entry point)
├── handler.js                  # Core business logic (CRUD operations)
├── categorizer.js              # Smart product categorization
├── parser.js                   # Natural language command parser
├── suggestions.js              # Smart purchase suggestion engine
│
├── dashboard.html              # Main web dashboard UI
├── dashboard-debug.html        # Debug page (raw API data viewer)
│
├── package.json                # Node.js project configuration
├── package-lock.json           # Dependency lock file
└── node_modules/               # Dependencies (excluded from git)
```

---

## 🎨 Features Overview

### **✅ Core Features (Implemented)**

#### **1. Shopping List Management**
- Add/view/mark-bought/delete items
- Multi-user tracking (Mom, Dad, Emma, etc.)
- Quantity and unit support (e.g., "2 gallons", "3 bottles")
- Automatic categorization (10+ categories)
- Store location assignment (JJ Bakery, 99 Ranch, Costco, Walmart)

#### **2. Smart Suggestions**
- Purchase history analysis
- Cycle detection (e.g., "milk every 7 days")
- Priority-based recommendations
- Intelligent reminders

#### **3. Dual-View Dashboard**
- **By Category View:** Organize by product type (Dairy, Produce, etc.)
- **By Store View:** Organize by shopping location
- Real-time statistics (total items, categories, purchased today)
- Interactive buttons (Bought, Remove, Refresh)
- Modern gradient UI design
- Auto-refresh every 30 seconds

#### **4. Natural Language Interface**
- English & Chinese command support
- Flexible command parsing
- Chat-based interaction
- WhatsApp integration (configured, pending pairing)

### **📋 Planned Features (Phase 2/3)**
- Voice input via WhatsApp/Telegram
- Photo recognition (snap empty container → auto-add)
- Barcode scanning
- Location-based reminders
- Price tracking & comparison
- Recipe integration

---

## 🏗️ Architecture Highlights

### **Database Schema**
- **shopping_items:** Current shopping list
- **purchase_history:** Historical purchase data for smart suggestions

### **API Endpoints**
- `GET /api/list` - Get shopping list (by category)
- `GET /api/list-by-store` - Get shopping list (by store)
- `POST /api/bought/:id` - Mark item as purchased
- `DELETE /api/item/:id` - Remove item from list

### **Key Components**
- **Handler:** Business logic layer
- **Categorizer:** ML-like categorization engine
- **Parser:** Natural language processor
- **Suggestions:** Purchase prediction algorithm

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 📊 Current Data

- **Total Items:** 14
- **Categories:** 7 (Bakery, Beverages, Dairy, Grains, Meat, Produce, Snacks, Household)
- **Stores:** 4 (JJ Bakery, 99 Ranch, Costco, Walmart)
- **Users:** 3 (Mom, Dad, Emma)

---

## 🔮 Future Roadmap

### **Phase 2: Enhanced Intelligence**
- Recurring item detection
- Price tracking
- Shopping history analytics
- Meal planning integration

### **Phase 3: Advanced Features**
- Voice input (WhatsApp/Telegram)
- Photo recognition
- Barcode scanning
- Location-based reminders

### **Next Modules**
- 3.2 Kids' Schedule Manager
- 3.3 Chore Distribution System
- 3.4 Family Financial Tracker
- 3.5 Photo & Memory Management
- 3.6 Meal Planning & Recipe Suggestions

---

## 🤝 Contributing

This is a personal family project, but contributions and suggestions are welcome!

---

## 📄 License

MIT License - Free to use and modify for personal and family use.

---

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for families, powered by OpenClaw**
