import { Link } from 'react-router-dom'
import './ProblemCard.css'

function ProblemCard({ problem, onDelete }) {
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
        {problem.difficulty && <span className="tag">{problem.difficulty}</span>}
      </div>

      {problem.notes && <p className="problem-card-notes">"{problem.notes}"</p>}

      <div className="problem-card-actions">
        <Link className="btn-edit" to={`/edit/${problem._id}`}>Edit</Link>
        <button className="btn-delete" onClick={() => onDelete(problem._id)}>Delete</button>
      </div>
    </div>
  )
}

export default ProblemCard