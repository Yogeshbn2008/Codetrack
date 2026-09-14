import { useState, useEffect } from 'react'
import { getStats } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  if (!stats) return <p style={{ padding: 40 }}>Loading dashboard...</p>

  const maxTopicCount = Math.max(...Object.values(stats.byTopic), 1)

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h2>Welcome back 👋</h2>
        <p>Keep solving. Keep improving.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Problems</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Solved</h3>
          <p>{stats.solved}</p>
        </div>
        <div className="stat-card">
          <h3>Attempted</h3>
          <p>{stats.attempted}</p>
        </div>
        <div className="stat-card">
          <h3>Topics Covered</h3>
          <p>{Object.keys(stats.byTopic).length}</p>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="panel">
          <h3>By Difficulty</h3>
          {["Easy", "Medium", "Hard"].map((level) => {
            const pct = stats.total ? Math.round((stats.byDifficulty[level] / stats.total) * 100) : 0
            return (
              <div className="progress-row" key={level}>
                <div className="progress-row-label">
                  <span>{level}</span>
                  <span>{stats.byDifficulty[level]}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="panel">
          <h3>Topic Progress</h3>
          {Object.entries(stats.byTopic).map(([topic, count]) => {
            const pct = Math.round((count / maxTopicCount) * 100)
            return (
              <div className="progress-row" key={topic}>
                <div className="progress-row-label">
                  <span>{topic}</span>
                  <span>{count}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel">
        <h3>Recent Problems</h3>
        <ul className="recent-list">
          {stats.recent.map((p) => (
            <li key={p._id}>
              <span>{p.title}</span>
              <span>{p.difficulty} {p.status === "solved" ? "✅" : "🕓"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard