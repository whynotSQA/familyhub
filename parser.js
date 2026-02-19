// 自然语言解析器
function parseInput(input) {
  const lower = input.toLowerCase().trim();
  
  // 智能建议
  if (/(suggest|建议|recommend|购物建议)/i.test(lower)) {
    return { action: 'suggestions' };
  }
  
  // 显示清单 - 按商店
  if (/(show.*by\s*store|by\s*location|按\s*商店|按\s*地点)/i.test(lower)) {
    return { action: 'listByStore' };
  }
  
  // 显示清单
  if (/(show|list|display|what|查看|显示|看)/i.test(lower)) {
    return { action: 'list' };
  }
  
  // 添加商品
  if (/(add|need|buy|添加|需要|买)/i.test(lower)) {
    const items = lower
      .replace(/(add|need|buy|to|the|shopping|list|添加|需要|买)/gi, '')
      .split(/,|and|&|、|，/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return { action: 'add', items };
  }
  
  // 购买/完成
  if (/(bought|purchased|got|done|买了|完成)/i.test(lower)) {
    const items = lower
      .replace(/(bought|purchased|got|done|买了|完成)/gi, '')
      .split(/,|and|&|、|，/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return { action: 'bought', items };
  }
  
  // 删除
  if (/(remove|delete|clear|删除|移除)/i.test(lower)) {
    const items = lower
      .replace(/(remove|delete|clear|from|the|list|删除|移除)/gi, '')
      .split(/,|and|&|、|，/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return { action: 'remove', items };
  }
  
  return { action: 'unknown', input };
}

module.exports = { parseInput };
