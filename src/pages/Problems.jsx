import { useState, useEffect } from 'react'
import ProblemCard from '../components/ProblemCard'
import { getProblems } from '../services/api'
import './Problems.css'

function Problems({ onDelete }) {
  const [problems, setProblems] = useState([])
  const [filters, setFilters] = useState({ search: "", topic: "", pattern: "", difficulty: "", status: "" })

  const fetchProblems = () => {
    getProblems(filters).then(setProblems)
  }

  useEffect(() => {
    fetchProblems()
  }, [filters])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleDelete = async (id) => {
    await onDelete(id)
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
          <option value="Array">Array</option>
          <option value="DP">DP</option>
          <option value="Tree">Tree</option>
          <option value="Graph">Graph</option>
          <option value="Recursion">Recursion</option>
        </select>
        <select name="pattern" value={filters.pattern} onChange={handleFilterChange}>
          <option value="">All Patterns</option>
          <option value="Two Pointers">Two Pointers</option>
          <option value="Sliding Window">Sliding Window</option>
          <option value="Binary Search">Binary Search</option>
          <option value="DFS/BFS">DFS/BFS</option>
          <option value="Backtracking">Backtracking</option>
          <option value="Dynamic Programming">Dynamic Programming</option>
          <option value="Greedy">Greedy</option>
          <option value="Prefix Sum">Prefix Sum</option>
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

      {problems.length === 0 ? (
        <p className="empty-state">No problems match your filters.</p>
      ) : (
        problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} onDelete={handleDelete} />
        ))
      )}
    </div>
  )
}

export default Problems