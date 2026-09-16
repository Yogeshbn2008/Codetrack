import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Problems from './pages/Problems'
import AddProblem from './pages/AddProblem'
import EditProblem from './pages/EditProblem'
import Login from './pages/Login'
import Register from './pages/Register'
import { getProblems, addProblem as apiAddProblem, updateProblem as apiUpdateProblem, deleteProblem as apiDeleteProblem } from './services/api'
import Landing from './pages/Landing'

function App() {
  const [problems, setProblems] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)

 useEffect(() => {
  if (token) {
    getProblems().then(setProblems)
  }
}, [token])

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const addProblem = async (newProblem) => {
    const created = await apiAddProblem(newProblem)
    setProblems([...problems, created])
  }

  const deleteProblem = async (id) => {
    await apiDeleteProblem(id)
    setProblems(problems.filter((p) => p._id !== id))
  }

  const updateProblem = async (id, updatedData) => {
    const updated = await apiUpdateProblem(id, updatedData)
    setProblems(problems.map((p) => (p._id === id ? updated : p)))
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
       <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<Problems onDelete={deleteProblem} />} />
        <Route path="/add" element={<AddProblem onAdd={addProblem} />} />
        <Route path="/edit/:id" element={<EditProblem problems={problems} onUpdate={updateProblem} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App