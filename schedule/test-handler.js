// Test schedule handler end-to-end
const { handleScheduleCommand } = require('./handler');

async function runTests() {
  console.log('🧪 Testing Schedule Handler\n');
  
  const tests = [
    // Add schedules
    "Emma has piano lesson next Tuesday at 3pm",
    "This is Emma's training on Saturday 9am at Lincoln Park, please remind me",
    "Mom has dentist appointment tomorrow at 2pm",
    
    // Query schedules
    "What's Emma's schedule today?",
    "Show me this week's schedule"
  ];
  
  for (const test of tests) {
    console.log(`\n📝 Command: "${test}"`);
    try {
      const response = await handleScheduleCommand(test, 'Test User');
      console.log(`✅ Response:\n${response}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

runTests().catch(console.error);
