# FamilyHub - AI Family Assistant 🏠

**Version:** 1.0.1 (MVP)  
**Status:** ✅ Production Ready  
**Cost:** $0 (Completely Free)  
**Last Updated:** February 20, 2026

> **An AI-powered family coordination platform that manages shopping lists, schedules, and daily routines through natural language interaction.**

**🎉 Current Features (MVP):**
- ✅ Smart Shopping List Management
- ✅ Family Schedule Coordination
- ✅ WhatsApp Integration
- ✅ Morning Reminders

**🚀 Coming Soon:**
- 📊 Expense Tracking
- 🍳 Meal Planning
- 🧹 Chore Management
- 📸 Photo & Memory Sharing
- 📍 Location-Based Reminders
- 💰 Price Tracking

---

## 🎯 At a Glance

- 🛒 **Smart Shopping Lists:** Natural language, smart suggestions, multi-user tracking
- 📅 **Family Schedules:** Manage activities for all family members with reminders
- ⏰ **Morning Reminders:** Daily schedule notifications at 8:00 AM
- 👨‍👩‍👧‍👦 **Multi-Member Support:** Mom, Dad, Emma, Jeremy (easily extendable)
- 🌐 **Modern Dashboard:** Beautiful web interface with real-time updates
- 💬 **WhatsApp Integration:** Control everything via WhatsApp messages
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

**FamilyHub** is an AI-powered family coordination platform that helps families manage daily activities through natural language interaction. Currently includes two core modules: Shopping List Management and Family Schedule Coordination, with more modules planned.

### **Target Users**
Busy families with 2-6 members, particularly dual-income households with children aged 4-16.

### **Key Problems Solved**
- ❌ Uncoordinated family schedules and missed activities
- ❌ Redundant purchases & food waste
- ❌ Scattered information (notes, verbal, memory)
- ❌ Lack of proactive reminders for daily routines
- ❌ Poor coordination between family members

### **Key Differentiator**
FamilyHub doesn't just store data—it actively helps coordinate family life through AI-powered natural language understanding, smart reminders, and proactive suggestions.

**What makes FamilyHub unique:**
- 🧠 Unified platform for shopping AND schedules
- 🤖 Intelligent natural language processing
- 👨‍👩‍👧‍👦 Multi-member family coordination
- ⏰ Proactive morning reminders
- 💬 WhatsApp integration for easy access
- 📊 Web Dashboard for visual management
- 🔄 Automatic routing between modules

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js v14+ 
- SQLite3
- OpenClaw Framework

### **Installation**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/familyhub.git
cd familyhub

# Install dependencies
npm install

# Initialize databases
node init-db.js
node schedule/init-schedule-db.js

# Start server
node server.js

# Access Dashboard
# Open http://localhost:3000/dashboard.html in your browser
```

### **Usage Examples**

#### **Shopping via WhatsApp:**
```
"add milk to shopping list"
"show shopping list"
"bought eggs"
"what should I buy?"
```

#### **Schedule via WhatsApp:**
```
"Emma has piano lesson next Tuesday at 3pm"
"What's Emma's schedule today?"
"Jeremy has basketball practice tomorrow at 4pm"
"Show me this week's schedule"
```

#### **Via Web Dashboard:**
- Open `http://localhost:3000/dashboard.html`
- View shopping list by Category or by Store
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
familyhub/
├── README.md                   # This file - Project overview
├── REQUIREMENTS.md             # Detailed requirements checklist
├── ARCHITECTURE.md             # Code & database architecture
├── IMPLEMENTATION_STATUS.md    # Implementation status report
├── COMPLETE_SUMMARY.md         # Project completion summary
├── INTEGRATION_COMPLETE.md     # Integration details
├── SKILL.md                    # OpenClaw skill documentation
├── .gitignore                  # Git ignore rules
│
├── shopping.db                 # Shopping list database
├── init-db.js                  # Shopping DB initialization
├── handler.js                  # Shopping list handler
├── parser.js                   # Shopping command parser
├── categorizer.js              # Item categorization
├── suggestions.js              # Smart suggestions
│
├── schedule.db                 # Family schedule database (in schedule/)
├── schedule/                   # Schedule management module
│   ├── init-schedule-db.js     # Schedule DB initialization
│   ├── handler.js              # Schedule handler
│   ├── parser.js               # Schedule parser (chrono-node)
│   ├── reminder.js             # Morning reminder logic
│   ├── cron-job-morning-reminder.json  # Cron config
│   ├── REMINDER_SETUP.md       # Reminder setup guide
│   └── TEST_REPORT.md          # Test results
│
├── familyhub-handler.js        # Unified message handler
├── router.js                   # Message routing logic
│
├── server.js                   # Express API server
├── dashboard.html              # Web dashboard UI
│
└── package.json                # Node.js dependencies
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
- Chat-based interaction via OpenClaw
- WhatsApp integration fully operational

#### **5. WhatsApp Integration**
- Real-time messaging integration
- Natural language command processing
- Multi-user support via phone number allowlist
- Self-chat mode for personal use
- Media support (up to 50MB)

**Setup Instructions:**
Configure your phone number in OpenClaw config (`~/.openclaw/openclaw.json`):
```json
"channels": {
  "whatsapp": {
    "dmPolicy": "allowlist",
    "allowFrom": ["+1XXXXXXXXXX"],  // Replace with your number
    "selfChatMode": true
  }
}
```

### **📋 Planned Features (Phase 2/3)**
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

## 📊 Current MVP Status (v1.0.1)

**🎯 Implemented Features:**
- ✅ **Shopping List Management** - Full CRUD operations with natural language
- ✅ **Family Schedule Coordination** - 4 family members, natural date/time parsing
- ✅ **WhatsApp Integration** - Real-time messaging, self-chat mode
- ✅ **Morning Reminders** - Automated daily schedule notifications at 8:00 AM
- ✅ **Web Dashboard** - Modern UI with dual views (by category/by store)
- ✅ **Smart Suggestions** - Purchase history analysis and cycle detection
- ✅ **Multi-User Support** - Track who added items, assign activities to family members
- ✅ **Message Routing** - Intelligent routing between shopping and schedule modules

**📈 Implementation Progress:**
- **MVP Features:** 100% Complete (30/30 features)
- **Overall Project:** 55% Complete (30/55 planned features)
- **Test Coverage:** 91.7% success rate
- **Production Status:** ✅ Ready for daily use

---

## 🔮 Future Roadmap

### **Phase 2: Enhanced Intelligence (Planned)**
- 📊 Expense tracking and budgeting
- 🍳 Meal planning with recipe suggestions
- 💰 Price tracking and shopping optimization
- 📈 Shopping history analytics
- 🔄 Recurring item auto-detection
- 🔔 Smart notifications based on usage patterns

### **Phase 3: Advanced Features (Planned)**
- 📸 Photo recognition (snap empty container → auto-add)
- 📱 Barcode scanning for quick item addition
- 📍 Location-based reminders (notify when near store)
- 🗓️ Calendar integration (sync with Google Calendar/iCal)
- 👥 Additional messaging platforms (Telegram, Discord)
- 🎙️ Voice commands and responses

### **Future Modules (Planned)**
- 🧹 **Module 3.3:** Chore Distribution System
- 💰 **Module 3.4:** Family Financial Tracker
- 📸 **Module 3.5:** Photo & Memory Management
- 🍽️ **Module 3.6:** Meal Planning & Recipe Suggestions
- 🎓 **Module 3.7:** Homework & School Activity Tracker
- 🏥 **Module 3.8:** Health & Medical Records Manager

**📅 Estimated Timeline:**
- Phase 2: Q2 2026 (2-3 months)
- Phase 3: Q3 2026 (3-4 months)
- Additional Modules: Q4 2026+

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
