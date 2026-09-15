import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Forms.css'

function EditProblem({ problems, onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const existing = problems.find((p) => p._id === id)

  const [form, setForm] = useState({
    title: existing?.title || "",
    platform: existing?.platform || "",
    topic: existing?.topic || "",
    difficulty: existing?.difficulty || "Easy",
    status: existing?.status || "attempted",
    notes: existing?.notes || ""
  })

  if (!existing) {
    return <p style={{ padding: 40 }}>Problem not found.</p>
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(existing._id, form)
    navigate('/problems')
  }

  return (
    <div className="form-page">
      <h2>Edit Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Problem Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Platform</label>
          <input name="platform" value={form.platform} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Topic</label>
          <input name="topic" value={form.topic} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="attempted">Attempted</option>
            <option value="solved">Solved</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes / Approach</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <button className="form-submit-btn" type="submit">Save Changes</button>
      </form>
    </div>
  )
}

export default EditProblem