
import { useState } from 'react'
import './App.css'

const defaultRoommate = {
  name: '',
  budget: '',
  cleanliness: 'Moderate',
  sleepSchedule: 'Night Owl',
  smoking: 'No',
  pets: 'No',
  studyHabits: 'Quiet',
  guests: 'Occasionally',
  noiseLevel: 'Moderate',
  temperature: 'Moderate',
  sharing: 'Ask First',
}

const preferenceFields = [
  {
    key: 'cleanliness',
    label: 'Cleanliness',
    options: ['Very Clean', 'Moderate', 'Relaxed'],
  },
  {
    key: 'sleepSchedule',
    label: 'Sleep Schedule',
    options: ['Early Bird', 'Night Owl', 'Flexible'],
  },
  {
    key: 'smoking',
    label: 'Smoking',
    options: ['No', 'Yes'],
  },
  {
    key: 'pets',
    label: 'Pets',
    options: ['No', 'Yes'],
  },
  {
    key: 'studyHabits',
    label: 'Study Habits',
    options: ['Quiet', 'Background Noise', 'Flexible'],
  },
  {
    key: 'guests',
    label: 'Guest Frequency',
    options: ['Rarely', 'Occasionally', 'Frequently'],
  },
  {
    key: 'noiseLevel',
    label: 'Noise Level',
    options: ['Quiet', 'Moderate', 'Loud'],
  },
  {
    key: 'temperature',
    label: 'Room Temperature',
    options: ['Cool', 'Moderate', 'Warm'],
  },
  {
    key: 'sharing',
    label: 'Sharing Household Items',
    options: ['Yes', 'Ask First', 'No'],
  },
]

function RoommateForm({ title, roommate, onChange }) {
  function updateField(field, value) {
    onChange({ ...roommate, [field]: value })
  }

  return (
    <div className="roommate-card">
      <h2>{title}</h2>

      <label>
        Name
        <input
          type="text"
          placeholder="Enter name"
          value={roommate.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
      </label>

      <label>
        Monthly Housing Budget ($)
        <input
          type="number"
          min="1"
          placeholder="e.g. 800"
          value={roommate.budget}
          onChange={(e) => updateField('budget', e.target.value)}
        />
      </label>

      {preferenceFields.map((field) => (
        <label key={field.key}>
          {field.label}
          <select
            value={roommate[field.key]}
            onChange={(e) =>
              updateField(field.key, e.target.value)
            }
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}

function App() {
  const [roommate1, setRoommate1] = useState({
    ...defaultRoommate,
  })

  const [roommate2, setRoommate2] = useState({
    ...defaultRoommate,
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setResult(null)

    if (!roommate1.name.trim() || !roommate2.name.trim()) {
      setError('Please enter both roommate names.')
      return
    }

    if (
      roommate1.budget === '' ||
      roommate2.budget === '' ||
      !Number.isFinite(Number(roommate1.budget)) ||
      !Number.isFinite(Number(roommate2.budget)) ||
      Number(roommate1.budget) <= 0 ||
      Number(roommate2.budget) <= 0
    ) {
      setError('Please enter valid housing budgets.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:3001/api/compatibility',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roommate1, roommate2 }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Calculation failed.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setRoommate1({ ...defaultRoommate })
    setRoommate2({ ...defaultRoommate })
    setResult(null)
    setError('')
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Roommate Compatibility Calculator</h1>
        <p>
          Compare two roommates based on their lifestyle
          and housing preferences.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="roommate-grid">
          <RoommateForm
            title="Roommate 1"
            roommate={roommate1}
            onChange={(value) => {
              setRoommate1(value)
              setResult(null)
            }}
          />

          <RoommateForm
            title="Roommate 2"
            roommate={roommate2}
            onChange={(value) => {
              setRoommate2(value)
              setResult(null)
            }}
          />
        </div>

        <div className="button-group">
          <button
            className="calculate-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Calculating...'
              : 'Calculate Compatibility'}
          </button>

          <button
            className="reset-button"
            type="button"
            onClick={handleReset}
            disabled={loading}
          >
            Reset Forms
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="result-card">
          <h2>Compatibility Results</h2>

          <p className="result-names">
            {result.roommateNames.join(' & ')}
          </p>

          <div className="score">
            {result.score}%
          </div>

          <div
            className="score-bar"
            role="progressbar"
            aria-label="Compatibility score"
            aria-valuenow={result.score}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="score-fill"
              style={{
                width: `${result.score}%`,
              }}
            />
          </div>

          <p className="score-description">
            {result.score >= 80
              ? 'Excellent Compatibility!'
              : result.score >= 60
                ? 'Good Compatibility!'
                : result.score >= 40
                  ? 'Moderate Compatibility'
                  : 'Low Compatibility'}
          </p>

          <p className="match-count">
            {result.matchedCategories} out of{' '}
            {result.totalCategories} categories received full points
          </p>

          <h3 className="breakdown-heading">
            Detailed Compatibility Breakdown
          </h3>

          <div className="table-container">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>{result.roommateNames[0]}</th>
                  <th>{result.roommateNames[1]}</th>
                  <th>Points Earned</th>
                </tr>
              </thead>

              <tbody>
                {result.breakdown.map((item) => (
                  <tr key={item.category}>
                    <td>{item.category}</td>
                    <td>{item.roommate1}</td>
                    <td>{item.roommate2}</td>
                    <td>
                      <span
                        className={
                          item.points === item.maxPoints
                            ? 'status-match'
                            : item.points > 0
                              ? 'status-partial'
                              : 'status-different'
                        }
                      >
                        {item.points} / {item.maxPoints}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="result-note">
            Compatibility is calculated using a weighted
            100-point system. More important categories
            contribute more points, and similar preferences
            can receive partial credit.
          </p>
        </section>
      )}

      <footer className="app-footer">
        <p>
          MoveIn Match Research Project | CSCE 490
        </p>
      </footer>
    </div>
  )
}

export default App
