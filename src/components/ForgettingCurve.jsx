import { useState, useMemo } from 'react'
import './ForgettingCurve.css'

function ForgettingCurve({ retentionData = {}, onRevise, onAddGoal, addedGoals = new Set() }) {
  const [filter, setFilter] = useState('all') // 'all' | 'critical' | 'fading' | 'high'
  const [selectedProblemId, setSelectedProblemId] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, problem: null })

  const {
    overallRetentionScore = 100,
    avgStability = 7.0,
    highCount = 0,
    fadingCount = 0,
    criticalCount = 0,
    totalTracked = 0,
    retentionProblems = []
  } = retentionData || {}

  // Filter problems for drawer and graph highlight
  const filteredProblems = useMemo(() => {
    if (filter === 'critical') return retentionProblems.filter(p => p.status === 'critical')
    if (filter === 'fading') return retentionProblems.filter(p => p.status === 'fading')
    if (filter === 'high') return retentionProblems.filter(p => p.status === 'high')
    return retentionProblems
  }, [filter, retentionProblems])

  // SVG Chart Geometry Constants
  const SVG_WIDTH = 760
  const SVG_HEIGHT = 260
  const PAD_LEFT = 55
  const PAD_RIGHT = 30
  const PAD_TOP = 25
  const PAD_BOTTOM = 35
  const PLOT_W = SVG_WIDTH - PAD_LEFT - PAD_RIGHT // 675
  const PLOT_H = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM // 200

  const getX = (days) => PAD_LEFT + (Math.min(30, Math.max(0, days)) / 30) * PLOT_W
  const getY = (retention) => PAD_TOP + ((100 - Math.min(100, Math.max(0, retention))) / 100) * PLOT_H

  // Generate Reference Decay Curves: R(t) = 100 * exp(-t / (S * 1.5))
  const { pathInitial, pathFirstRev, pathMastered } = useMemo(() => {
    const buildPath = (stability) => {
      const points = []
      for (let t = 0; t <= 30; t += 1) {
        const r = Math.exp(-t / (stability * 1.5)) * 100
        const x = getX(t)
        const y = getY(r)
        points.push(`${t === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
      }
      return points.join(' ')
    }

    return {
      pathInitial: buildPath(2),   // S = 2 days (Initial learning without revision)
      pathFirstRev: buildPath(7),  // S = 7 days (1st Spaced revision)
      pathMastered: buildPath(22)  // S = 22 days (Mastered spaced repetition)
    }
  }, [])

  const handlePointHover = (e, problem) => {
    const rect = e.target.getBoundingClientRect()
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      problem
    })
  }

  const handlePointLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  const handlePointClick = (problem) => {
    setSelectedProblemId(problem._id)
  }

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="forgetting-panel">
      {/* Header with Title and Retention KPIs */}
      <div className="forgetting-header">
        <div className="forgetting-title-wrap">
          <h3>
            <span>🧠</span> Ebbinghaus Memory Retention Curve
          </h3>
          <p>
            Mathematical retention decay <em>R = e<sup>-t / (S × 1.5)</sup></em> &amp; SuperMemo-2 spaced recall stability
          </p>
        </div>

        <div className="forgetting-kpis">
          <div className="forgetting-kpi-card">
            <div
              className="forgetting-kpi-circle"
              style={{
                border: `3px solid ${getScoreColor(overallRetentionScore)}`,
                color: getScoreColor(overallRetentionScore),
                background: `${getScoreColor(overallRetentionScore)}15`
              }}
            >
              {overallRetentionScore}%
            </div>
            <div className="forgetting-kpi-meta">
              <span className="forgetting-kpi-label">Retention Index</span>
              <span className="forgetting-kpi-val">
                {overallRetentionScore >= 75 ? 'Optimal' : overallRetentionScore >= 50 ? 'Fading' : 'At Risk'}
              </span>
            </div>
          </div>

          <div className="forgetting-kpi-card">
            <div className="forgetting-kpi-meta">
              <span className="forgetting-kpi-label">Avg Memory Stability</span>
              <span className="forgetting-kpi-val" style={{ color: '#38bdf8' }}>
                ~{avgStability} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="forgetting-controls">
        <div className="forgetting-filter-group">
          <button
            className={`forgetting-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tracked ({totalTracked})
          </button>
          <button
            className={`forgetting-filter-btn ${filter === 'critical' ? 'active critical' : ''}`}
            onClick={() => setFilter('critical')}
          >
            🔴 Critical / Due ({criticalCount})
          </button>
          <button
            className={`forgetting-filter-btn ${filter === 'fading' ? 'active fading' : ''}`}
            onClick={() => setFilter('fading')}
          >
            🟡 Fading ({fadingCount})
          </button>
          <button
            className={`forgetting-filter-btn ${filter === 'high' ? 'active high' : ''}`}
            onClick={() => setFilter('high')}
          >
            🟢 Strong ({highCount})
          </button>
        </div>

        <span style={{ fontSize: 12, color: '#94a3b8' }}>
          💡 Click any node on the graph to inspect problem retention
        </span>
      </div>

      {/* Interactive SVG Chart */}
      <div className="forgetting-chart-container">
        <svg
          className="forgetting-svg"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Critical Danger Gradient (Below 50%) */}
            <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03" />
            </linearGradient>

            {/* High Retention Safe Gradient (Above 75%) */}
            <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Background Shaded Regions */}
          {/* Safe Zone (75% - 100%) */}
          <rect
            x={PAD_LEFT}
            y={getY(100)}
            width={PLOT_W}
            height={getY(75) - getY(100)}
            fill="url(#safeGrad)"
          />

          {/* Critical Zone (0% - 50%) */}
          <rect
            x={PAD_LEFT}
            y={getY(50)}
            width={PLOT_W}
            height={getY(0) - getY(50)}
            fill="url(#dangerGrad)"
          />

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {[100, 75, 50, 25, 0].map((val) => {
            const y = getY(val)
            return (
              <g key={val}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={SVG_WIDTH - PAD_RIGHT}
                  y2={y}
                  stroke={val === 50 ? '#ef4444' : '#232936'}
                  strokeWidth={val === 50 ? 1.5 : 1}
                  strokeDasharray={val === 50 ? '4 4' : 'none'}
                />
                <text
                  x={PAD_LEFT - 10}
                  y={y + 4}
                  fill={val === 50 ? '#f87171' : '#64748b'}
                  fontSize="10.5"
                  fontWeight={val === 50 ? '700' : '500'}
                  textAnchor="end"
                >
                  {val}%
                </text>
              </g>
            )
          })}

          {/* 50% Threshold Callout Label */}
          <text
            x={SVG_WIDTH - PAD_RIGHT}
            y={getY(50) - 6}
            fill="#f87171"
            fontSize="10"
            fontWeight="700"
            textAnchor="end"
          >
            ⚡ 50% Recall Threshold (SM-2 Due)
          </text>

          {/* Vertical Gridlines & X-Axis Day Labels */}
          {[0, 5, 10, 15, 20, 25, 30].map((day) => {
            const x = getX(day)
            return (
              <g key={day}>
                <line
                  x1={x}
                  y1={PAD_TOP}
                  x2={x}
                  y2={SVG_HEIGHT - PAD_BOTTOM}
                  stroke="#232936"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={SVG_HEIGHT - PAD_BOTTOM + 16}
                  fill="#64748b"
                  fontSize="10.5"
                  textAnchor="middle"
                >
                  {day === 0 ? 'Today' : `${day}d`}
                </text>
              </g>
            )
          })}

          {/* Reference Decay Curves */}
          {/* Curve 1: Initial Learning without revision (Red/Orange) */}
          <path
            d={pathInitial}
            fill="none"
            stroke="#f87171"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            opacity="0.75"
          />

          {/* Curve 2: 1st Spaced Repetition (Cyan/Blue) */}
          <path
            d={pathFirstRev}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* Curve 3: Mastered Spaced Repetition (Emerald) */}
          <path
            d={pathMastered}
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Real Problem Data Points */}
          {retentionProblems.map((p) => {
            const isSelected = selectedProblemId === p._id
            const isCritical = p.status === 'critical'
            const cx = getX(p.daysElapsed)
            const cy = getY(p.retention)
            const color = p.status === 'critical' ? '#ef4444' : p.status === 'fading' ? '#f59e0b' : '#10b981'

            return (
              <g
                key={p._id}
                className="chart-point"
                onClick={() => handlePointClick(p)}
                onMouseEnter={(e) => handlePointHover(e, p)}
                onMouseLeave={handlePointLeave}
              >
                {/* Critical Glow Ring */}
                {isCritical && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="9"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    className="chart-point-critical"
                  />
                )}

                {/* Selected Outer Ring */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="10"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}

                {/* Main Node */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 7 : 5.5}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </g>
            )
          })}
        </svg>

        {/* Legend beneath the canvas */}
        <div className="forgetting-legend-bar">
          <div className="forgetting-legend-items">
            <div className="forgetting-legend-item">
              <div className="forgetting-curve-sample" style={{ background: '#34d399' }} />
              <span>Mastered Curve (S=22d)</span>
            </div>
            <div className="forgetting-legend-item">
              <div className="forgetting-curve-sample" style={{ background: '#38bdf8' }} />
              <span>1st Revision (S=7d)</span>
            </div>
            <div className="forgetting-legend-item">
              <div className="forgetting-curve-sample" style={{ background: '#f87171' }} />
              <span>Initial Decay (S=2d)</span>
            </div>
          </div>

          <div className="forgetting-legend-items">
            <div className="forgetting-legend-item">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>High (&ge;75%)</span>
            </div>
            <div className="forgetting-legend-item">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span>Fading (50-74%)</span>
            </div>
            <div className="forgetting-legend-item">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span>Due (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating SVG Tooltip */}
      {tooltip.visible && tooltip.problem && (
        <div
          className="forgetting-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4, color: '#ffffff' }}>
            {tooltip.problem.title}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 4,
                background: '#1e293b',
                color: '#94a3b8'
              }}
            >
              {tooltip.problem.topic || 'General'}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 4,
                background:
                  tooltip.problem.difficulty === 'Hard'
                    ? '#7f1d1d'
                    : tooltip.problem.difficulty === 'Medium'
                    ? '#78350f'
                    : '#14532d',
                color: '#f8fafc'
              }}
            >
              {tooltip.problem.difficulty}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.4 }}>
            <div>
              Retention:{' '}
              <strong style={{ color: getScoreColor(tooltip.problem.retention) }}>
                {tooltip.problem.retention}% ({tooltip.problem.status})
              </strong>
            </div>
            <div>Elapsed: {tooltip.problem.daysElapsed} days</div>
            <div>Stability: {tooltip.problem.stability}d · Rev #{tooltip.problem.revisionCount}</div>
          </div>
        </div>
      )}

      {/* Problem Cards Drawer for Active Filter */}
      {filteredProblems.length > 0 && (
        <div className="forgetting-problem-drawer">
          <div className="forgetting-drawer-header">
            <h4>
              <span>📋</span> Problems in Focus ({filteredProblems.length})
            </h4>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Practice active recall to boost stability
            </span>
          </div>

          <div className="forgetting-problem-grid">
            {filteredProblems.map((p) => {
              const isAdded = addedGoals.has(p._id)
              const color = p.status === 'critical' ? '#ef4444' : p.status === 'fading' ? '#f59e0b' : '#10b981'

              return (
                <div
                  key={p._id}
                  className="forgetting-card"
                  style={{
                    borderColor: selectedProblemId === p._id ? '#6366f1' : undefined
                  }}
                >
                  <div className="forgetting-card-top">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className="forgetting-card-title">{p.title}</span>
                      <div className="forgetting-card-meta">
                        <span>{p.topic}</span>
                        <span>·</span>
                        <span
                          style={{
                            color:
                              p.difficulty === 'Hard'
                                ? '#f87171'
                                : p.difficulty === 'Medium'
                                ? '#fbbf24'
                                : '#34d399',
                            fontWeight: 600
                          }}
                        >
                          {p.difficulty}
                        </span>
                        <span>·</span>
                        <span>{p.daysElapsed}d ago</span>
                        <span>·</span>
                        <span>Rev #{p.revisionCount}</span>
                      </div>
                    </div>

                    {/* 1-Click Add Goal */}
                    {onAddGoal && (
                      <button
                        onClick={() => onAddGoal(p)}
                        disabled={isAdded}
                        style={{
                          background: isAdded ? '#15803d' : '#1e293b',
                          color: isAdded ? '#ffffff' : '#cbd5e1',
                          border: '1px solid #334155',
                          borderRadius: 6,
                          padding: '3px 8px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: isAdded ? 'default' : 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isAdded ? '✓ Added' : '+ Goal'}
                      </button>
                    )}
                  </div>

                  {/* Retention Bar */}
                  <div className="forgetting-bar-container">
                    <div className="forgetting-bar-bg">
                      <div
                        className="forgetting-bar-fill"
                        style={{
                          width: `${p.retention}%`,
                          background: color
                        }}
                      />
                    </div>
                    <span className="forgetting-bar-label" style={{ color }}>
                      {p.retention}%
                    </span>
                  </div>

                  {/* Active Recall Actions */}
                  {onRevise && (
                    <div className="forgetting-card-actions">
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Recall Grade:</span>
                      <div className="recall-group">
                        <button
                          className="recall-btn"
                          onClick={() => onRevise(p._id, 'again')}
                          style={{ background: '#7f1d1d', color: '#fca5a5' }}
                          title="Lapsed recall. Reset to 1 day."
                        >
                          Again (1d)
                        </button>
                        <button
                          className="recall-btn"
                          onClick={() => onRevise(p._id, 'hard')}
                          style={{ background: '#78350f', color: '#fde68a' }}
                          title="Struggled to recall."
                        >
                          Hard
                        </button>
                        <button
                          className="recall-btn"
                          onClick={() => onRevise(p._id, 'good')}
                          style={{ background: '#14532d', color: '#86efac' }}
                          title="Normal recall."
                        >
                          Good
                        </button>
                        <button
                          className="recall-btn"
                          onClick={() => onRevise(p._id, 'easy')}
                          style={{ background: '#1e3a8a', color: '#93c5fd' }}
                          title="Effortless recall."
                        >
                          Easy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgettingCurve
