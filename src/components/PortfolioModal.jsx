import { useState, useEffect } from 'react'
import { getPortfolioData } from '../services/api'
import './PortfolioModal.css'

function PortfolioModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(true)
  const [portfolio, setPortfolio] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setError('')
      getPortfolioData()
        .then(data => {
          setPortfolio(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("Portfolio fetch error:", err)
          setError(err.response?.data?.message || 'Failed to generate portfolio.')
          setLoading(false)
        })
    }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="portfolio-modal-overlay" onClick={onClose}>
      <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar (Hidden when printing) */}
        <div className="portfolio-control-bar no-print">
          <div className="portfolio-control-title">
            <span>📄 DSA Candidate Portfolio & Interview Report</span>
          </div>
          <div className="portfolio-control-actions">
            <button className="btn-print-action" onClick={handlePrint} title="Save as PDF or Print">
              <span>🖨️ Download PDF / Print</span>
            </button>
            <button className="portfolio-close-btn" onClick={onClose} title="Close (Esc)">✕</button>
          </div>
        </div>

        {loading && (
          <div className="portfolio-loading">
            <div className="portfolio-spinner"></div>
            <p>Compiling your verified DSA achievements and readiness score...</p>
          </div>
        )}

        {error && (
          <div className="portfolio-error">
            <p>{error}</p>
            <button className="btn-print-action" onClick={onClose}>Close</button>
          </div>
        )}

        {!loading && portfolio && (
          <div className="printable-portfolio-document" id="printablePortfolio">
            {/* Header */}
            <header className="portfolio-header">
              <div className="portfolio-brand">
                <img src="/logo.png" alt="CodeTrack" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <h1 className="portfolio-app-title">CodeTrack</h1>
                  <span className="portfolio-app-subtitle">Verified DSA Competency Report</span>
                </div>
              </div>
              <div className="portfolio-candidate-info">
                <h2 className="candidate-name">{portfolio.candidate.name}</h2>
                <p className="candidate-email">{portfolio.candidate.email}</p>
                <p className="portfolio-date">
                  Report Date: <strong>{formatDate(portfolio.generatedAt)}</strong>
                </p>
              </div>
            </header>

            {/* Readiness Score Banner */}
            <section className="portfolio-score-section">
              <div className="score-badge-circle" style={{ borderColor: portfolio.readiness.tierColor }}>
                <span className="score-number" style={{ color: portfolio.readiness.tierColor }}>
                  {portfolio.readiness.score}
                </span>
                <span className="score-total">/ 100</span>
              </div>

              <div className="score-summary-text">
                <div className="tier-tag-pill" style={{ backgroundColor: `${portfolio.readiness.tierColor}20`, color: portfolio.readiness.tierColor, borderColor: portfolio.readiness.tierColor }}>
                  {portfolio.readiness.tierLevel} · {portfolio.readiness.tier}
                </div>
                <h3 className="score-heading">Interview Readiness Index</h3>
                <p className="score-recommendation">{portfolio.readiness.recommendation}</p>

                {/* Score Breakdown Bars */}
                <div className="score-pillars-row">
                  <div className="score-pillar-item">
                    <span className="pillar-label">Difficulty Volume</span>
                    <span className="pillar-val">{portfolio.readiness.breakdown.volumeScore} / 35</span>
                    <div className="pillar-bar-bg">
                      <div
                        className="pillar-bar-fill"
                        style={{ width: `${(portfolio.readiness.breakdown.volumeScore / 35) * 100}%`, background: '#3b82f6' }}
                      />
                    </div>
                  </div>

                  <div className="score-pillar-item">
                    <span className="pillar-label">Topic Coverage</span>
                    <span className="pillar-val">{portfolio.readiness.breakdown.topicScore} / 35</span>
                    <div className="pillar-bar-bg">
                      <div
                        className="pillar-bar-fill"
                        style={{ width: `${(portfolio.readiness.breakdown.topicScore / 35) * 100}%`, background: '#10b981' }}
                      />
                    </div>
                  </div>

                  <div className="score-pillar-item">
                    <span className="pillar-label">SM-2 Retention</span>
                    <span className="pillar-val">{portfolio.readiness.breakdown.retentionScore} / 30</span>
                    <div className="pillar-bar-bg">
                      <div
                        className="pillar-bar-fill"
                        style={{ width: `${(portfolio.readiness.breakdown.retentionScore / 30) * 100}%`, background: '#8b5cf6' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Volume & Difficulty Matrix */}
            <section className="portfolio-stats-grid">
              <div className="portfolio-stat-box">
                <span className="box-number">{portfolio.stats.total}</span>
                <span className="box-label">Total Problems Tracked</span>
              </div>
              <div className="portfolio-stat-box diff-box easy">
                <span className="box-number">{portfolio.stats.byDifficulty.Easy || 0}</span>
                <span className="box-label">Easy Solved</span>
              </div>
              <div className="portfolio-stat-box diff-box medium">
                <span className="box-number">{portfolio.stats.byDifficulty.Medium || 0}</span>
                <span className="box-label">Medium Solved</span>
              </div>
              <div className="portfolio-stat-box diff-box hard">
                <span className="box-number">{portfolio.stats.byDifficulty.Hard || 0}</span>
                <span className="box-label">Hard Solved</span>
              </div>
              <div className="portfolio-stat-box streak-box">
                <span className="box-number">{portfolio.stats.streak.current} Days</span>
                <span className="box-label">Active Streak (Best: {portfolio.stats.streak.longest}d)</span>
              </div>
            </section>

            {/* 7 Core DSA Competency Pillars */}
            <section className="portfolio-pillars-section">
              <h3 className="section-title">Core DSA Competency Matrix</h3>
              <div className="pillars-grid">
                {portfolio.readiness.topicPillars.map((p, idx) => (
                  <div className="pillar-card" key={idx}>
                    <div className="pillar-card-header">
                      <span className="pillar-title">{p.pillar}</span>
                      <span className={`pillar-badge status-${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </div>
                    <span className="pillar-count">{p.count} problem{p.count === 1 ? '' : 's'} solved</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlighted Problems Showcase */}
            {portfolio.keyProblems && portfolio.keyProblems.length > 0 && (
              <section className="portfolio-problems-section">
                <h3 className="section-title">Highlighted Problems & Technical Notes</h3>
                <table className="portfolio-problems-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Problem</th>
                      <th style={{ width: '12%' }}>Difficulty</th>
                      <th style={{ width: '20%' }}>Topic / Pattern</th>
                      <th style={{ width: '38%' }}>Approach & Key Intuition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.keyProblems.map((prob) => (
                      <tr key={prob.id}>
                        <td>
                          <div className="problem-table-title">{prob.title}</div>
                        </td>
                        <td>
                          <span className={`table-diff-badge diff-${prob.difficulty.toLowerCase()}`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td>
                          <span className="table-topic-tag">{prob.topic}</span>
                          {prob.pattern && <span className="table-pattern-tag">{prob.pattern}</span>}
                        </td>
                        <td>
                          <div className="problem-table-notes">
                            {prob.notes ? `"${prob.notes}"` : <span className="text-muted">Standard optimal implementation</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Footer */}
            <footer className="portfolio-footer">
              <div className="footer-left">
                <span>Verified by <strong>CodeTrack</strong> Spaced Repetition Engine</span>
              </div>
              <div className="footer-right">
                <span>View live portfolio: <a href="https://codetrack-henna.vercel.app" target="_blank" rel="noreferrer">codetrack-henna.vercel.app</a></span>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioModal
