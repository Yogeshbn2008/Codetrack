import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const data = await loginUser(form)
      onLogin(data.token, data.user)
      navigate('/problems')
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login