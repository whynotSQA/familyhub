const { parseInput } = require('./parser');
const { handleAction } = require('./handler');

// 测试命令
const commands = [
  '添加 牛奶 2盒',
  '添加 鸡蛋, 面包, 西红柿',
  '查看清单',
  '按商店查看',
  '买了 rice',
  '购物建议'
];

console.log('🧪 FamilyHub Shopping List 测试\n');
console.log('=' .repeat(60));

commands.forEach(cmd => {
  console.log(`\n📝 命令: "${cmd}"`);
  console.log('-'.repeat(60));
  
  const parsed = parseInput(cmd);
  console.log('解析结果:', JSON.stringify(parsed, null, 2));
  
  const result = handleAction(parsed, 'Test User');
  console.log('\n响应:\n' + result);
  console.log('=' .repeat(60));
});
