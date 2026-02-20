// Comprehensive test for all family members
const { handleScheduleCommand } = require('./handler');

async function runComprehensiveTests() {
  console.log('🧪 Comprehensive Schedule Module Test\n');
  console.log('=' .repeat(60));
  
  // Test 1: Add schedules for all family members
  console.log('\n📝 TEST 1: Adding schedules for all family members\n');
  
  const addCommands = [
    "Emma has soccer practice tomorrow at 9am at Lincoln Park",
    "Jeremy has piano lesson next Monday at 4pm",
    "Mom has dentist appointment on Friday at 2pm",
    "Dad has work meeting next Tuesday at 10am"
  ];
  
  for (const cmd of addCommands) {
    console.log(`Command: "${cmd}"`);
    const result = await handleScheduleCommand(cmd, 'Test User');
    console.log(`Response: ${result}\n`);
  }
  
  // Test 2: Query individual schedules
  console.log('=' .repeat(60));
  console.log('\n🔍 TEST 2: Querying individual schedules\n');
  
  const queryCommands = [
    "What's Emma's schedule this week?",
    "What is Jeremy's schedule?",
    "Show me Mom's schedule",
    "What does Dad have planned?"
  ];
  
  for (const cmd of queryCommands) {
    console.log(`Command: "${cmd}"`);
    const result = await handleScheduleCommand(cmd, 'Test User');
    console.log(`Response:\n${result}\n`);
  }
  
  // Test 3: Query by date
  console.log('=' .repeat(60));
  console.log('\n📅 TEST 3: Querying by date\n');
  
  const dateCommands = [
    "What's happening tomorrow?",
    "Show me this week's schedule",
    "What's the schedule today?"
  ];
  
  for (const cmd of dateCommands) {
    console.log(`Command: "${cmd}"`);
    const result = await handleScheduleCommand(cmd, 'Test User');
    console.log(`Response:\n${result}\n`);
  }
  
  // Test 4: Complex scenarios
  console.log('=' .repeat(60));
  console.log('\n🎯 TEST 4: Complex scenarios\n');
  
  const complexCommands = [
    "This is Emma's swimming class on Saturday at 11am at City Pool, please remind me",
    "Jeremy and Emma have family dinner tomorrow at 6pm",
    "Add basketball practice for Jeremy next Wednesday 3pm"
  ];
  
  for (const cmd of complexCommands) {
    console.log(`Command: "${cmd}"`);
    const result = await handleScheduleCommand(cmd, 'Test User');
    console.log(`Response: ${result}\n`);
  }
  
  console.log('=' .repeat(60));
  console.log('\n✅ All tests completed!\n');
}

runComprehensiveTests().catch(console.error);
