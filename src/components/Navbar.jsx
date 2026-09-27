import { useState } from 'react'
import { Link } from 'react-router-dom'
import AICoachModal from './AICoachModal'
import './Navbar.css'

function Navbar({ user, onLogout }) {
  const [showAiModal, setShowAiModal] = useState(false)

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">⚡ CodeTrack</Link>
        <div className="navbar-links">
          {user && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/goals">🎯 Daily Goals</Link>
              <Link to="/problems">Problems</Link>
              <Link to="/add">Add Problem</Link>
              <button 
                className="ai-coach-nav-btn" 
                onClick={() => setShowAiModal(true)}
                title="AI Big-O Complexity Analyzer & Socratic Hint Coach"
              >
                🧠 AI Coach
              </button>
            </>
          )}
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

      {/* Global AI Coach Modal */}
      <AICoachModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </>
  )
}

export default Navbar