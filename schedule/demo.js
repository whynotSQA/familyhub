// Quick demo of working features
const { handleScheduleCommand } = require('./handler');

async function demo() {
  console.log('🎬 Schedule Module Demo\n');
  console.log('This demo shows the working features of the schedule module.\n');
  
  console.log('═'.repeat(70));
  console.log('\n✨ DEMO: Family Schedule Management\n');
  console.log('═'.repeat(70));
  
  // Scenario 1: Adding schedules
  console.log('\n📅 Scenario 1: Mom adds schedules for the kids\n');
  
  await delay(500);
  console.log('Mom: "Emma has soccer practice Saturday at 9am at Lincoln Park"');
  let result = await handleScheduleCommand('Emma has soccer practice Saturday at 9am at Lincoln Park', 'Mom');
  console.log(`🤖 ${result}\n`);
  
  await delay(500);
  console.log('Mom: "Jeremy has piano lesson Monday at 4pm"');
  result = await handleScheduleCommand('Jeremy has piano lesson Monday at 4pm', 'Mom');
  console.log(`🤖 ${result}\n`);
  
  // Scenario 2: Checking schedules
  console.log('═'.repeat(70));
  console.log('\n📅 Scenario 2: Dad checks the week ahead\n');
  
  await delay(500);
  console.log('Dad: "What\'s happening this week?"');
  result = await handleScheduleCommand('What\'s happening this week?', 'Dad');
  console.log(`🤖 ${result}\n`);
  
  // Scenario 3: Adding with reminders
  console.log('═'.repeat(70));
  console.log('\n📅 Scenario 3: Adding important appointments with reminders\n');
  
  await delay(500);
  console.log('Mom: "Emma has dentist appointment next Tuesday at 3pm, please remind me"');
  result = await handleScheduleCommand('Emma has dentist appointment next Tuesday at 3pm, please remind me', 'Mom');
  console.log(`🤖 ${result}\n`);
  
  // Scenario 4: Checking individual schedule
  console.log('═'.repeat(70));
  console.log('\n📅 Scenario 4: Checking Emma\'s schedule\n');
  
  await delay(500);
  console.log('Dad: "What\'s Emma\'s schedule this week?"');
  result = await handleScheduleCommand('What\'s Emma\'s schedule this week?', 'Dad');
  console.log(`🤖 ${result}\n`);
  
  console.log('═'.repeat(70));
  console.log('\n✅ Demo completed! The schedule module is working great!\n');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

demo().catch(console.error);
