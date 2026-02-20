// Schedule Parser - Natural Language Processing for Schedule Commands
const chrono = require('chrono-node');

/**
 * Parse a natural language schedule command
 * @param {string} message - The user's message
 * @returns {object} Parsed schedule information
 */
function parseScheduleCommand(message) {
  const result = {
    action: null,      // 'add', 'query', 'list'
    member: null,      // 'Emma', 'Mom', 'Dad'
    activity: null,    // 'piano lesson', 'training'
    date: null,        // Date object
    time: null,        // 'HH:MM' string
    location: null,    // Location string
    reminder: false,   // Whether to set reminder
    dateRange: null    // 'today', 'tomorrow', 'this week'
  };

  const lower = message.toLowerCase();

  // Determine action
  if (/what|show|list|tell me|schedule\?/i.test(message)) {
    result.action = 'query';
  } else if (/add|record|save|has|this is|schedule on/i.test(message)) {
    result.action = 'add';
  }

  // Extract member name
  const memberMatch = message.match(/(Emma|Mom|Dad|Jeremy)'?s?\s+|for\s+(Emma|Mom|Dad|Jeremy)/i);
  if (memberMatch) {
    result.member = (memberMatch[1] || memberMatch[2]).charAt(0).toUpperCase() + 
                    (memberMatch[1] || memberMatch[2]).slice(1).toLowerCase();
  }

  // Check for reminder request
  if (/remind|reminder|alert|notify/i.test(message)) {
    result.reminder = true;
  }

  // Extract date using chrono-node
  const parsedDates = chrono.parse(message);
  if (parsedDates.length > 0) {
    result.date = parsedDates[0].start.date();
    
    // Extract time if available
    if (parsedDates[0].start.get('hour') !== null) {
      const hour = parsedDates[0].start.get('hour');
      const minute = parsedDates[0].start.get('minute') || 0;
      result.time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  }

  // Handle date range queries
  if (/today/i.test(lower)) {
    result.dateRange = 'today';
    result.date = new Date();
  } else if (/tomorrow/i.test(lower)) {
    result.dateRange = 'tomorrow';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    result.date = tomorrow;
  } else if (/this week|week/i.test(lower)) {
    result.dateRange = 'week';
  }

  // Extract activity (text between member and date/time)
  if (result.action === 'add') {
    // Start with original message
    let activityText = message;
    
    // Remove member mention
    if (memberMatch) {
      activityText = activityText.replace(memberMatch[0], '').trim();
    }
    
    // Clean up common command phrases first
    activityText = activityText
      .replace(/^(this is|please record|save|add|schedule)\s+/gi, '')
      .replace(/^\s*has\s+/gi, '')  // Remove leading "has"
      .replace(/,?\s*please remind me.*$/gi, '')
      .trim();
    
    // Remove the date/time text that was matched by chrono
    if (parsedDates.length > 0 && parsedDates[0].text) {
      // Remove the matched date text and everything after it
      const dateTextIndex = activityText.toLowerCase().indexOf(parsedDates[0].text.toLowerCase());
      if (dateTextIndex >= 0) {
        activityText = activityText.substring(0, dateTextIndex).trim();
      }
    }
    
    // Extract location (after "at" but before end, and not a time)
    const locationMatch = activityText.match(/\s+at\s+([a-zA-Z\s]+?)$/i);
    if (locationMatch && !/\d/.test(locationMatch[1])) {
      result.location = locationMatch[1].trim();
      activityText = activityText.replace(locationMatch[0], '').trim();
    }
    
    result.activity = activityText || null;
  }

  return result;
}

/**
 * Validate parsed schedule data
 * @param {object} parsed - Parsed schedule data
 * @returns {object} { valid: boolean, errors: string[] }
 */
function validateSchedule(parsed) {
  const errors = [];

  if (parsed.action === 'add') {
    if (!parsed.member) {
      errors.push('Could not determine family member. Please mention Emma, Mom, Dad, or Jeremy.');
    }
    if (!parsed.activity) {
      errors.push('Could not determine the activity. Please describe what the event is.');
    }
    if (!parsed.date) {
      errors.push('Could not determine the date. Please specify when this event is.');
    }
  }

  if (parsed.action === 'query') {
    if (!parsed.member && !parsed.dateRange && !parsed.date) {
      errors.push('Please specify who or when you want to check the schedule for.');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  parseScheduleCommand,
  validateSchedule
};
