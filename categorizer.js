// 商品分类器
const categories = {
  Dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream'],
  Produce: ['apple', 'banana', 'orange', 'tomato', 'lettuce', 'carrot', 'broccoli', 'onion', 'potato', 'cucumber', 'spinach'],
  Meat: ['chicken', 'beef', 'pork', 'fish', 'turkey', 'lamb', 'salmon', 'shrimp'],
  Bakery: ['bread', 'bagel', 'muffin', 'croissant', 'bun', 'roll'],
  Grains: ['rice', 'pasta', 'cereal', 'oats', 'quinoa', 'flour'],
  Snacks: ['chips', 'cookies', 'crackers', 'nuts', 'candy', 'chocolate'],
  Beverages: ['juice', 'soda', 'coffee', 'tea', 'water', 'beer', 'wine', 'drink', 'probiotic'],
  Canned: ['soup', 'beans', 'tomato sauce', 'tuna', 'corn', 'peas'],
  Frozen: ['ice cream', 'frozen vegetables', 'frozen pizza', 'frozen meal'],
  Household: ['paper towel', 'toilet paper', 'detergent', 'soap', 'shampoo', 'toothpaste']
};

function categorizeItem(itemName) {
  const lowerName = itemName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

module.exports = { categorizeItem };
