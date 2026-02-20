// Morning Reminder System
// Sends daily schedule reminders via WhatsApp
const { getTodaySchedules, markAsReminded } = require('./handler');

/**
 * Generate morning reminder message
 * Called by OpenClaw cron job every morning
 * @returns {string} Reminder message or empty if no events
 */
function generateMorningReminder() {
  const events = getTodaySchedules();
  
  if (events.length === 0) {
    return ''; // No events today, no reminder needed
  }
  
  // Group by member
  const byMember = {};
  events.forEach(event => {
    if (!byMember[event.member_name]) {
      byMember[event.member_name] = [];
    }
    byMember[event.member_name].push(event);
  });
  
  // Build reminder message
  let message = '🌅 Good morning! Here\'s today\'s schedule:\n\n';
  
  for (const [member, memberEvents] of Object.entries(byMember)) {
    message += `**${member}:**\n`;
    memberEvents.forEach(event => {
      const timeStr = event.event_time ? formatTime(event.event_time) : 'All day';
      const locationStr = event.location ? ` 📍 ${event.location}` : '';
      message += `  • ${timeStr} - ${event.activity}${locationStr}\n`;
    });
    message += '\n';
  }
  
  message += 'Have a great day! 😊';
  
  // Mark these events as reminded
  const eventIds = events.map(e => e.id);
  markAsReminded(eventIds);
  
  return message;
}

/**
 * Format time for display (convert 24h to 12h)
 */
function formatTime(time) {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

module.exports = {
  generateMorningReminder
};
