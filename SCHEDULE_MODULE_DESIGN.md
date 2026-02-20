# Schedule Module Design - FamilyHub Module 3.2

**Project:** FamilyHub Schedule Manager (Module 3.2)  
**Version:** 1.0.0 Design Phase  
**Created:** February 19, 2026  
**Integration:** Extends Module 3.1 (Shopping List Manager)

---

## 🎯 Overview

Add family schedule management capabilities to the existing FamilyHub system. Users can record, query, and receive reminders for family member activities via WhatsApp.

---

## 📐 Requirements

### **Functional Requirements**

#### **1. Schedule Entry**
- Add events via natural language (WhatsApp)
- Parse event details: member, activity, date, time
- Support recurring events (optional Phase 2)
- Multiple members per event (e.g., "family dinner")

#### **2. Schedule Query**
- Query by member: "What's Emma's schedule today?"
- Query by date: "What's happening tomorrow?"
- Query by date range: "Show me this week's schedule"
- Query all: "What's everyone's schedule today?"

#### **3. Reminder System**
- Morning reminders (configurable time, e.g., 8am)
- Pre-event reminders (optional: 1 hour before)
- WhatsApp delivery
- Batch reminders (multiple events in one message)

#### **4. Multi-User Support**
- Track schedules for multiple family members
- Family member management (add/remove/list)
- Default members: Mom, Dad, Emma (from shopping list)

---

## 🗄️ Database Schema

### **New Tables**

#### **family_members**
```sql
CREATE TABLE family_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  role TEXT,  -- 'parent', 'child', 'other'
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **schedules**
```sql
CREATE TABLE schedules (
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
  reminded_at DATETIME,  -- Track if reminder sent
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);
```

#### **reminder_settings**
```sql
CREATE TABLE reminder_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reminder_type TEXT NOT NULL,  -- 'morning', 'pre-event'
  reminder_time TIME,  -- For morning reminders
  minutes_before INTEGER,  -- For pre-event reminders
  enabled BOOLEAN DEFAULT 1
);
```

---

## 🏗️ Architecture

### **File Structure**

```
familyhub-shopping/  (rename to familyhub/)
├── shopping/
│   ├── handler.js
│   ├── categorizer.js
│   └── suggestions.js
├── schedule/
│   ├── schedule-handler.js     # CRUD operations for schedules
│   ├── schedule-parser.js      # Natural language parsing
│   ├── schedule-formatter.js   # Format output messages
│   └── reminder-system.js      # Reminder logic and cron jobs
├── shared/
│   ├── db.js                   # Database connection utility
│   └── nlp-utils.js            # Shared NLP functions
├── server.js                   # Unified API server
├── router.js                   # Route incoming messages
├── init-db.js                  # Database initialization (updated)
└── dashboard.html              # (Future: unified dashboard)
```

---

## 🔄 Message Routing Logic

### **Router (router.js)**

Incoming WhatsApp message → Analyze intent → Route to handler

```javascript
function routeMessage(message) {
  const lower = message.toLowerCase();
  
  // Shopping list patterns
  if (/add.*shopping|buy|bought|what should i buy/i.test(lower)) {
    return 'shopping';
  }
  
  // Schedule patterns
  if (/schedule|training|lesson|appointment|remind|what.*doing|plans/i.test(lower)) {
    return 'schedule';
  }
  
  // Default: try both and merge results
  return 'auto';
}
```

---

## 🧠 Natural Language Parsing

### **Schedule Parser (schedule-parser.js)**

#### **Input Examples:**
1. "This is Emma's training schedule on Saturday 9am, please remind me"
2. "Add piano lesson for Emma next Tuesday 3pm"
3. "Emma has dentist appointment tomorrow at 2pm"

#### **Parsing Rules:**

**Member Extraction:**
- Pattern: `(Emma|Mom|Dad|[Name])'s` or `for (Emma|Mom|Dad)`
- Default: If not specified, ask or use "Family"

**Activity Extraction:**
- Everything between member and date/time
- Keywords: training, lesson, appointment, practice, class, etc.

**Date Extraction:**
- Absolute: "Saturday", "next Tuesday", "tomorrow", "2026-02-20"
- Relative: "today", "tomorrow", "next week"
- Library: Use chrono-node or date-fns for parsing

**Time Extraction:**
- Pattern: `(\d{1,2})(am|pm|:\d{2})` 
- Examples: "9am", "3pm", "14:30"
- Default: If not specified, mark as "all-day"

**Reminder Request:**
- Pattern: `remind|reminder|alert|notify`
- Action: Set reminder flag

---

## 🔔 Reminder System

### **OpenClaw Cron Integration**

Use OpenClaw's cron system for scheduled reminders:

```javascript
// Example: Morning reminder at 8am daily
{
  "name": "Morning Schedule Reminder",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * *",  // Every day at 8:00 AM
    "tz": "America/Los_Angeles"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "Check today's family schedule and send reminders if needed",
    "timeoutSeconds": 60
  },
  "delivery": {
    "mode": "announce",
    "channel": "whatsapp"
  },
  "sessionTarget": "isolated"
}
```

### **Reminder Logic (reminder-system.js)**

```javascript
async function sendMorningReminders() {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's events
  const events = db.prepare(`
    SELECT s.*, m.name as member_name
    FROM schedules s
    JOIN family_members m ON s.member_id = m.id
    WHERE s.event_date = ?
    AND (s.reminded_at IS NULL OR s.reminded_at < ?)
  `).all(today, today);
  
  if (events.length === 0) {
    return; // No reminders needed
  }
  
  // Group by member
  const byMember = groupBy(events, 'member_name');
  
  // Format message
  let message = "🗓️ Today's Schedule:\n\n";
  for (const [member, memberEvents] of Object.entries(byMember)) {
    message += `**${member}:**\n`;
    memberEvents.forEach(e => {
      message += `  • ${e.event_time || 'All day'} - ${e.activity}\n`;
      if (e.location) message += `    📍 ${e.location}\n`;
    });
    message += '\n';
  }
  
  // Send via WhatsApp (OpenClaw handles delivery)
  return message;
}
```

---

## 📡 API Endpoints

### **Schedule Management**

```
POST /api/schedule/add
  Body: { member, activity, date, time, location, notes }
  Returns: { id, success, message }

GET /api/schedule/query
  Query: ?member=Emma&date=2026-02-20
  Returns: { events: [...], total }

GET /api/schedule/today
  Returns: { events: [...], byMember: {...} }

GET /api/schedule/week
  Returns: { events: [...], byDay: {...} }

DELETE /api/schedule/:id
  Returns: { success, message }

PUT /api/schedule/:id
  Body: { activity, date, time, ... }
  Returns: { success, message }
```

### **Family Members**

```
GET /api/members
  Returns: { members: [...] }

POST /api/members/add
  Body: { name, role }
  Returns: { id, success }
```

---

## 🎨 User Experience Flow

### **Flow 1: Add Schedule**

**User (WhatsApp):**
> "This is Emma's piano lesson next Tuesday at 3pm, remind me in the morning"

**System:**
1. Parse: member=Emma, activity="piano lesson", date=next Tuesday, time=3pm, reminder=morning
2. Save to database
3. Create morning reminder cron job (if not exists)

**Response:**
> ✅ Got it! I've added Emma's piano lesson for Tuesday, Feb 25 at 3:00 PM. I'll remind you on Tuesday morning.

---

### **Flow 2: Query Schedule**

**User (WhatsApp):**
> "What's Emma's schedule today?"

**System:**
1. Parse: member=Emma, date=today
2. Query database
3. Format response

**Response:**
> 📅 Emma's Schedule - Today (Feb 19):
> 
> • 9:00 AM - Soccer practice
>   📍 Lincoln Park
> 
> • 3:00 PM - Piano lesson
>   📍 Music Academy

---

### **Flow 3: Morning Reminder**

**System (8:00 AM daily):**
> 🗓️ Good morning! Here's today's schedule:
> 
> **Emma:**
> • 9:00 AM - Soccer practice at Lincoln Park
> • 3:00 PM - Piano lesson at Music Academy
> 
> **Mom:**
> • 10:00 AM - Dentist appointment
> 
> **Dad:**
> • All day - Work from home

---

## 🚀 Implementation Plan

### **Phase 1: Core Functionality (2-3 days)**

**Day 1:**
- [x] Design document (this file)
- [ ] Database schema and migration
- [ ] Basic schedule CRUD operations
- [ ] Schedule parser (basic patterns)

**Day 2:**
- [ ] Message routing system
- [ ] WhatsApp command integration
- [ ] Query functionality (by member, by date)
- [ ] Manual testing

**Day 3:**
- [ ] Reminder system setup
- [ ] OpenClaw cron integration
- [ ] Morning reminder logic
- [ ] End-to-end testing

### **Phase 2: Enhancements (Optional)**

- [ ] Recurring events (weekly piano lessons)
- [ ] Pre-event reminders (1 hour before)
- [ ] Web dashboard integration
- [ ] Edit/delete via WhatsApp
- [ ] Location-based reminders (future)

---

## 🧪 Test Cases

### **Test 1: Add Schedule**
```
Input: "Emma has soccer practice tomorrow at 9am at Lincoln Park"
Expected:
  - member: Emma
  - activity: soccer practice
  - date: tomorrow's date
  - time: 09:00
  - location: Lincoln Park
```

### **Test 2: Query Today**
```
Input: "What's Emma's schedule today?"
Expected: List of Emma's events for today
```

### **Test 3: Query Member**
```
Input: "What's happening this week?"
Expected: All family events for current week
```

### **Test 4: Morning Reminder**
```
Cron: Runs at 8:00 AM
Expected: WhatsApp message with today's schedule
```

---

## 💾 Database Migration

### **init-schedule-db.js**

```javascript
const Database = require('better-sqlite3');
const db = new Database('familyhub.db');

// Create family_members table
db.exec(`
  CREATE TABLE IF NOT EXISTS family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    role TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

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

// Insert default family members (from shopping list)
db.exec(`
  INSERT OR IGNORE INTO family_members (name, role) VALUES
    ('Mom', 'parent'),
    ('Dad', 'parent'),
    ('Emma', 'child')
`);

console.log('✅ Schedule database initialized!');
db.close();
```

---

## 🔗 Integration with Shopping List

### **Unified System**

Both modules share:
- Database connection
- WhatsApp integration
- Natural language parsing utilities
- Family member list

### **Message Router**

Single entry point for all WhatsApp messages:
```
WhatsApp → router.js → shopping-handler.js OR schedule-handler.js
```

---

## 📊 Success Metrics

- ✅ Successfully parse 90%+ of schedule commands
- ✅ Morning reminders sent reliably at configured time
- ✅ <1 second response time for queries
- ✅ Zero conflicts with existing shopping list functionality

---

## 🚧 Potential Challenges

1. **Date/Time Parsing Complexity**
   - Solution: Use proven library (chrono-node)
   
2. **Time Zone Handling**
   - Solution: Store timezone in settings, use consistent UTC internally
   
3. **Ambiguous Commands**
   - Solution: Ask clarifying questions via WhatsApp
   
4. **Reminder Delivery Reliability**
   - Solution: Use OpenClaw's robust cron system

---

## 📝 Next Steps

1. Review and approve this design
2. Rename project folder: `familyhub-shopping` → `familyhub`
3. Implement database schema
4. Build schedule parser
5. Integrate with WhatsApp
6. Set up reminder cron jobs
7. Test end-to-end

---

**Status:** 🟡 Design Complete - Ready for Implementation  
**Estimated Completion:** 2-3 days  
**Dependencies:** Module 3.1 (Shopping List) must remain functional
