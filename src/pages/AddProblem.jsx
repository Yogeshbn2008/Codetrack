import { useState } from 'react'

function AddProblem({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    platform: "",
    topic: "",
    difficulty: "Easy",
    notes: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
  e.preventDefault()
  onAdd(form)
  setForm({ title: "", platform: "", topic: "", difficulty: "Easy", notes: "" })
}

  return (
    <div>
      <h2>Add a Problem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="title"
            placeholder="Problem title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="platform"
            placeholder="Platform (LeetCode, etc.)"
            value={form.platform}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="topic"
            placeholder="Topic (Array, DP, etc.)"
            value={form.topic}
            onChange={handleChange}
          />
        </div>
        <div>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <textarea
            name="notes"
            placeholder="Notes / approach"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Problem</button>
      </form>
    </div>
  )
}

export default AddProblem