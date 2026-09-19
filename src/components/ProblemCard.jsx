import { Link } from 'react-router-dom'
import './ProblemCard.css'

function daysSince(dateStr) {
  const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
  if (days === 0) return "today"
  if (days === 1) return "1 day ago"
  return `${days} days ago`
}

function ProblemCard({ problem, onDelete, onRevise }) {
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
          Last revised: {daysSince(problem.lastRevisedAt)} · Revise every {problem.revisionIntervalDays || 7} day{(problem.revisionIntervalDays || 7) === 1 ? "" : "s"}
        </p>
      )}

      <div className="problem-card-actions">
        {problem.link && (
          <a className="btn-edit" href={problem.link} target="_blank" rel="noopener noreferrer">
            View Problem ↗
          </a>
        )}
        <Link className="btn-edit" to={`/edit/${problem._id}`}>Edit</Link>
        {onRevise && (
          <button className="btn-edit" onClick={() => onRevise(problem._id)}>Mark Revised</button>
        )}
        <button className="btn-delete" onClick={() => onDelete(problem._id)}>Delete</button>
      </div>
    </div>
  )
}

export default ProblemCard