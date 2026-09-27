import { useState, useEffect } from 'react'
import { analyzeComplexity, getSocraticHints } from '../services/api'
import './AICoachModal.css'

function AICoachModal({ isOpen, onClose, initialProblem = null }) {
  const [activeTab, setActiveTab] = useState('hints') // 'hints' | 'complexity'

  // Socratic Hints State
  const [problemData, setProblemData] = useState({
    title: initialProblem?.title || '',
    topic: initialProblem?.topic || 'Algorithms',
    difficulty: initialProblem?.difficulty || 'Medium',
    notes: initialProblem?.notes || ''
  })
  const [userQuery, setUserQuery] = useState('')
  const [hintsLoading, setHintsLoading] = useState(false)
  const [hintsData, setHintsData] = useState(null)
  const [revealedTiers, setRevealedTiers] = useState({ 1: true, 2: false, 3: false, 4: false })
  const [hintsError, setHintsError] = useState('')

  // Complexity State
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [complexityLoading, setComplexityLoading] = useState(false)
  const [complexityResult, setComplexityResult] = useState(null)
  const [complexityError, setComplexityError] = useState('')

  // Sync initial problem when modal opens
  useEffect(() => {
    if (initialProblem) {
      setProblemData({
        title: initialProblem.title || '',
        topic: initialProblem.topic || 'Algorithms',
        difficulty: initialProblem.difficulty || 'Medium',
        notes: initialProblem.notes || ''
      })
      // Auto fetch hints when opened for a specific problem
      fetchHints({
        title: initialProblem.title,
        topic: initialProblem.topic,
        difficulty: initialProblem.difficulty,
        notes: initialProblem.notes
      })
    }
  }, [initialProblem])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const fetchHints = async (overrideData = null) => {
    const dataToUse = overrideData || problemData
    if (!dataToUse.title) {
      setHintsError('Please provide a problem title.')
      return
    }

    setHintsLoading(true)
    setHintsError('')
    try {
      const res = await getSocraticHints({
        title: dataToUse.title,
        topic: dataToUse.topic,
        difficulty: dataToUse.difficulty,
        notes: dataToUse.notes,
        userQuery: userQuery.trim()
      })
      setHintsData(res)
      // Level 1 revealed by default, rest locked until user wants them
      setRevealedTiers({ 1: true, 2: false, 3: false, 4: false })
    } catch (err) {
      setHintsError(err.response?.data?.message || 'Failed to fetch Socratic hints.')
    } finally {
      setHintsLoading(false)
    }
  }

  const toggleTier = (tier) => {
    setRevealedTiers(prev => ({ ...prev, [tier]: !prev[tier] }))
  }

  const handleAnalyzeComplexity = async () => {
    if (!code.trim()) {
      setComplexityError('Please paste or write some code first.')
      return
    }

    setComplexityLoading(true)
    setComplexityError('')
    try {
      const res = await analyzeComplexity({
        code: code.trim(),
        language,
        problemContext: {
          title: problemData.title,
          topic: problemData.topic,
          difficulty: problemData.difficulty
        }
      })
      setComplexityResult(res)
    } catch (err) {
      setComplexityError(err.response?.data?.message || 'Failed to analyze code complexity.')
    } finally {
      setComplexityLoading(false)
    }
  }

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-header-title-row">
            <div className="ai-header-badge">🧠 Gemini 2.5 AI Coach</div>
            {problemData.title && (
              <span className="ai-problem-tag">
                {problemData.title}
                {problemData.difficulty && (
                  <span className={`ai-diff-tag diff-${problemData.difficulty.toLowerCase()}`}>
                    {problemData.difficulty}
                  </span>
                )}
              </span>
            )}
          </div>
          <button className="ai-close-btn" onClick={onClose} title="Close (Esc)">✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="ai-tabs">
          <button
            className={`ai-tab-btn ${activeTab === 'hints' ? 'active' : ''}`}
            onClick={() => setActiveTab('hints')}
          >
            <span>💡 Socratic Hint Engine</span>
          </button>
          <button
            className={`ai-tab-btn ${activeTab === 'complexity' ? 'active' : ''}`}
            onClick={() => setActiveTab('complexity')}
          >
            <span>⏱️ Big-O Complexity Analyzer</span>
          </button>
        </div>

        {/* Tab 1: Socratic Hints */}
        {activeTab === 'hints' && (
          <div className="ai-tab-body">
            {!initialProblem && (
              <div className="ai-problem-setup-bar">
                <input
                  type="text"
                  placeholder="Enter problem title (e.g. Trapping Rain Water)..."
                  value={problemData.title}
                  onChange={(e) => setProblemData(prev => ({ ...prev, title: e.target.value }))}
                  className="ai-input"
                />
                <select
                  value={problemData.topic}
                  onChange={(e) => setProblemData(prev => ({ ...prev, topic: e.target.value }))}
                  className="ai-select"
                >
                  <option value="Algorithms">Algorithms</option>
                  <option value="Two Pointers">Two Pointers</option>
                  <option value="Sliding Window">Sliding Window</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Binary Search">Binary Search</option>
                  <option value="Trees">Trees / BST</option>
                  <option value="Graphs">Graphs / BFS / DFS</option>
                  <option value="Stack">Stack / Monotonic Stack</option>
                  <option value="Backtracking">Backtracking</option>
                </select>
                <button
                  className="ai-action-btn primary"
                  onClick={() => fetchHints()}
                  disabled={hintsLoading || !problemData.title.trim()}
                >
                  {hintsLoading ? 'Thinking...' : 'Get Hints'}
                </button>
              </div>
            )}

            {hintsError && <div className="ai-alert error">{hintsError}</div>}

            {hintsLoading && (
              <div className="ai-loading-skeleton">
                <div className="ai-spinner"></div>
                <p>Generating progressive Socratic clues for <strong>{problemData.title}</strong>...</p>
                <span className="ai-subtext">Teaching principles without spoiling the entire solution.</span>
              </div>
            )}

            {!hintsLoading && hintsData && (
              <div className="ai-hints-container">
                {/* Pedagogical Tip Banner */}
                {hintsData.coachTip && (
                  <div className="ai-coach-banner">
                    <span className="ai-coach-icon">🎯</span>
                    <div>
                      <strong>Coach's Mental Model:</strong>
                      <p>{hintsData.coachTip}</p>
                    </div>
                  </div>
                )}

                {/* Tier 1 */}
                <div className="hint-card">
                  <div className="hint-card-header" onClick={() => toggleTier(1)}>
                    <div className="hint-tier-label">
                      <span className="tier-number tier-1">Level 1</span>
                      <strong>Core Intuition & Pattern</strong>
                    </div>
                    <span className="hint-chevron">{revealedTiers[1] ? '▲' : '▼'}</span>
                  </div>
                  {revealedTiers[1] && (
                    <div className="hint-card-body">
                      <p>{hintsData.hint1}</p>
                    </div>
                  )}
                </div>

                {/* Tier 2 */}
                <div className="hint-card">
                  <div className="hint-card-header" onClick={() => toggleTier(2)}>
                    <div className="hint-tier-label">
                      <span className="tier-number tier-2">Level 2</span>
                      <strong>Invariant & Algorithmic Step</strong>
                    </div>
                    <span className="hint-chevron">{revealedTiers[2] ? '▲' : '▼'}</span>
                  </div>
                  {revealedTiers[2] ? (
                    <div className="hint-card-body">
                      <p>{hintsData.hint2}</p>
                    </div>
                  ) : (
                    <div className="hint-card-locked" onClick={() => toggleTier(2)}>
                      <span>🔒 Click to reveal Level 2 clue</span>
                    </div>
                  )}
                </div>

                {/* Tier 3 */}
                <div className="hint-card">
                  <div className="hint-card-header" onClick={() => toggleTier(3)}>
                    <div className="hint-tier-label">
                      <span className="tier-number tier-3">Level 3</span>
                      <strong>Edge Cases & Traps to Guard Against</strong>
                    </div>
                    <span className="hint-chevron">{revealedTiers[3] ? '▲' : '▼'}</span>
                  </div>
                  {revealedTiers[3] ? (
                    <div className="hint-card-body">
                      <p>{hintsData.hint3}</p>
                    </div>
                  ) : (
                    <div className="hint-card-locked" onClick={() => toggleTier(3)}>
                      <span>🔒 Click to reveal Level 3 edge cases</span>
                    </div>
                  )}
                </div>

                {/* Tier 4 */}
                <div className="hint-card">
                  <div className="hint-card-header" onClick={() => toggleTier(4)}>
                    <div className="hint-tier-label">
                      <span className="tier-number tier-4">Level 4</span>
                      <strong>Structural Pseudocode</strong>
                    </div>
                    <span className="hint-chevron">{revealedTiers[4] ? '▲' : '▼'}</span>
                  </div>
                  {revealedTiers[4] ? (
                    <div className="hint-card-body">
                      <pre className="hint-pseudocode"><code>{hintsData.hint4}</code></pre>
                    </div>
                  ) : (
                    <div className="hint-card-locked" onClick={() => toggleTier(4)}>
                      <span>🔒 Click to reveal Level 4 pseudocode outline</span>
                    </div>
                  )}
                </div>

                {/* Specific Question Input */}
                <div className="ai-custom-query-box">
                  <label>Have a specific question about your approach?</label>
                  <div className="ai-query-row">
                    <input
                      type="text"
                      placeholder="e.g., Can I solve this without recursion to save stack memory?"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') fetchHints() }}
                      className="ai-input"
                    />
                    <button
                      className="ai-action-btn secondary"
                      onClick={() => fetchHints()}
                      disabled={hintsLoading}
                    >
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!hintsLoading && !hintsData && initialProblem && (
              <div className="ai-empty-state">
                <button className="ai-action-btn primary btn-lg" onClick={() => fetchHints()}>
                  ⚡ Generate Socratic Hints for "{initialProblem.title}"
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Complexity Analyzer */}
        {activeTab === 'complexity' && (
          <div className="ai-tab-body">
            <div className="complexity-controls">
              <div className="complexity-control-group">
                <label>Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="ai-select-sm"
                >
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
              <button
                className="ai-action-btn primary"
                onClick={handleAnalyzeComplexity}
                disabled={complexityLoading || !code.trim()}
              >
                {complexityLoading ? 'Computing Big-O...' : '⚡ Analyze Big-O Complexity'}
              </button>
            </div>

            <div className="code-editor-wrapper">
              <textarea
                className="code-editor-textarea"
                placeholder="// Paste your solution code or function here...
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                spellCheck="false"
              />
            </div>

            {complexityError && <div className="ai-alert error">{complexityError}</div>}

            {complexityLoading && (
              <div className="ai-loading-skeleton">
                <div className="ai-spinner"></div>
                <p>Analyzing asymptotic time & space bounds...</p>
              </div>
            )}

            {!complexityLoading && complexityResult && (
              <div className="complexity-results">
                {/* Metric Summary Cards */}
                <div className="complexity-cards-grid">
                  <div className="complexity-stat-card time">
                    <span className="stat-label">TIME COMPLEXITY</span>
                    <span className="stat-badge time-badge">{complexityResult.timeComplexity}</span>
                    <p className="stat-desc">{complexityResult.timeExplanation}</p>
                  </div>

                  <div className="complexity-stat-card space">
                    <span className="stat-label">SPACE COMPLEXITY</span>
                    <span className="stat-badge space-badge">{complexityResult.spaceComplexity}</span>
                    <p className="stat-desc">{complexityResult.spaceExplanation}</p>
                  </div>
                </div>

                {/* Optimality Indicator */}
                <div className={`optimality-banner ${complexityResult.isOptimal ? 'optimal' : 'improvable'}`}>
                  <span className="optimality-icon">{complexityResult.isOptimal ? '⭐' : '💡'}</span>
                  <span>
                    <strong>{complexityResult.isOptimal ? 'Optimal Solution' : 'Optimization Potential'}:</strong>{' '}
                    {complexityResult.isOptimal
                      ? 'Matches theoretical lower asymptotic bounds.'
                      : 'Can potentially be improved to lower time or space complexity.'}
                  </span>
                </div>

                {/* Bottlenecks & Optimizations Grid */}
                <div className="complexity-details-grid">
                  {complexityResult.bottlenecks && complexityResult.bottlenecks.length > 0 && (
                    <div className="complexity-detail-box bottlenecks">
                      <h4>⚠️ Bottlenecks Detected</h4>
                      <ul>
                        {complexityResult.bottlenecks.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {complexityResult.optimizations && complexityResult.optimizations.length > 0 && (
                    <div className="complexity-detail-box optimizations">
                      <h4>🚀 Algorithmic Recommendations</h4>
                      <ul>
                        {complexityResult.optimizations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AICoachModal
