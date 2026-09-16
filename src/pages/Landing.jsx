import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateY = ((x - centerX) / centerX) * 10
    const rotateX = ((centerY - y) / centerY) * 10
    setTilt({ x: rotateX, y: rotateY })
  }

  const resetTilt = () => setTilt({ x: 0, y: 0 })

  return (
    <div className="landing">
      <div
        className="hero-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="hero-glow" />
        <h1 className="hero-title">
          <span className="hero-title-part hero-title-code">Code</span>
          <span className="hero-title-part hero-title-track">Track</span>
        </h1>
        <p className="hero-subtitle">Track every problem. See every pattern. Build the streak.</p>

        <div className="hero-actions">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🗂️</div>
          <h3>Log Every Problem</h3>
          <p>Track topic, difficulty, platform, and your own notes for every problem you attempt.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Visualize Progress</h3>
          <p>A dashboard that shows your real progress — by difficulty, by topic, over time.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Find Weak Spots</h3>
          <p>Search and filter your history to see exactly where you need more practice.</p>
        </div>
      </div>
    </div>
  )
}

export default Landing