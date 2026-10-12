
import { useState } from 'react'
import './App.css'

const defaultRoommate = {
  name: '',
  budget: '',
  cleanliness: 'Moderate',
  sleepSchedule: 'Night Owl',
  smoking: 'No',
  pets: 'No',
}

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

      <label>
        Cleanliness
        <select
          value={roommate.cleanliness}
          onChange={(e) => updateField('cleanliness', e.target.value)}
        >
          <option>Very Clean</option>
          <option>Moderate</option>
          <option>Relaxed</option>
        </select>
      </label>

      <label>
        Sleep Schedule
        <select
          value={roommate.sleepSchedule}
          onChange={(e) => updateField('sleepSchedule', e.target.value)}
        >
          <option>Early Bird</option>
          <option>Night Owl</option>
          <option>Flexible</option>
        </select>
      </label>

      <label>
        Smoking
        <select
          value={roommate.smoking}
          onChange={(e) => updateField('smoking', e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>
      </label>

      <label>
        Pets
        <select
          value={roommate.pets}
          onChange={(e) => updateField('pets', e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>
      </label>
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
      setError('Please enter valid housing budgets for both roommates.')
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
          body: JSON.stringify({
            roommate1,
            roommate2,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to calculate compatibility.'
        )
      }

      setResult(data)
    } catch (err) {
      setError(
        err.message || 'Unable to connect to the backend server.'
      )
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

          <div className="results-grid">
            <div className="matches">
              <h3>Matching Preferences</h3>

              {result.matches.length > 0 ? (
                <ul>
                  {result.matches.map((match) => (
                    <li key={match}>
                      {match}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No matching preferences.</p>
              )}
            </div>

            <div className="differences">
              <h3>Different Preferences</h3>

              {result.differences.length > 0 ? (
                <ul>
                  {result.differences.map((difference) => (
                    <li key={difference}>
                      {difference}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No differences found!</p>
              )}
            </div>
          </div>

          <p className="result-note">
            Compatibility is estimated using five equally
            weighted preference categories. Results are
            intended for demonstration purposes.
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
