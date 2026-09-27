import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addGoal } from '../services/api'
import AICoachModal from './AICoachModal'
import './ProblemCard.css'

function daysSince(dateStr) {
  const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
  if (days === 0) return "today"
  if (days === 1) return "1 day ago"
  return `${days} days ago`
}

function ProblemCard({ problem, onDelete, onRevise }) {
  const [showRecall, setShowRecall] = useState(false)
  const [goalAdded, setGoalAdded] = useState(false)
  const [revisedMsg, setRevisedMsg] = useState('')
  const [showAiModal, setShowAiModal] = useState(false)

  const handleAddGoal = async () => {
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
      setGoalAdded(true)
      setTimeout(() => setGoalAdded(false), 3000)
    } catch (err) {
      console.error('Error adding problem to goals:', err)
    }
  }

  const handleQualitySelect = async (quality) => {
    setShowRecall(false)
    if (onRevise) {
      await onRevise(problem._id, quality)
      setRevisedMsg('✓ Revised!')
      setTimeout(() => setRevisedMsg(''), 2500)
    }
  }

  const interval = problem.revisionIntervalDays || 7
  const ef = problem.easeFactor || 2.5
  const hardDays = Math.max(2, Math.round(interval * 1.2))
  const goodDays = Math.max(3, Math.round(interval * ef))
  const easyDays = Math.max(5, Math.round(interval * ef * 1.3))

  return (
    <div className="problem-card">
      <div className="problem-card-top">
        <h3 className="problem-card-title">{problem.title}</h3>
        <span className={`status-badge ${problem.status === "solved" ? "status-solved" : "status-attempted"}`}>
          {problem.status === "solved" ? "✓ Solved" : "🕓 Attempted"}
        </span>
      </div>

      <div className="problem-card-tags">
        {problem.platform && <span className="tag">{problem.platform}</span>}
        {problem.topic && <span className="tag">{problem.topic}</span>}
        {problem.pattern && <span className="tag">{problem.pattern}</span>}
        {problem.difficulty && <span className="tag">{problem.difficulty}</span>}
      </div>

      {problem.notes && <p className="problem-card-notes">"{problem.notes}"</p>}

      {problem.imageUrl && (
        <img
          src={problem.imageUrl}
          alt="Approach"
          style={{ width: "100%", borderRadius: "8px", marginBottom: "14px", maxHeight: "220px", objectFit: "cover" }}
        />
      )}

      {problem.lastRevisedAt && (
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px 0" }}>
          Last revised: {daysSince(problem.lastRevisedAt)} · Next in {interval} day{interval === 1 ? "" : "s"} {problem.revisionCount ? `(Rev #${problem.revisionCount})` : ""}
        </p>
      )}

      <div className="problem-card-actions" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        {problem.link && (
          <a className="btn-edit" href={problem.link} target="_blank" rel="noopener noreferrer">
            View Problem ↗
          </a>
        )}
        <Link className="btn-edit" to={`/edit/${problem._id}`}>Edit</Link>

        {/* 1-Click Add to Daily Goals */}
        <button
          className={`btn-edit ${goalAdded ? 'btn-goal-added' : ''}`}
          onClick={handleAddGoal}
          title="Add this problem as a revision goal in Today's Goals"
          style={goalAdded ? { background: '#15803d', color: '#ffffff' } : {}}
        >
          {goalAdded ? '✓ Goal Added!' : '+ Add to Goals'}
        </button>

        {/* Adaptive SM-2 Spaced Repetition Trigger */}
        {onRevise && !showRecall && (
          <button 
            className="btn-edit" 
            onClick={() => setShowRecall(true)}
            style={revisedMsg ? { color: '#4ade80' } : {}}
          >
            {revisedMsg || 'Mark Revised ▾'}
          </button>
        )}

        {/* SM-2 Recall Quality Popover */}
        {onRevise && showRecall && (
          <div className="recall-menu">
            <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 4 }}>Recall:</span>
            <button className="btn-recall again" onClick={() => handleQualitySelect('again')} title="Forgot approach. Reset to 1 day.">
              Again (1d)
            </button>
            <button className="btn-recall hard" onClick={() => handleQualitySelect('hard')} title="Struggled to recall.">
              Hard ({hardDays}d)
            </button>
            <button className="btn-recall good" onClick={() => handleQualitySelect('good')} title="Recalled with normal effort.">
              Good ({goodDays}d)
            </button>
            <button className="btn-recall easy" onClick={() => handleQualitySelect('easy')} title="Instant, effortless recall.">
              Easy ({easyDays}d)
            </button>
            <button 
              onClick={() => setShowRecall(false)} 
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 4px', fontSize: 12 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* AI Coach Trigger */}
        <button
          className="btn-edit"
          onClick={() => setShowAiModal(true)}
          title="Get Socratic Hints and Big-O Complexity Analysis"
          style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
        >
          🧠 AI Coach
        </button>

        <button className="btn-delete" onClick={() => onDelete(problem._id)}>Delete</button>
      </div>

      {/* AI Coach Socratic & Complexity Modal */}
      <AICoachModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        initialProblem={problem}
      />
    </div>
  )
}

export default ProblemCard