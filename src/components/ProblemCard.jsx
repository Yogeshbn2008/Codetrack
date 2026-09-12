import { Link } from 'react-router-dom'

function ProblemCard({ problem, onDelete }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h3>{problem.title}</h3>
      <p>{problem.platform} · {problem.topic} · {problem.difficulty}</p>
      {problem.status === "solved" ? <span>✅ Solved</span> : <span>🕓 Attempted</span>}
      {problem.notes && <p><em>{problem.notes}</em></p>}
      <Link to={`/edit/${problem._id}`}>Edit</Link>
      {' '}
      <button onClick={() => onDelete(problem._id)}>Delete</button>
    </div>
  )
}

export default ProblemCard