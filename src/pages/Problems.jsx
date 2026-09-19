import { useState, useEffect } from 'react'
import ProblemCard from '../components/ProblemCard'
import { getProblems, markRevised, getFilterOptions } from '../services/api'
import './Problems.css'

function Problems({ onDelete }) {
  const [problems, setProblems] = useState([])
  const [filters, setFilters] = useState({ search: "", topic: "", pattern: "", difficulty: "", status: "" })
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [revisionOnly, setRevisionOnly] = useState(false)
  const [topicOptions, setTopicOptions] = useState([])
  const [patternOptions, setPatternOptions] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 400)
    return () => clearTimeout(timer)
  }, [filters.search])

  const fetchProblems = () => {
    const activeFilters = { ...filters, search: debouncedSearch }
    if (revisionOnly) activeFilters.revision = "true"
    getProblems(activeFilters).then(setProblems)
  }

  useEffect(() => {
    fetchProblems()
  }, [debouncedSearch, filters.topic, filters.pattern, filters.difficulty, filters.status, revisionOnly])

  useEffect(() => {
    getFilterOptions().then((data) => {
      setTopicOptions(data.topics)
      setPatternOptions(data.patterns)
    })
  }, [])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleDelete = async (id) => {
    await onDelete(id)
    fetchProblems()
  }

  const handleRevise = async (id) => {
    await markRevised(id)
    fetchProblems()
  }

  return (
    <div className="problems-page">
      <h2>My Problems</h2>

      <div className="filter-bar">
        <input
          name="search"
          placeholder="🔍 Search problems..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="topic" value={filters.topic} onChange={handleFilterChange}>
          <option value="">All Topics</option>
          {topicOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select name="pattern" value={filters.pattern} onChange={handleFilterChange}>
          <option value="">All Patterns</option>
          {patternOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
        </select>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#cbd5e1" }}>
        <input type="checkbox" checked={revisionOnly} onChange={(e) => setRevisionOnly(e.target.checked)} />
        Show only problems due for revision
      </label>

      {problems.length === 0 ? (
        <p className="empty-state">No problems match your filters.</p>
      ) : (
        problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} onDelete={handleDelete} onRevise={handleRevise} />
        ))
      )}
    </div>
  )
}

export default Problems