import { useState } from 'react'
import './Forms.css'

function AddProblem({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    platform: "",
    topic: "",
    difficulty: "Easy",
    status: "attempted",
    notes: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
    setForm({ title: "", platform: "", topic: "", difficulty: "Easy", status: "attempted", notes: "" })
  }

  return (
    <div className="form-page">
      <h2>Add a Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Problem Title</label>
          <input name="title" placeholder="e.g. Two Sum" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Platform</label>
          <input name="platform" placeholder="LeetCode" value={form.platform} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Topic</label>
          <input name="topic" placeholder="Array" value={form.topic} onChange={handleChange} />
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
          <textarea name="notes" placeholder="Explain your approach..." value={form.notes} onChange={handleChange} />
        </div>
        <button className="form-submit-btn" type="submit">+ Add Problem</button>
      </form>
    </div>
  )
}

export default AddProblem