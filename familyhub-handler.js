// Unified Message Handler for FamilyHub
// Routes messages to Shopping or Schedule modules
const { routeMessage } = require('./router');
const shoppingHandler = require('./handler');
const scheduleHandler = require('./schedule/handler');
const { parseInput } = require('./parser');

/**
 * Main entry point for all FamilyHub messages
 * Called by OpenClaw when a message is received
 * 
 * @param {string} message - The user's message text
 * @param {string} username - Who sent the message (default: 'You')
 * @returns {Promise<string>} Response message
 */
async function handleMessage(message, username = 'You') {
  console.log(`[FamilyHub] Received: "${message}" from ${username}`);
  
  // Determine which module should handle this message
  const route = routeMessage(message);
  
  console.log(`[FamilyHub] Routing to: ${route}`);
  
  try {
    if (route === 'schedule') {
      // Route to schedule module
      return await scheduleHandler.handleScheduleCommand(message, username);
    } else if (route === 'shopping') {
      // Route to shopping module (convert to old action format)
      const action = parseInput(message);
      return shoppingHandler.handleAction(action, username);
    } else {
      // Auto-route: try shopping first, then schedule
      try {
        const action = parseInput(message);
        const result = shoppingHandler.handleAction(action, username);
        
        // If shopping handler returns an error/confusion, try schedule
        if (result.includes("don't understand") || result.includes("not sure") || result.includes("抱歉")) {
          return await scheduleHandler.handleScheduleCommand(message, username);
        }
        
        return result;
      } catch (err) {
        // If shopping fails, try schedule
        return await scheduleHandler.handleScheduleCommand(message, username);
      }
    }
  } catch (error) {
    console.error('[FamilyHub] Error handling message:', error);
    return `Sorry, I encountered an error: ${error.message}`;
  }
}

/**
 * Export the main handler function
 * OpenClaw will call this function with incoming messages
 */
module.exports = {
  handleMessage,
  // Also export individual handlers for testing
  shoppingHandler,
  scheduleHandler
};
