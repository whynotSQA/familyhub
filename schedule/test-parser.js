// Test schedule parser
const { parseScheduleCommand, validateSchedule } = require('./parser');

console.log('🧪 Testing Schedule Parser\n');

const testCases = [
  "Emma has piano lesson next Tuesday at 3pm",
  "This is Emma's training schedule on Saturday 9am, please remind me",
  "What's Emma's schedule today?",
  "Add soccer practice for Emma tomorrow at 10am at Lincoln Park",
  "Show me this week's schedule"
];

testCases.forEach((test, i) => {
  console.log(`\n${i + 1}. Input: "${test}"`);
  const parsed = parseScheduleCommand(test);
  console.log('   Parsed:', JSON.stringify(parsed, null, 2));
  
  const validation = validateSchedule(parsed);
  console.log('   Valid:', validation.valid);
  if (!validation.valid) {
    console.log('   Errors:', validation.errors);
  }
});
