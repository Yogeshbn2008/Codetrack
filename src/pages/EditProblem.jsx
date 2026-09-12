import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function EditProblem({ problems, onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const existing = problems.find((p) => p.id === Number(id))

  const [form, setForm] = useState({
    title: existing?.title || "",
    platform: existing?.platform || "",
    topic: existing?.topic || "",
    difficulty: existing?.difficulty || "Easy",
    notes: existing?.notes || ""
  })

  if (!existing) {
    return <p>Problem not found.</p>
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(existing.id, form)
    navigate('/problems')
  }

  return (
    <div>
      <h2>Edit Problem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <input name="platform" value={form.platform} onChange={handleChange} />
        </div>
        <div>
          <input name="topic" value={form.topic} onChange={handleChange} />
        </div>
        <div>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  )
}

export default EditProblem