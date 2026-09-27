import { useState, useEffect, useMemo } from 'react'
import {
  getDailyGoalsOverview,
  addGoal,
  toggleGoal,
  updateGoal,
  deleteGoal,
  rolloverGoals
} from '../services/api'
import './DailyGoals.css'

// Helper: Format date in user's local timezone as 'YYYY-MM-DD'
function getLocalDateStr(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function DailyGoals() {
  const [activeTab, setActiveTab] = useState('today')
  const [todayGoals, setTodayGoals] = useState([])
  const [tomorrowGoals, setTomorrowGoals] = useState([])
  const [pendingFromYesterday, setPendingFromYesterday] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Quick Add Form state
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('custom')
  const [newPriority, setNewPriority] = useState('medium')

  // Edit state
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editType, setEditType] = useState('custom')
  const [editPriority, setEditPriority] = useState('medium')
  const [editDate, setEditDate] = useState('')

  const todayStr = useMemo(() => getLocalDateStr(new Date()), [])
  const tomorrowStr = useMemo(() => {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    return getLocalDateStr(t)
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const data = await getDailyGoalsOverview(todayStr, tomorrowStr)
      setTodayGoals(data.todayGoals || [])
      setTomorrowGoals(data.tomorrowGoals || [])
      setPendingFromYesterday(data.pendingFromYesterday || [])
    } catch (err) {
      console.error('Failed to load daily goals:', err)
      setErrorMessage(err.response?.data?.message || err.message || 'Unable to connect to server. Please verify backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [todayStr, tomorrowStr])

  // Handle Toggle Goal Complete
  const handleToggle = async (goal) => {
    const isToday = goal.date === todayStr

    // Optimistic Update
    const updateList = (list) =>
      list.map((g) =>
        g._id === goal._id
          ? { ...g, isCompleted: !g.isCompleted, completedAt: !g.isCompleted ? new Date() : null }
          : g
      )

    if (isToday) setTodayGoals((prev) => updateList(prev))
    else setTomorrowGoals((prev) => updateList(prev))

    try {
      await toggleGoal(goal._id)
    } catch (err) {
      console.error('Error toggling goal:', err)
      // Rollback on error
      loadGoals()
    }
  }

  // Handle Add Goal
  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || submitting) return

    const targetDate = activeTab === 'today' ? todayStr : tomorrowStr

    try {
      setSubmitting(true)
      setErrorMessage('')
      const created = await addGoal({
        title: newTitle.trim(),
        date: targetDate,
        type: newType,
        priority: newPriority
      })

      if (activeTab === 'today') {
        setTodayGoals((prev) => [...prev, created])
      } else {
        setTomorrowGoals((prev) => [...prev, created])
      }

      setNewTitle('')
    } catch (err) {
      console.error('Error adding goal:', err)
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to save goal to server.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Start Edit
  const handleStartEdit = (goal, e) => {
    e.stopPropagation()
    setEditingGoalId(goal._id)
    setEditTitle(goal.title)
    setEditType(goal.type || 'custom')
    setEditPriority(goal.priority || 'medium')
    setEditDate(goal.date)
  }

  // Handle Cancel Edit
  const handleCancelEdit = (e) => {
    e.stopPropagation()
    setEditingGoalId(null)
  }

  // Handle Save Edit
  const handleSaveEdit = async (goalId, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!editTitle.trim()) return

    try {
      await updateGoal(goalId, {
        title: editTitle.trim(),
        type: editType,
        priority: editPriority,
        date: editDate
      })
      setEditingGoalId(null)
      loadGoals()
    } catch (err) {
      console.error('Error saving edited goal:', err)
    }
  }

  // Handle Delete Goal
  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      setTodayGoals((prev) => prev.filter((g) => g._id !== id))
      setTomorrowGoals((prev) => prev.filter((g) => g._id !== id))
      await deleteGoal(id)
    } catch (err) {
      console.error('Error deleting goal:', err)
      loadGoals()
    }
  }

  // Handle Rollover from Yesterday
  const handleRollover = async () => {
    try {
      await rolloverGoals(todayStr)
      setPendingFromYesterday([])
      loadGoals()
    } catch (err) {
      console.error('Error rolling over goals:', err)
    }
  }

  // Stats calculation
  const todayTotal = todayGoals.length
  const todayCompleted = todayGoals.filter((g) => g.isCompleted).length
  const completionPct = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0
  const isAllComplete = todayTotal > 0 && todayCompleted === todayTotal

  const activeGoals = activeTab === 'today' ? todayGoals : tomorrowGoals

  return (
    <div className="daily-goals-card">
      <div className="daily-goals-header">
        <div className="daily-goals-title-group">
          <h3>
            🎯 Daily Goals & Tomorrow's Planner
          </h3>
          <p>
            {activeTab === 'today'
              ? "Focus on today's execution and build your streak."
              : "Plan tomorrow today so you wake up with absolute clarity."}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="daily-goals-tabs">
          <button
            className={`goal-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <span>Today's Focus</span>
            <span className="tab-badge">
              {todayCompleted}/{todayTotal}
            </span>
          </button>
          <button
            className={`goal-tab ${activeTab === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setActiveTab('tomorrow')}
          >
            <span>Tomorrow's Planner</span>
            <span className="tab-badge">{tomorrowGoals.length}</span>
          </button>
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div style={{ background: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage('')} style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* Rollover Alert Banner */}
      {pendingFromYesterday.length > 0 && activeTab === 'today' && (
        <div className="rollover-banner">
          <div className="rollover-info">
            <span>⏳</span>
            <span>
              You have <strong>{pendingFromYesterday.length} unfinished goal{pendingFromYesterday.length > 1 ? 's' : ''}</strong> from yesterday.
            </span>
          </div>
          <button className="rollover-btn" onClick={handleRollover}>
            Roll over to Today 🔄
          </button>
        </div>
      )}

      {/* Progress Bar (Visible on Today Tab) */}
      {activeTab === 'today' && todayTotal > 0 && (
        <div className="goal-progress-section">
          {isAllComplete ? (
            <div className="goal-complete-celebration">
              <span>🎉</span>
              <span>All goals conquered for today! Incredible consistency.</span>
            </div>
          ) : (
            <>
              <div className="goal-progress-labels">
                <span>Today's Progress</span>
                <span>
                  {todayCompleted} of {todayTotal} completed ({completionPct}%)
                </span>
              </div>
              <div className="goal-progress-track">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Goal Items List */}
      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading goals...</p>
      ) : activeGoals.length === 0 ? (
        <div className="empty-goals-msg">
          {activeTab === 'today' ? (
            <span>No goals set for today yet. Add your targets below to start your streak!</span>
          ) : (
            <span>No goals queued for tomorrow yet. Plan ahead to hit the ground running!</span>
          )}
        </div>
      ) : (
        <div className="goals-list">
          {activeGoals.map((goal) => {
            const isEditing = editingGoalId === goal._id

            if (isEditing) {
              return (
                <div
                  key={goal._id}
                  className="goal-item"
                  style={{ borderColor: '#6366f1', background: '#131722' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <form className="inline-edit-form" onSubmit={(e) => handleSaveEdit(goal._id, e)}>
                    <input
                      type="text"
                      className="inline-edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="inline-edit-controls">
                      <div className="inline-edit-selectors">
                        <select
                          className="inline-edit-select"
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                        >
                          <option value="custom">Custom Task</option>
                          <option value="problem">Problem Target</option>
                          <option value="topic">Topic Study</option>
                          <option value="revision">Spaced Revision</option>
                        </select>

                        <select
                          className="inline-edit-select"
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                        >
                          <option value="medium">Med Priority</option>
                          <option value="high">High Priority</option>
                          <option value="low">Low Priority</option>
                        </select>

                        <select
                          className="inline-edit-select"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        >
                          <option value={todayStr}>Schedule: Today</option>
                          <option value={tomorrowStr}>Schedule: Tomorrow</option>
                        </select>
                      </div>

                      <div className="inline-edit-buttons">
                        <button type="submit" className="inline-save-btn">
                          ✓ Save
                        </button>
                        <button type="button" className="inline-cancel-btn" onClick={handleCancelEdit}>
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )
            }

            return (
              <div
                key={goal._id}
                className={`goal-item ${goal.isCompleted ? 'completed' : ''}`}
                onClick={() => handleToggle(goal)}
              >
                <div className="goal-left">
                  <div
                    className={`goal-checkbox ${goal.isCompleted ? 'checked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggle(goal)
                    }}
                    title={goal.isCompleted ? "Mark as not done" : "Mark as done"}
                  >
                    {goal.isCompleted && '✓'}
                  </div>

                  <div className="goal-content">
                    <span className={`goal-text ${goal.isCompleted ? 'struck' : ''}`}>
                      {goal.title}
                    </span>
                    <div className="goal-meta-tags">
                      <span className={`tag-badge tag-${goal.type || 'custom'}`}>
                        {goal.type || 'custom'}
                      </span>
                      {goal.priority && goal.priority !== 'medium' && (
                        <span className={`priority-badge priority-${goal.priority}`}>
                          {goal.priority}
                        </span>
                      )}
                      {goal.rolledOver && (
                        <span className="rollover-tag">
                          🔄 Rolled over
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="goal-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="goal-edit-btn"
                    title="Edit goal"
                    onClick={(e) => handleStartEdit(goal, e)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="goal-delete-btn"
                    title="Delete goal"
                    onClick={(e) => handleDelete(goal._id, e)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Add Form */}
      <form className="quick-add-form" onSubmit={handleAddGoal}>
        <input
          type="text"
          className="quick-add-input"
          placeholder={
            activeTab === 'today'
              ? "Add a goal for today (e.g. 'Solve 2 Binary Search problems')..."
              : "Plan a goal for tomorrow (e.g. 'Revise Dynamic Programming patterns')..."
          }
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <select
          className="quick-add-select"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          <option value="custom">Custom Task</option>
          <option value="problem">Problem Target</option>
          <option value="topic">Topic Study</option>
          <option value="revision">Spaced Revision</option>
        </select>

        <select
          className="quick-add-select"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="medium">Med Priority</option>
          <option value="high">High Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <button type="submit" className="quick-add-btn" disabled={submitting}>
          {submitting ? '+ Adding...' : '+ Add Goal'}
        </button>
      </form>

      {/* Automatic Rollover Notice for Tomorrow */}
      {activeTab === 'tomorrow' && (
        <div className="tomorrow-tip">
          <span>💡</span>
          <span>
            Goals planned here will <strong>automatically become active as your Today's Focus</strong> when tomorrow arrives!
          </span>
        </div>
      )}
    </div>
  )
}

export default DailyGoals
