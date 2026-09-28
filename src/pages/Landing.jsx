import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const [activeTab, setActiveTab] = useState('curve')
  const [hintStep, setHintStep] = useState(1)

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        {/* Hero Section */}
        <section className="hero-section">
          <a href="#interactive-tour" className="hero-pill-badge">
            <span className="badge-dot"></span>
            <span>v1.1.0 Released · Ebbinghaus Curve &amp; Chrome Companion</span>
            <span>→</span>
          </a>

          <h1 className="hero-headline">
            Master DSA. <br />
            <span className="hero-gradient-text">Defeat the Forgetting Curve.</span>
          </h1>

          <p className="hero-subhead">
            The cognitive algorithmic learning platform engineered with Hermann Ebbinghaus memory modeling, 
            SuperMemo-2 adaptive spaced repetition, Google Gemini AI Socratic hints, and a zero-click Chrome companion.
          </p>

          <div className="hero-ctas">
            <Link to="/register" className="cta-btn-primary">
              <span>⚡ Start Tracking Free</span>
              <span>→</span>
            </Link>
            <Link to="/login" className="cta-btn-secondary">
              <span>Sign In / Demo</span>
            </Link>
            <a 
              href="/codetrack-extension.zip" 
              download="CodeTrack-Companion-v1.1.0.zip"
              className="cta-btn-extension"
              title="Download pre-packaged Chrome Extension"
            >
              <span>🧩 Download Extension (v1.1.0)</span>
            </a>
          </div>
        </section>

        {/* Live Interactive Product Tour */}
        <section className="tour-section" id="interactive-tour">
          <div className="tour-card">
            {/* Tour Navigation Tabs */}
            <div className="tour-tabs">
              <button 
                className={`tour-tab-btn ${activeTab === 'curve' ? 'active curve' : ''}`}
                onClick={() => setActiveTab('curve')}
              >
                <span>🧠</span>
                <span>Ebbinghaus Memory Curve</span>
              </button>
              <button 
                className={`tour-tab-btn ${activeTab === 'heatmap' ? 'active heatmap' : ''}`}
                onClick={() => setActiveTab('heatmap')}
              >
                <span>📈</span>
                <span>365-Day Activity Heatmap</span>
              </button>
              <button 
                className={`tour-tab-btn ${activeTab === 'extension' ? 'active extension' : ''}`}
                onClick={() => setActiveTab('extension')}
              >
                <span>🧩</span>
                <span>Chrome Zero-Click Logger</span>
              </button>
              <button 
                className={`tour-tab-btn ${activeTab === 'ai' ? 'active ai' : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                <span>🤖</span>
                <span>Gemini Socratic Coach</span>
              </button>
              <button 
                className={`tour-tab-btn ${activeTab === 'readiness' ? 'active readiness' : ''}`}
                onClick={() => setActiveTab('readiness')}
              >
                <span>🎯</span>
                <span>DSA Readiness Score</span>
              </button>
            </div>

            {/* Tour Viewport */}
            <div className="tour-viewport">
              {/* 1. Curve Tab */}
              {activeTab === 'curve' && (
                <div className="demo-curve-wrapper">
                  <div className="demo-header-row">
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#f8fafc' }}>
                        Active Memory Retention Decay: <em>R(t) = e<sup>-t / (1.5S)</sup></em>
                      </h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                        CodeTrack predicts exact memory lapse points and schedules reviews before you forget the approach.
                      </p>
                    </div>
                    <span className="demo-badge">Live Math Visualization</span>
                  </div>

                  <div className="demo-curve-svg-box">
                    <svg className="demo-curve-svg" viewBox="0 0 700 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="landingDanger" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {/* Critical Zone below 50% */}
                      <rect x="50" y="90" width="630" height="70" fill="url(#landingDanger)" />
                      <line x1="50" y1="90" x2="680" y2="90" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1.5" />
                      <text x="670" y="84" fill="#f87171" fontSize="10" fontWeight="700" textAnchor="end">50% Recall Trigger</text>

                      {/* Initial Decay Curve */}
                      <path d="M 50 20 Q 120 120 250 145 T 680 155" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="3 3" />
                      {/* 1st Revision Curve */}
                      <path d="M 50 20 Q 180 60 380 110 T 680 135" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                      {/* Mastered Curve */}
                      <path d="M 50 20 Q 250 30 500 50 T 680 65" fill="none" stroke="#34d399" strokeWidth="2.5" />

                      {/* Problem Data Nodes */}
                      <circle cx="90" cy="35" r="6" fill="#10b981" stroke="#0a0d15" strokeWidth="2" />
                      <circle cx="210" cy="70" r="6" fill="#f59e0b" stroke="#0a0d15" strokeWidth="2" />
                      <circle cx="340" cy="118" r="7" fill="#ef4444" stroke="#0a0d15" strokeWidth="2" />
                      <circle cx="340" cy="118" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />

                      {/* X-Axis labels */}
                      <text x="50" y="172" fill="#64748b" fontSize="11">Day 0</text>
                      <text x="210" y="172" fill="#64748b" fontSize="11">Day 7</text>
                      <text x="370" y="172" fill="#64748b" fontSize="11">Day 14</text>
                      <text x="530" y="172" fill="#64748b" fontSize="11">Day 21</text>
                      <text x="680" y="172" fill="#64748b" fontSize="11" textAnchor="end">Day 30</text>
                    </svg>
                  </div>

                  <div className="demo-recall-pills">
                    <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>Adaptive SM-2 Grades:</span>
                    <span className="demo-pill" style={{ background: '#7f1d1d', color: '#fca5a5' }}>Again (1d)</span>
                    <span className="demo-pill" style={{ background: '#78350f', color: '#fde68a' }}>Hard</span>
                    <span className="demo-pill" style={{ background: '#14532d', color: '#86efac' }}>Good</span>
                    <span className="demo-pill" style={{ background: '#1e3a8a', color: '#93c5fd' }}>Easy</span>
                  </div>
                </div>
              )}

              {/* 2. Heatmap Tab */}
              {activeTab === 'heatmap' && (
                <div>
                  <div className="demo-header-row" style={{ marginBottom: 16 }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#f8fafc' }}>
                        53-Week Annual Consistency Heatmap
                      </h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                        Tracks both initial solves and active revisions in a GitHub-style 5-tier emerald grid.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span className="demo-badge" style={{ background: '#064e3b', color: '#34d399', borderColor: '#059669' }}>
                        🔥 14-Day Streak
                      </span>
                      <span className="demo-badge" style={{ background: '#1e1b4b', color: '#a5b4fc', borderColor: '#4338ca' }}>
                        186 Submissions / Year
                      </span>
                    </div>
                  </div>

                  <div className="demo-heatmap-grid">
                    {Array.from({ length: 42 }).map((_, colIdx) => (
                      <div key={colIdx} className="demo-heatmap-col">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const val = (colIdx * 7 + rowIdx) % 5
                          const colors = ['#161c24', '#065f46', '#059669', '#10b981', '#34d399']
                          return (
                            <div 
                              key={rowIdx}
                              className="demo-heatmap-cell"
                              style={{ background: colors[val], border: val === 0 ? '1px solid #232c3d' : 'none' }}
                              title={`Activity level: ${val}`}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
                    <span>Less</span>
                    <span style={{ width: 11, height: 11, background: '#161c24', borderRadius: 2, border: '1px solid #283344' }}></span>
                    <span style={{ width: 11, height: 11, background: '#065f46', borderRadius: 2 }}></span>
                    <span style={{ width: 11, height: 11, background: '#059669', borderRadius: 2 }}></span>
                    <span style={{ width: 11, height: 11, background: '#10b981', borderRadius: 2 }}></span>
                    <span style={{ width: 11, height: 11, background: '#34d399', borderRadius: 2 }}></span>
                    <span>More</span>
                  </div>
                </div>
              )}

              {/* 3. Extension Tab */}
              {activeTab === 'extension' && (
                <div className="demo-extension-card">
                  <div className="demo-leetcode-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></span>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></span>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span>
                      <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 6 }}>leetcode.com/problems/trapping-rain-water</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>Manifest V3 Companion</span>
                  </div>

                  <div className="demo-toast-alert">
                    <span style={{ fontSize: 20 }}>⚡</span>
                    <div>
                      <div style={{ color: '#ffffff', fontSize: 14 }}>Solution Accepted! Problem Auto-Logged to CodeTrack</div>
                      <div style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 400 }}>
                        &ldquo;Trapping Rain Water&rdquo; · Hard · Two Pointers / Monotonic Stack · 1st Revision set for 7 days
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>Supported Platforms:</span>
                      <span style={{ fontSize: 11, background: '#1e293b', padding: '3px 8px', borderRadius: 4, color: '#f1f5f9' }}>LeetCode</span>
                      <span style={{ fontSize: 11, background: '#1e293b', padding: '3px 8px', borderRadius: 4, color: '#f1f5f9' }}>GeeksforGeeks</span>
                      <span style={{ fontSize: 11, background: '#1e293b', padding: '3px 8px', borderRadius: 4, color: '#f1f5f9' }}>Codeforces</span>
                      <span style={{ fontSize: 11, background: '#1e293b', padding: '3px 8px', borderRadius: 4, color: '#f1f5f9' }}>NeetCode</span>
                    </div>

                    <a
                      href="/codetrack-extension.zip"
                      download="CodeTrack-Companion-v1.1.0.zip"
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Download Extension ZIP →
                    </a>
                  </div>
                </div>
              )}

              {/* 4. AI Coach Tab */}
              {activeTab === 'ai' && (
                <div className="demo-ai-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>🧠</span>
                      <strong style={{ color: '#f8fafc', fontSize: 15 }}>Google Gemini 2.5 Flash Socratic Coach</strong>
                    </div>
                    <button
                      onClick={() => setHintStep(prev => prev < 4 ? prev + 1 : 1)}
                      style={{
                        background: 'rgba(192, 132, 252, 0.15)',
                        border: '1px solid #c084fc',
                        color: '#e9d5ff',
                        padding: '5px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {hintStep < 4 ? `Reveal Next Hint (${hintStep}/4) →` : 'Reset Hints ↺'}
                    </button>
                  </div>

                  <div className="hint-tier-step">
                    <div className="hint-tier-header">
                      <span>💡</span> Tier 1: Clarifying Question &amp; Constraints
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      Can an element contribute to trapped water if there is no taller barrier on both its left and right?
                    </div>
                  </div>

                  {hintStep >= 2 && (
                    <div className="hint-tier-step">
                      <div className="hint-tier-header" style={{ color: '#38bdf8' }}>
                        <span>🧭</span> Tier 2: High-Level Algorithmic Intuition
                      </div>
                      <div style={{ color: '#cbd5e1' }}>
                        Notice that water height at index <em>i</em> is bounded by <code>min(maxLeft, maxRight) - height[i]</code>. Could we compute this in a single pass using two converging pointers?
                      </div>
                    </div>
                  )}

                  {hintStep >= 3 && (
                    <div className="hint-tier-step">
                      <div className="hint-tier-header" style={{ color: '#f59e0b' }}>
                        <span>🧱</span> Tier 3: Data Structure &amp; Pattern Nudge
                      </div>
                      <div style={{ color: '#cbd5e1' }}>
                        Maintain <code>left</code> and <code>right</code> indices with <code>leftMax</code> and <code>rightMax</code>. Advance the pointer with the smaller maximum.
                      </div>
                    </div>
                  )}

                  {hintStep >= 4 && (
                    <div className="hint-tier-step">
                      <div className="hint-tier-header" style={{ color: '#10b981' }}>
                        <span>⚡</span> Tier 4: Optimal Big-O Complexity Breakdown
                      </div>
                      <div style={{ color: '#cbd5e1' }}>
                        <strong>Time:</strong> O(N) — single pass. <strong>Space:</strong> O(1) — constant space pointers with zero extra auxiliary arrays.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Readiness Tab */}
              {activeTab === 'readiness' && (
                <div className="demo-readiness-wrapper">
                  <div className="demo-gauge-circle">
                    <span style={{ fontSize: 32, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>86</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>/ 100</span>
                    <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>FAANG Ready</span>
                  </div>

                  <div className="demo-breakdown-row">
                    <div className="breakdown-item">
                      <span style={{ width: 90, color: '#94a3b8', fontWeight: 600 }}>Volume</span>
                      <div className="breakdown-bar-bg">
                        <div className="breakdown-bar-fill" style={{ width: '92%', background: '#38bdf8' }}></div>
                      </div>
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>32 / 35</span>
                    </div>

                    <div className="breakdown-item">
                      <span style={{ width: 90, color: '#94a3b8', fontWeight: 600 }}>7 Pillars</span>
                      <div className="breakdown-bar-bg">
                        <div className="breakdown-bar-fill" style={{ width: '86%', background: '#4ade80' }}></div>
                      </div>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>30 / 35</span>
                    </div>

                    <div className="breakdown-item">
                      <span style={{ width: 90, color: '#94a3b8', fontWeight: 600 }}>Retention</span>
                      <div className="breakdown-bar-bg">
                        <div className="breakdown-bar-fill" style={{ width: '80%', background: '#c084fc' }}></div>
                      </div>
                      <span style={{ color: '#c084fc', fontWeight: 700 }}>24 / 30</span>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <Link 
                        to="/register" 
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        📄 Download Verified PDF Portfolio →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6 High-Impact Features Grid */}
        <section className="features-section">
          <div className="section-title-wrap">
            <div className="section-label">Engineered For Mastery</div>
            <h2 className="section-heading">Everything You Need to Ace Tech Interviews</h2>
            <p className="section-subhead">
              CodeTrack is not just another problem logger. It is a full cognitive learning pipeline designed to guarantee long-term algorithmic recall.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-box">
              <div className="feature-box-icon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>
                🧠
              </div>
              <h3>Ebbinghaus Forgetting Curve</h3>
              <p>
                Exponential retention decay modeling calculates your exact recall probability across 30 days and triggers alerts before memory lapses.
              </p>
              <div className="feature-tag" style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#a5b4fc' }}>
                Cognitive Science
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-box">
              <div className="feature-box-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                📈
              </div>
              <h3>365-Day Activity Heatmap</h3>
              <p>
                Visual 53-week contribution grid tracking your daily solving and spaced repetition consistency with real-time hover inspections and streaks.
              </p>
              <div className="feature-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                Consistency Tracker
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-box">
              <div className="feature-box-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                🧩
              </div>
              <h3>Zero-Click Chrome Companion</h3>
              <p>
                Manifest V3 extension observes DOM verdicts on LeetCode, GeeksforGeeks, Codeforces, and NeetCode to auto-log accepted solutions without leaving your tab.
              </p>
              <div className="feature-tag" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
                Browser Automation
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-box">
              <div className="feature-box-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
                🤖
              </div>
              <h3>Gemini AI Socratic Coach</h3>
              <p>
                4-tier progressive hint scaffolding and Big-O complexity analysis that trains your analytical problem-solving instincts without spoiling solutions.
              </p>
              <div className="feature-tag" style={{ background: 'rgba(192, 132, 252, 0.1)', color: '#e9d5ff' }}>
                Generative AI
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-box">
              <div className="feature-box-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                🎯
              </div>
              <h3>Quantified Readiness Score</h3>
              <p>
                A rigorous 0–100 index assessing volume, 7 core algorithmic pillars (DP, Graphs, Trees), and SM-2 recall consistency with 1-click A4 PDF export.
              </p>
              <div className="feature-tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#7dd3fc' }}>
                Interview Metric
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-box">
              <div className="feature-box-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
                🎯
              </div>
              <h3>Daily Goals &amp; Smart Rollover</h3>
              <p>
                Queue high-priority problems, track day-to-day solving velocity, and automatically rollover uncompleted goals with 1-click revision sync.
              </p>
              <div className="feature-tag" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#fda4af' }}>
                Sprint Planning
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Cognitive Workflow */}
        <section className="workflow-section">
          <div className="section-title-wrap">
            <div className="section-label">How It Works</div>
            <h2 className="section-heading">The 3-Step Cognitive Recall Engine</h2>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step-card">
              <div className="step-num-badge">01</div>
              <h4>Solve &amp; Zero-Click Capture</h4>
              <p>
                Practice naturally on LeetCode, Codeforces, or GeeksforGeeks. The CodeTrack companion detects your Accepted verdict and logs tags, difficulty, and links automatically.
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-num-badge">02</div>
              <h4>Active Recall at Optimal Decay</h4>
              <p>
                SuperMemo-2 (SM-2) schedules active recall sessions right before retention drops below 50%. Rate your recall difficulty to adaptively expand your memory half-life.
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-num-badge">03</div>
              <h4>Prove Interview Readiness</h4>
              <p>
                Watch your Readiness Score climb into Level 4 (FAANG Ready). Export a verified, branded PDF competency portfolio to attach directly to your resume and applications.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Ribbon */}
        <div className="tech-ribbon">
          <span className="tech-badge">React 18</span>
          <span className="tech-badge">Node.js &amp; Express</span>
          <span className="tech-badge">MongoDB Atlas</span>
          <span className="tech-badge">Google Gemini 2.5 Flash</span>
          <span className="tech-badge">SuperMemo-2 (SM-2)</span>
          <span className="tech-badge">Chrome Manifest V3</span>
          <span className="tech-badge">Cloudinary</span>
          <span className="tech-badge">Jest &amp; Supertest (20 Tests)</span>
          <span className="tech-badge">Vite</span>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bottom-cta-banner">
          <h2>Stop forgetting problems you solved last month.</h2>
          <p>
            Join CodeTrack today. Build a bulletproof algorithmic memory and prove your interview readiness.
          </p>
          <Link to="/register" className="cta-btn-primary" style={{ display: 'inline-flex' }}>
            <span>Get Started Free Now →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing