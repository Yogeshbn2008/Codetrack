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
          <h3>Streak</h3>
          <p>🔥 {stats.streak.current}</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 32 }}>
        <h3>This Week</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          {stats.streak.last7Days.map((day) => (
            <div key={day.date} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>{day.label}</div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  margin: "0 auto",
                  background: day.active ? "#6366f1" : "#292e39",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13
                }}
              >
                {day.active ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "10px 0 0 0" }}>
          Longest streak: {stats.streak.longest} day{stats.streak.longest === 1 ? "" : "s"}
        </p>
      </div>
      {stats.weakTopic && (
        <div className="panel" style={{ marginBottom: 32, borderColor: "#eab308" }}>
          <h3>💡 Focus Area</h3>
          <p style={{ fontSize: 14, color: "#e5e7eb", margin: "0 0 4px 0" }}>
            <strong>{stats.weakTopic.topic}</strong> looks like your weakest topic right now —
            you've solved {stats.weakTopic.solved} out of {stats.weakTopic.total} attempted
            ({Math.round(stats.weakTopic.solveRate * 100)}% solve rate).
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            Consider revisiting a few more {stats.weakTopic.topic} problems this week.
          </p>
        </div>
      )}

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

      {stats.byPattern && Object.keys(stats.byPattern).length > 0 && (
        <div className="panel" style={{ marginBottom: 32 }}>
          <h3>Pattern Coverage</h3>
          {Object.entries(stats.byPattern).map(([pattern, count]) => {
            const maxPatternCount = Math.max(...Object.values(stats.byPattern), 1)
            const pct = Math.round((count / maxPatternCount) * 100)
            return (
              <div className="progress-row" key={pattern}>
                <div className="progress-row-label">
                  <span>{pattern}</span>
                  <span>{count}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

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