
const express = require('express')
const cors = require('cors')
const { calculateCompatibility } = require('./compatibility')

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Roommate Compatibility API is running!',
  })
})

app.post('/api/compatibility', (req, res) => {
  const { roommate1, roommate2 } = req.body || {}

  if (!roommate1 || !roommate2) {
    return res.status(400).json({
      error: 'Both roommate profiles are required.',
    })
  }

  const validProfile = (roommate) =>
    typeof roommate.name === 'string' &&
    roommate.name.trim().length > 0 &&
    Number.isFinite(Number(roommate.budget)) &&
    Number(roommate.budget) > 0 &&
    ['Very Clean', 'Moderate', 'Relaxed'].includes(roommate.cleanliness) &&
    ['Early Bird', 'Night Owl', 'Flexible'].includes(roommate.sleepSchedule) &&
    ['Yes', 'No'].includes(roommate.smoking) &&
    ['Yes', 'No'].includes(roommate.pets)

  if (!validProfile(roommate1) || !validProfile(roommate2)) {
    return res.status(400).json({
      error: 'Please provide valid roommate names, budgets, and preferences.',
    })
  }

  const result = calculateCompatibility(roommate1, roommate2)

  res.json(result)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
