
function calculateCompatibility(roommate1, roommate2) {
    const categories = [
      { key: 'cleanliness', label: 'Cleanliness' },
      { key: 'sleepSchedule', label: 'Sleep Schedule' },
      { key: 'smoking', label: 'Smoking' },
      { key: 'pets', label: 'Pets' },
    ]
  
    const matches = []
    const differences = []
  
    for (const category of categories) {
      if (roommate1[category.key] === roommate2[category.key]) {
        matches.push(category.label)
      } else {
        differences.push(category.label)
      }
    }
  
    // Calculate budget compatibility using the percentage
    // difference relative to the larger monthly budget.
    const budget1 = Number(roommate1.budget)
    const budget2 = Number(roommate2.budget)
  
    const budgetDifference = Math.abs(budget1 - budget2)
    const largerBudget = Math.max(budget1, budget2)
    const budgetMatch = budgetDifference / largerBudget <= 0.20
  
    if (budgetMatch) {
      matches.push('Housing Budget')
    } else {
      differences.push('Housing Budget')
    }
  
    const score = Math.round((matches.length / 5) * 100)
  
    return {
      score,
      matches,
      differences,
      roommateNames: [
        roommate1.name.trim(),
        roommate2.name.trim(),
      ],
    }
  }
  
  module.exports = { calculateCompatibility }
  