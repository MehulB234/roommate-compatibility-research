
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
          min="0"
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
  const [roommate1, setRoommate1] = useState({ ...defaultRoommate })
  const [roommate2, setRoommate2] = useState({ ...defaultRoommate })

  function handleSubmit(e) {
    e.preventDefault()

    if (!roommate1.name.trim() || !roommate2.name.trim()) {
      alert('Please enter both roommate names.')
      return
    }

    if (
      roommate1.budget === '' ||
      roommate2.budget === '' ||
      Number(roommate1.budget) <= 0 ||
      Number(roommate2.budget) <= 0
    ) {
      alert('Please enter valid housing budgets for both roommates.')
      return
    }

    alert('Profiles submitted! Compatibility calculation coming next.')
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Roommate Compatibility Calculator</h1>
        <p>
          Compare two roommates based on their lifestyle and housing preferences.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="roommate-grid">
          <RoommateForm
            title="Roommate 1"
            roommate={roommate1}
            onChange={setRoommate1}
          />

          <RoommateForm
            title="Roommate 2"
            roommate={roommate2}
            onChange={setRoommate2}
          />
        </div>

        <button className="calculate-button" type="submit">
          Calculate Compatibility
        </button>
      </form>
    </div>
  )
}

export default App
