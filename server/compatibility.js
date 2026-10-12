
const categories = [
  {
    key: 'cleanliness',
    label: 'Cleanliness',
    maxPoints: 15,
    options: ['Relaxed', 'Moderate', 'Very Clean'],
  },
  {
    key: 'sleepSchedule',
    label: 'Sleep Schedule',
    maxPoints: 15,
    options: ['Early Bird', 'Flexible', 'Night Owl'],
  },
  {
    key: 'smoking',
    label: 'Smoking',
    maxPoints: 15,
    options: ['No', 'Yes'],
  },
  {
    key: 'pets',
    label: 'Pets',
    maxPoints: 10,
    options: ['No', 'Yes'],
  },
  {
    key: 'studyHabits',
    label: 'Study Habits',
    maxPoints: 10,
    options: ['Quiet', 'Flexible', 'Background Noise'],
  },
  {
    key: 'guests',
    label: 'Guest Frequency',
    maxPoints: 5,
    options: ['Rarely', 'Occasionally', 'Frequently'],
  },
  {
    key: 'noiseLevel',
    label: 'Noise Level',
    maxPoints: 5,
    options: ['Quiet', 'Moderate', 'Loud'],
  },
  {
    key: 'temperature',
    label: 'Room Temperature',
    maxPoints: 3,
    options: ['Cool', 'Moderate', 'Warm'],
  },
  {
    key: 'sharing',
    label: 'Sharing Household Items',
    maxPoints: 2,
    options: ['No', 'Ask First', 'Yes'],
  },
]

function calculatePreferencePoints(category, value1, value2) {
  if (value1 === value2) {
    return category.maxPoints
  }

  // Binary preferences do not receive partial credit.
  if (category.options.length === 2) {
    return 0
  }

  const index1 = category.options.indexOf(value1)
  const index2 = category.options.indexOf(value2)

  // Similar preferences receive half the available points.
  if (Math.abs(index1 - index2) === 1) {
    return category.maxPoints * 0.5
  }

  return 0
}

function calculateBudgetPoints(budget1, budget2) {
  const difference = Math.abs(budget1 - budget2)
  const largerBudget = Math.max(budget1, budget2)
  const percentageDifference = (difference / largerBudget) * 100

  if (percentageDifference <= 10 + 1e-9) return 20
  if (percentageDifference <= 20 + 1e-9) return 15
  if (percentageDifference <= 30 + 1e-9) return 10
  if (percentageDifference <= 40 + 1e-9) return 5

  return 0
}

function calculateCompatibility(roommate1, roommate2) {
  const breakdown = []
  let totalPoints = 0

  for (const category of categories) {
    const value1 = roommate1[category.key]
    const value2 = roommate2[category.key]

    const points = calculatePreferencePoints(
      category,
      value1,
      value2
    )

    totalPoints += points

    breakdown.push({
      category: category.label,
      roommate1: value1,
      roommate2: value2,
      points,
      maxPoints: category.maxPoints,
      matched: points === category.maxPoints,
    })
  }

  const budget1 = Number(roommate1.budget)
  const budget2 = Number(roommate2.budget)

  const budgetPoints = calculateBudgetPoints(
    budget1,
    budget2
  )

  totalPoints += budgetPoints

  breakdown.push({
    category: 'Housing Budget',
    roommate1: `$${budget1.toLocaleString()}`,
    roommate2: `$${budget2.toLocaleString()}`,
    points: budgetPoints,
    maxPoints: 20,
    matched: budgetPoints === 20,
  })

  const matches = breakdown
    .filter((item) => item.points === item.maxPoints)
    .map((item) => item.category)

  const differences = breakdown
    .filter((item) => item.points < item.maxPoints)
    .map((item) => item.category)

  return {
    score: totalPoints,
    totalPoints,
    maxPoints: 100,
    matches,
    differences,
    breakdown,
    totalCategories: breakdown.length,
    matchedCategories: matches.length,
    roommateNames: [
      roommate1.name.trim(),
      roommate2.name.trim(),
    ],
  }
}

module.exports = { calculateCompatibility }
