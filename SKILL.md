# FamilyHub - AI Family Assistant Skill

This skill enables OpenClaw to coordinate family life through shopping list management and schedule coordination via natural language.

## Overview

FamilyHub is not just a shopping list manager—it's a comprehensive family coordination platform that helps manage:
- 🛒 Shopping lists with smart categorization
- 📅 Family member schedules and activities
- ⏰ Morning reminders for daily activities

## Usage

The FamilyHub skill automatically routes messages to the appropriate module (shopping or schedule) based on message content.

### Shopping List Commands

- "add milk to shopping list"
- "show shopping list"
- "bought eggs"
- "what should I buy?"

### Schedule Management Commands

- "Emma has piano lesson next Tuesday at 3pm"
- "What's Emma's schedule today?"
- "Jeremy has basketball practice tomorrow at 4pm"
- "Show me this week's schedule"

## Installation

This skill is located at: `~/.openclaw/workspace/familyhub`

To use it with OpenClaw, the main handler is: `familyhub-handler.js`

## Architecture

- **familyhub-handler.js** - Main entry point, routes messages
- **router.js** - Intelligent message routing (shopping vs schedule)
- **handler.js** - Shopping list logic
- **schedule/handler.js** - Schedule management logic
- **shopping.db** - Shopping list database (independent)
- **schedule.db** - Schedule database (independent)

**Design Pattern:** Independent modules with unified routing—keeps data isolated while providing seamless user experience.

## Family Members

- Mom (parent)
- Dad (parent)
- Emma (child)
- Jeremy (child)

Add more members via database:
```sql
INSERT INTO family_members (name, role) VALUES ('Name', 'role');
```

Then update `schedule/parser.js` regex to recognize the new name.

## Morning Reminders

Configure daily 8:00 AM reminders via OpenClaw cron:
```bash
cd ~/.openclaw/workspace/familyhub/schedule
openclaw cron add --job cron-job-morning-reminder.json
```

See `schedule/REMINDER_SETUP.md` for details.
