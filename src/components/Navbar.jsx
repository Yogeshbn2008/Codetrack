import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">⚡ CodeTrack</div>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/problems">Problems</Link>
        <Link to="/add">Add Problem</Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span>Hi, {user.name} 👤</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar