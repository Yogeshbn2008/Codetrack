import { useState } from 'react'
import { fetchProblemMeta } from '../services/api'
import { uploadImage } from '../services/cloudinary'
import './Forms.css'

function AddProblem({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    platform: "",
    topic: "",
    pattern: "",
    difficulty: "Easy",
    status: "attempted",
    revisionIntervalDays: 7,
    notes: "",
    link: "",
    imageUrl: ""
  })
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFetchDetails = async () => {
    if (!form.link) return
    setFetching(true)
    setFetchError("")
    try {
      const data = await fetchProblemMeta(form.link)
      setForm({
        ...form,
        title: data.title || form.title,
        platform: data.platform || form.platform,
        difficulty: data.difficulty || form.difficulty
      })
    } catch (err) {
      setFetchError("Couldn't auto-fetch details. Please fill them in manually.")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let finalForm = { ...form }

    if (imageFile) {
      setUploading(true)
      try {
        const url = await uploadImage(imageFile)
        finalForm.imageUrl = url
      } catch (err) {
        alert("Image upload failed, saving problem without the image.")
      } finally {
        setUploading(false)
      }
    }

    onAdd(finalForm)
    setForm({ title: "", platform: "", topic: "", pattern: "", difficulty: "Easy", status: "attempted", notes: "", link: "", imageUrl: "" })
    setImageFile(null)
  }

  return (
    <div className="form-page">
      <h2>Add a Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Problem Link</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              name="link"
              placeholder="https://leetcode.com/problems/two-sum/"
              value={form.link}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="form-submit-btn"
              style={{ width: "auto", padding: "10px 16px", marginTop: 0 }}
              onClick={handleFetchDetails}
              disabled={fetching || !form.link}
            >
              {fetching ? "Fetching..." : "Fetch Details"}
            </button>
          </div>
          {fetchError && <p style={{ color: "#f87171", fontSize: "13px", marginTop: "6px" }}>{fetchError}</p>}
        </div>

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
          <label>Pattern</label>
          <input
            name="pattern"
            list="pattern-options"
            placeholder="e.g. Sliding Window"
            value={form.pattern}
            onChange={handleChange}
          />
          <datalist id="pattern-options">
            <option value="Two Pointers" />
            <option value="Sliding Window" />
            <option value="Binary Search" />
            <option value="DFS/BFS" />
            <option value="Backtracking" />
            <option value="Dynamic Programming" />
            <option value="Greedy" />
            <option value="Prefix Sum" />
            <option value="Bit Manipulation" />
            <option value="Hashing" />
            <option value="Union Find" />
            <option value="Topological Sort" />
            <option value="Divide and Conquer" />
          </datalist>
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
          <label>Revise Every (days)</label>
          <input
            type="number"
            name="revisionIntervalDays"
            min="1"
            value={form.revisionIntervalDays}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Notes / Approach</label>
          <textarea name="notes" placeholder="Explain your approach..." value={form.notes} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Approach Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button className="form-submit-btn" type="submit" disabled={uploading}>
          {uploading ? "Uploading image..." : "+ Add Problem"}
        </button>
      </form>
    </div>
  )
}

export default AddProblem