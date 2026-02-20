# Morning Schedule Reminder - Cron Job Setup

This document explains how to set up the daily morning reminder for family schedules.

## Cron Job Configuration

Add this job to OpenClaw using the cron tool or gateway UI:

```json
{
  "name": "FamilyHub Morning Schedule Reminder",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * *",
    "tz": "America/Los_Angeles"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "Run the morning schedule reminder: load the schedule reminder system from ~/.openclaw/workspace/familyhub/schedule/reminder.js, call generateMorningReminder(), and if it returns a message, send it as the response.",
    "timeoutSeconds": 60
  },
  "delivery": {
    "mode": "announce",
    "channel": "whatsapp"
  },
  "sessionTarget": "isolated"
}
```

## Schedule Details

- **Time:** 8:00 AM daily (Pacific Time)
- **Action:** Check today's schedules and send reminder
- **Delivery:** WhatsApp message
- **Session:** Isolated (runs independently)

## How It Works

1. **8:00 AM daily:** Cron job triggers
2. **Agent loads** `schedule/reminder.js`
3. **Function called:** `generateMorningReminder()`
4. **Database query:** Gets today's events from `schedule.db`
5. **Groups by member:** Emma, Jeremy, Mom, Dad
6. **Formats message:**
   ```
   🌅 Good morning! Here's today's schedule:
   
   **Emma:**
     • 9:00 AM - Soccer practice 📍 Lincoln Park
     • 3:00 PM - Piano lesson
   
   **Jeremy:**
     • 4:00 PM - Basketball practice
   
   Have a great day! 😊
   ```
7. **Marks as reminded:** Updates database to prevent duplicate reminders
8. **Sends via WhatsApp:** Delivered to configured number

## Manual Testing

Test the reminder function manually:

```bash
cd ~/.openclaw/workspace/familyhub/schedule
node -e "
const { generateMorningReminder } = require('./reminder');
const message = generateMorningReminder();
if (message) {
  console.log(message);
} else {
  console.log('No events scheduled for today.');
}
"
```

## OpenClaw CLI Commands

### Add the cron job:
```bash
openclaw cron add --job cron-job-morning-reminder.json
```

### Check job status:
```bash
openclaw cron list
```

### Test run immediately:
```bash
openclaw cron run --job-id <job-id>
```

### View run history:
```bash
openclaw cron runs --job-id <job-id>
```

## Customization

### Change reminder time:
Edit the cron expression `"0 8 * * *"`:
- `0 7 * * *` - 7:00 AM
- `0 9 * * *` - 9:00 AM
- `30 8 * * *` - 8:30 AM

### Change timezone:
Edit `"tz": "America/Los_Angeles"` to your timezone:
- `"America/New_York"` - Eastern Time
- `"America/Chicago"` - Central Time
- `"America/Denver"` - Mountain Time
- `"UTC"` - Universal Time

### Disable reminders:
```bash
openclaw cron update --job-id <job-id> --enabled false
```

## Troubleshooting

### No reminder sent?
1. Check if there are events scheduled for today
2. Verify cron job is enabled: `openclaw cron list`
3. Check job run history: `openclaw cron runs --job-id <job-id>`
4. Verify WhatsApp connection is active

### Duplicate reminders?
- Check if multiple cron jobs are configured
- Verify `reminded_at` field is being updated in database

### Wrong timezone?
- Update the `tz` field in cron job configuration
- Restart the cron job after changes

## Notes

- Reminders are only sent if there are events scheduled for today
- Each event is marked as "reminded" to prevent duplicates
- The system uses isolated sessions to avoid interfering with main chat
- Messages are automatically delivered via WhatsApp channel

---

**Status:** ⏰ Ready to schedule!
**Next Step:** Add the cron job using OpenClaw CLI or Gateway UI
