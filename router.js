// Message Router - Route incoming messages to appropriate handlers

/**
 * Route an incoming message to the appropriate handler
 * @param {string} message - The user's message
 * @returns {string} 'shopping', 'schedule', or 'auto'
 */
function routeMessage(message) {
  const lower = message.toLowerCase();
  
  // Shopping list keywords
  const isShoppingCommand = /shopping|buy|bought|add.*to.*list|grocery|store/i.test(lower);
  
  // Schedule keywords
  const isScheduleCommand = /schedule|training|lesson|appointment|class|practice|remind|what.*doing|plans?|today|tomorrow|this week|next week/i.test(lower);
  
  // Route based on keywords
  if (isShoppingCommand && !isScheduleCommand) {
    // Definitely shopping
    return 'shopping';
  } else if (isScheduleCommand && !isShoppingCommand) {
    // Definitely schedule
    return 'schedule';
  } else if (isShoppingCommand && isScheduleCommand) {
    // Ambiguous - return 'auto' to let caller decide
    return 'auto';
  } else {
    // Default: auto-detect
    return 'auto';
  }
}

module.exports = {
  routeMessage
};
