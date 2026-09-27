import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats, markRevised, addGoal } from '../services/api'
import AICoachModal from '../components/AICoachModal'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [addedGoals, setAddedGoals] = useState(new Set())
  const [activeRecallId, setActiveRecallId] = useState(null)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiModalProblem, setAiModalProblem] = useState(null)

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  const handleAddGoalFromDue = async (problem) => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10)
      await addGoal({
        title: `Revise: ${problem.title}`,
        date: todayStr,
        type: 'revision',
        problemId: problem._id,
        problemUrl: problem.link || '',
        priority: 'high'
      })
      setAddedGoals(prev => new Set([...prev, problem._id]))
    } catch (err) {
      console.error("Error adding problem to goals:", err)
    }
  }

  const handleReviseFromDue = async (problemId, quality) => {
    try {
      await markRevised(problemId, quality)
      setActiveRecallId(null)
      const updated = await getStats()
      setStats(updated)
    } catch (err) {
      console.error("Error marking problem revised:", err)
    }
  }

  if (!stats) return <p style={{ padding: 40 }}>Loading dashboard...</p>

  const maxTopicCount = Math.max(...Object.values(stats.byTopic), 1)

  return (
    <div className="dashboard">
      <div className="dashboard-welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>Welcome back 👋</h2>
          <p>Keep solving. Keep improving.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setAiModalProblem(null)
              setShowAiModal(true)
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
              color: '#c7d2fe',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            🧠 AI Coach
          </button>
          <Link 
            to="/goals" 
            style={{ 
              textDecoration: 'none', 
              background: '#1e2330', 
              color: '#f8fafc', 
              border: '1px solid #333948', 
              padding: '8px 16px', 
              borderRadius: 8, 
              fontSize: 13, 
              fontWeight: 600, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            🎯 Daily Goals Planner →
          </Link>
        </div>
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

      {stats.dueForRevision && stats.dueForRevision.length > 0 && (
        <div className="panel" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0 }}>📌 Due for Revision (Spaced Repetition)</h3>
            <span style={{ fontSize: 12, color: '#f59e0b', background: '#3b2505', padding: '3px 10px', borderRadius: 12, fontWeight: 600 }}>
              {stats.dueForRevision.length} problem{stats.dueForRevision.length === 1 ? '' : 's'} ready
            </span>
          </div>

          <ul className="recent-list">
            {stats.dueForRevision.map((p) => {
              const isAdded = addedGoals.has(p._id)
              const isRecallOpen = activeRecallId === p._id
              const daysAgo = Math.floor((new Date() - new Date(p.lastRevisedAt)) / (1000 * 60 * 60 * 24))
              const interval = p.revisionIntervalDays || 7
              const ef = p.easeFactor || 2.5
              const hardDays = Math.max(2, Math.round(interval * 1.2))
              const goodDays = Math.max(3, Math.round(interval * ef))
              const easyDays = Math.max(5, Math.round(interval * ef * 1.3))

              return (
                <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #292e39', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: 14 }}>{p.title}</span>
                      {p.difficulty && (
                        <span className="tag" style={{ fontSize: 10, padding: '1px 6px' }}>{p.difficulty}</span>
                      )}
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>
                      Last revised {daysAgo} days ago · Interval was {interval}d {p.revisionCount ? `· Rev #${p.revisionCount}` : ''}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {/* 1-Click Add to Today's Goals */}
                    <button
                      onClick={() => handleAddGoalFromDue(p)}
                      disabled={isAdded}
                      style={{
                        background: isAdded ? '#15803d' : '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: isAdded ? 'default' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'background 0.2s'
                      }}
                      title="Add this problem directly to Today's Goals"
                    >
                      {isAdded ? '✓ Added to Goals' : '+ Add to Goals'}
                    </button>

                    {/* AI Socratic Clue Button */}
                    <button
                      onClick={() => {
                        setAiModalProblem(p)
                        setShowAiModal(true)
                      }}
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                      title="Get progressive Socratic hints for this problem"
                    >
                      🧠 AI Clue
                    </button>

                    {/* Adaptive SM-2 Mark Revised Button */}
                    {!isRecallOpen ? (
                      <button
                        onClick={() => setActiveRecallId(p._id)}
                        style={{
                          background: '#21262f',
                          color: '#cbd5e1',
                          border: '1px solid #374151',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Mark Revised ▾
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: '#11141c', padding: '3px 6px', borderRadius: 6, border: '1px solid #374151' }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Recall:</span>
                        <button
                          onClick={() => handleReviseFromDue(p._id, 'again')}
                          style={{ background: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '4px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                          title="Forgot approach. Reset to 1 day."
                        >
                          Again (1d)
                        </button>
                        <button
                          onClick={() => handleReviseFromDue(p._id, 'hard')}
                          style={{ background: '#78350f', color: '#fde68a', border: 'none', padding: '4px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                          title="Struggled to recall."
                        >
                          Hard ({hardDays}d)
                        </button>
                        <button
                          onClick={() => handleReviseFromDue(p._id, 'good')}
                          style={{ background: '#14532d', color: '#86efac', border: 'none', padding: '4px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                          title="Normal recall."
                        >
                          Good ({goodDays}d)
                        </button>
                        <button
                          onClick={() => handleReviseFromDue(p._id, 'easy')}
                          style={{ background: '#1e3a8a', color: '#93c5fd', border: 'none', padding: '4px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                          title="Instant, effortless recall."
                        >
                          Easy ({easyDays}d)
                        </button>
                        <button
                          onClick={() => setActiveRecallId(null)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 12, padding: '0 4px' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
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

      {/* AI Coach Socratic & Complexity Modal */}
      {showAiModal && (
        <AICoachModal
          isOpen={showAiModal}
          onClose={() => {
            setShowAiModal(false)
            setAiModalProblem(null)
          }}
          initialProblem={aiModalProblem}
        />
      )}
    </div>
  )
}

export default Dashboard