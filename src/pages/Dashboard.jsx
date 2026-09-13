import { useState, useEffect } from 'react'
import { getStats } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  if (!stats) return <p>Loading dashboard...</p>

  return (
    <div>
      <h2>Dashboard</h2>

      <div>
        <strong>Total Problems:</strong> {stats.total}
      </div>
      <div>
        <strong>Solved:</strong> {stats.solved} · <strong>Attempted:</strong> {stats.attempted}
      </div>

      <h3>By Difficulty</h3>
      <ul>
        <li>Easy: {stats.byDifficulty.Easy}</li>
        <li>Medium: {stats.byDifficulty.Medium}</li>
        <li>Hard: {stats.byDifficulty.Hard}</li>
      </ul>

      <h3>By Topic</h3>
      <ul>
        {Object.entries(stats.byTopic).map(([topic, count]) => (
          <li key={topic}>{topic}: {count}</li>
        ))}
      </ul>

      <h3>Recent Problems</h3>
      <ul>
        {stats.recent.map((p) => (
          <li key={p._id}>
            {p.title} — {p.difficulty} {p.status === "solved" ? "✅" : "🕓"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard