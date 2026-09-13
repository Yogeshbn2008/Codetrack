import { useState, useEffect } from 'react'
import ProblemCard from '../components/ProblemCard'
import { getProblems } from '../services/api'

function Problems({ onDelete }) {
  const [problems, setProblems] = useState([])
  const [search, setSearch] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [status, setStatus] = useState("")

  const fetchFiltered = () => {
    const filters = {}
    if (search) filters.search = search
    if (topic) filters.topic = topic
    if (difficulty) filters.difficulty = difficulty
    if (status) filters.status = status

    getProblems(filters).then(setProblems)
  }

  useEffect(() => {
    fetchFiltered()
  }, [search, topic, difficulty, status])

  return (
    <div>
      <h2>My Problems</h2>

      <div>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All Topics</option>
          <option value="Array">Array</option>
          <option value="DP">DP</option>
          <option value="Tree">Tree</option>
          <option value="Graph">Graph</option>
          <option value="Recursion">Recursion</option>
        </select>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
        </select>
      </div>

      {problems.length === 0 ? (
        <p>No problems match your filters.</p>
      ) : (
        problems.map((problem) => (
          <ProblemCard
            key={problem._id}
            problem={problem}
            onDelete={(id) => { onDelete(id); fetchFiltered() }}
          />
        ))
      )}
    </div>
  )
}

export default Problems