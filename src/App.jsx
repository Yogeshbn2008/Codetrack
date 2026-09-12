import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Problems from './pages/Problems'
import AddProblem from './pages/AddProblem'
import EditProblem from './pages/EditProblem'
import { getProblems, addProblem as apiAddProblem, updateProblem as apiUpdateProblem, deleteProblem as apiDeleteProblem } from './services/api'

function App() {
  const [problems, setProblems] = useState([])

  useEffect(() => {
    getProblems().then(setProblems)
  }, [])

  const addProblem = async (newProblem) => {
    const created = await apiAddProblem(newProblem)
    setProblems([...problems, created])
  }

  const deleteProblem = async (id) => {
    await apiDeleteProblem(id)
    setProblems(problems.filter((p) => p.id !== id))
  }

  const updateProblem = async (id, updatedData) => {
    const updated = await apiUpdateProblem(id, updatedData)
    setProblems(problems.map((p) => (p.id === id ? updated : p)))
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/problems" element={<Problems problems={problems} onDelete={deleteProblem} />} />
        <Route path="/add" element={<AddProblem onAdd={addProblem} />} />
        <Route path="/edit/:id" element={<EditProblem problems={problems} onUpdate={updateProblem} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App