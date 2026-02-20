// Test the unified FamilyHub handler
const { handleMessage } = require('./familyhub-handler');

async function testUnifiedHandler() {
  console.log('🧪 Testing Unified FamilyHub Handler\n');
  console.log('='.repeat(70));
  
  const testMessages = [
    // Shopping messages
    { msg: "add milk to shopping list", user: "Mom" },
    { msg: "show shopping list", user: "Dad" },
    
    // Schedule messages
    { msg: "Emma has piano lesson next Tuesday at 3pm", user: "Mom" },
    { msg: "What's Emma's schedule this week?", user: "Dad" },
    
    // Ambiguous (should auto-route)
    { msg: "Jeremy has basketball practice tomorrow at 4pm", user: "Mom" }
  ];
  
  for (const test of testMessages) {
    console.log(`\n📱 Message from ${test.user}: "${test.msg}"`);
    try {
      const response = await handleMessage(test.msg, test.user);
      console.log(`🤖 Response:\n${response}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('-'.repeat(70));
  }
  
  console.log('\n✅ Unified handler test complete!');
}

testUnifiedHandler().catch(console.error);
