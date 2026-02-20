// Schedule Handler - Business logic for schedule management
const Database = require('better-sqlite3');
const path = require('path');
const { parseScheduleCommand, validateSchedule } = require('./parser');

const dbPath = path.join(__dirname, '..', 'schedule.db');

/**
 * Handle schedule-related commands
 * @param {string} message - User's message
 * @param {string} addedBy - Who is adding/querying (e.g., 'You', 'Mom')
 * @returns {Promise<string>} Response message
 */
async function handleScheduleCommand(message, addedBy = 'You') {
  const db = new Database(dbPath);
  
  try {
    // Parse the command
    const parsed = parseScheduleCommand(message);
    
    // Validate
    const validation = validateSchedule(parsed);
    if (!validation.valid) {
      return `❌ ${validation.errors.join(' ')}`;
    }
    
    // Route to appropriate handler
    if (parsed.action === 'add') {
      return addSchedule(db, parsed, addedBy);
    } else if (parsed.action === 'query') {
      return querySchedule(db, parsed);
    } else {
      return "I'm not sure what you want to do with the schedule. Try saying something like:\n" +
             "- 'Emma has piano lesson next Tuesday at 3pm'\n" +
             "- 'What's Emma's schedule today?'";
    }
  } finally {
    db.close();
  }
}

/**
 * Add a new schedule entry
 */
function addSchedule(db, parsed, addedBy) {
  // Get or create family member
  let member = db.prepare('SELECT id FROM family_members WHERE name = ?').get(parsed.member);
  
  if (!member) {
    db.prepare('INSERT INTO family_members (name) VALUES (?)').run(parsed.member);
    member = db.prepare('SELECT id FROM family_members WHERE name = ?').get(parsed.member);
  }
  
  // Format date
  const eventDate = parsed.date.toISOString().split('T')[0];
  
  // Insert schedule
  const insert = db.prepare(`
    INSERT INTO schedules (member_id, activity, event_date, event_time, location, added_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(
    member.id,
    parsed.activity,
    eventDate,
    parsed.time,
    parsed.location,
    addedBy
  );
  
  // Format response
  const dateStr = formatDate(parsed.date);
  const timeStr = parsed.time ? ` at ${formatTime(parsed.time)}` : '';
  const locationStr = parsed.location ? ` at ${parsed.location}` : '';
  const reminderStr = parsed.reminder ? "\n\n⏰ I'll remind you in the morning!" : '';
  
  return `✅ Got it! I've added ${parsed.member}'s ${parsed.activity} for ${dateStr}${timeStr}${locationStr}.${reminderStr}`;
}

/**
 * Query schedules
 */
function querySchedule(db, parsed) {
  let query = `
    SELECT s.*, m.name as member_name
    FROM schedules s
    JOIN family_members m ON s.member_id = m.id
    WHERE 1=1
  `;
  
  const params = [];
  
  // Filter by member
  if (parsed.member) {
    query += ' AND m.name = ?';
    params.push(parsed.member);
  }
  
  // Filter by date/range
  if (parsed.dateRange === 'today' || (parsed.date && !parsed.dateRange)) {
    const dateStr = (parsed.date || new Date()).toISOString().split('T')[0];
    query += ' AND s.event_date = ?';
    params.push(dateStr);
  } else if (parsed.dateRange === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    query += ' AND s.event_date = ?';
    params.push(tomorrow.toISOString().split('T')[0]);
  } else if (parsed.dateRange === 'week') {
    const today = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(today.getDate() + 7);
    query += ' AND s.event_date BETWEEN ? AND ?';
    params.push(today.toISOString().split('T')[0]);
    params.push(weekEnd.toISOString().split('T')[0]);
  }
  
  query += ' ORDER BY s.event_date, s.event_time';
  
  const events = db.prepare(query).all(...params);
  
  if (events.length === 0) {
    if (parsed.member) {
      return `📅 ${parsed.member} has no scheduled events${parsed.dateRange ? ' ' + parsed.dateRange : ''}.`;
    } else {
      return `📅 No scheduled events found${parsed.dateRange ? ' ' + parsed.dateRange : ''}.`;
    }
  }
  
  // Format response
  return formatScheduleList(events, parsed);
}

/**
 * Format schedule list for display
 */
function formatScheduleList(events, parsed) {
  let response = '';
  
  if (parsed.member) {
    response = `📅 **${parsed.member}'s Schedule**`;
  } else {
    response = `📅 **Family Schedule**`;
  }
  
  if (parsed.dateRange) {
    response += ` - ${parsed.dateRange.charAt(0).toUpperCase() + parsed.dateRange.slice(1)}`;
  }
  
  response += ':\n\n';
  
  // Group by member if querying all
  if (!parsed.member) {
    const byMember = {};
    events.forEach(e => {
      if (!byMember[e.member_name]) byMember[e.member_name] = [];
      byMember[e.member_name].push(e);
    });
    
    for (const [member, memberEvents] of Object.entries(byMember)) {
      response += `**${member}:**\n`;
      memberEvents.forEach(e => {
        response += formatEvent(e);
      });
      response += '\n';
    }
  } else {
    // Single member
    events.forEach(e => {
      response += formatEvent(e);
    });
  }
  
  return response.trim();
}

/**
 * Format a single event
 */
function formatEvent(event) {
  const date = new Date(event.event_date + 'T00:00:00');
  const dateStr = formatDate(date);
  const timeStr = event.event_time ? ` ${formatTime(event.event_time)}` : ' All day';
  const locationStr = event.location ? ` 📍 ${event.location}` : '';
  
  return `• ${dateStr} -${timeStr} - ${event.activity}${locationStr}\n`;
}

/**
 * Format date for display
 */
function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  
  return `${dayName}, ${monthName} ${day}`;
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

/**
 * Get today's schedules (for morning reminders)
 */
function getTodaySchedules() {
  const db = new Database(dbPath);
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const events = db.prepare(`
      SELECT s.*, m.name as member_name
      FROM schedules s
      JOIN family_members m ON s.member_id = m.id
      WHERE s.event_date = ?
      AND (s.reminded_at IS NULL OR s.reminded_at < ?)
      ORDER BY s.event_time
    `).all(today, today);
    
    return events;
  } finally {
    db.close();
  }
}

/**
 * Mark schedules as reminded
 */
function markAsReminded(scheduleIds) {
  const db = new Database(dbPath);
  
  try {
    const now = new Date().toISOString();
    const update = db.prepare('UPDATE schedules SET reminded_at = ? WHERE id = ?');
    
    scheduleIds.forEach(id => {
      update.run(now, id);
    });
  } finally {
    db.close();
  }
}

module.exports = {
  handleScheduleCommand,
  getTodaySchedules,
  markAsReminded,
  formatScheduleList
};
