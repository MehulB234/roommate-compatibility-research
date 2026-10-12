
const express = require('express')
const cors = require('cors')
const { calculateCompatibility } = require('./compatibility')

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const allowedValues = {
  cleanliness: ['Very Clean', 'Moderate', 'Relaxed'],
  sleepSchedule: ['Early Bird', 'Night Owl', 'Flexible'],
  smoking: ['Yes', 'No'],
  pets: ['Yes', 'No'],
  studyHabits: ['Quiet', 'Background Noise', 'Flexible'],
  guests: ['Rarely', 'Occasionally', 'Frequently'],
  noiseLevel: ['Quiet', 'Moderate', 'Loud'],
  temperature: ['Cool', 'Moderate', 'Warm'],
  sharing: ['Yes', 'Ask First', 'No'],
}

function validProfile(roommate) {
  if (!roommate || typeof roommate !== 'object') {
    return false
  }

  if (
    typeof roommate.name !== 'string' ||
    !roommate.name.trim()
  ) {
    return false
  }

  if (
    roommate.budget === '' ||
    roommate.budget === null ||
    roommate.budget === undefined ||
    !Number.isFinite(Number(roommate.budget)) ||
    Number(roommate.budget) <= 0
  ) {
    return false
  }

  return Object.entries(allowedValues).every(
    ([field, values]) => values.includes(roommate[field])
  )
}

app.get('/', (req, res) => {
  res.json({
    message: 'Roommate Compatibility API is running!',
  })
})

app.post('/api/compatibility', (req, res) => {
  const { roommate1, roommate2 } = req.body || {}

  if (!validProfile(roommate1) || !validProfile(roommate2)) {
    return res.status(400).json({
      error: 'Please provide valid roommate profiles and preferences.',
    })
  }

  const result = calculateCompatibility(roommate1, roommate2)

  res.json(result)
})

app.get('/', (req, res) => {
  res.json({
    message: 'Roommate Compatibility API is running!',
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
