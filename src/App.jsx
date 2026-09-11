import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Problems from './pages/Problems'
import AddProblem from './pages/AddProblem'
import fakeProblems from './data/fakeProblems'

function App() {
  const [problems, setProblems] = useState(fakeProblems)

  const addProblem = (newProblem) => {
    setProblems([...problems, { ...newProblem, id: Date.now() }])
  }

  const deleteProblem = (id) => {
    setProblems(problems.filter((p) => p.id !== id))
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/problems" element={<Problems problems={problems} onDelete={deleteProblem} />} />
        <Route path="/add" element={<AddProblem onAdd={addProblem} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App