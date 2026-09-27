import { useState, useMemo } from 'react'
import './ActivityHeatmap.css'

function formatDateKey(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function ActivityHeatmap({ heatmapData = {}, streak = {} }) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '', count: 0, date: '' })

  const heatmap = heatmapData?.heatmap || {}
  const totalSubmissions = heatmapData?.totalYearSubmissions || 0
  const activeDays = heatmapData?.activeDaysCount || Object.keys(heatmap).length

  // Build 53-week calendar grid ending on current week's Saturday
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTime = today.getTime()

    // End on upcoming Saturday (end of current week)
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()))

    // Start 53 weeks prior (53 * 7 = 371 days)
    const startDate = new Date(endOfWeek)
    startDate.setDate(endOfWeek.getDate() - (53 * 7 - 1))

    const computedWeeks = []
    const computedMonthLabels = []
    let lastMonth = -1

    let currentCursor = new Date(startDate)

    for (let w = 0; w < 53; w++) {
      const weekDays = []
      let weekStartMonth = -1

      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(currentCursor)
        const cellTime = cellDate.getTime()
        const isFuture = cellTime > todayTime
        const dateKey = formatDateKey(cellDate)
        const isoKey = cellDate.toISOString().slice(0, 10)
        const count = heatmap[dateKey] || heatmap[isoKey] || 0

        let level = 0
        if (count >= 5) level = 4
        else if (count >= 3) level = 3
        else if (count === 2) level = 2
        else if (count === 1) level = 1

        if (d === 0) {
          weekStartMonth = cellDate.getMonth()
        }

        weekDays.push({
          date: cellDate,
          dateKey,
          count,
          level,
          isFuture,
          label: cellDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        })

        currentCursor.setDate(currentCursor.getDate() + 1)
      }

      computedWeeks.push(weekDays)

      // Month marker if month changed and sufficient spacing
      if (weekStartMonth !== lastMonth) {
        const monthName = computedWeeks[w][0].date.toLocaleDateString('en-US', { month: 'short' })
        // Check if there is enough space from previous month marker
        const prevLabel = computedMonthLabels[computedMonthLabels.length - 1]
        if (!prevLabel || (w - prevLabel.weekIndex) >= 3) {
          computedMonthLabels.push({
            month: monthName,
            weekIndex: w,
            leftPx: w * 15.5 // 12px width + 3.5px gap
          })
          lastMonth = weekStartMonth
        }
      }
    }

    return { weeks: computedWeeks, monthLabels: computedMonthLabels }
  }, [heatmap])

  const handleMouseEnter = (e, day) => {
    if (day.isFuture) return
    const rect = e.target.getBoundingClientRect()
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 6,
      count: day.count,
      date: day.label
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  return (
    <div className="heatmap-panel">
      {/* Header with Title and Summary Stats */}
      <div className="heatmap-header">
        <div className="heatmap-title-wrap">
          <h3>
            <span>📈</span> 365-Day Activity Heatmap
          </h3>
          <p>Daily problem solving and spaced repetition consistency</p>
        </div>

        <div className="heatmap-stats-strip">
          <div className="heatmap-stat-pill">
            <span className="heatmap-stat-label">Year Total</span>
            <span className="heatmap-stat-val highlight">{totalSubmissions}</span>
          </div>
          <div className="heatmap-stat-pill">
            <span className="heatmap-stat-label">Days Active</span>
            <span className="heatmap-stat-val">{activeDays}</span>
          </div>
          <div className="heatmap-stat-pill">
            <span className="heatmap-stat-label">Current Streak</span>
            <span className="heatmap-stat-val fire">🔥 {streak.current || 0}d</span>
          </div>
          <div className="heatmap-stat-pill">
            <span className="heatmap-stat-label">Longest Streak</span>
            <span className="heatmap-stat-val">🏆 {streak.longest || 0}d</span>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Heatmap Area */}
      <div className="heatmap-scroll-area">
        {/* Month Labels */}
        <div className="heatmap-months-row">
          {monthLabels.map((m, idx) => (
            <span
              key={idx}
              className="heatmap-month-label"
              style={{ left: `${m.leftPx}px` }}
            >
              {m.month}
            </span>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="heatmap-body">
          {/* Day of Week Labels (Mon, Wed, Fri) */}
          <div className="heatmap-days-col">
            <span style={{ visibility: 'hidden' }}>Sun</span>
            <span>Mon</span>
            <span style={{ visibility: 'hidden' }}>Tue</span>
            <span>Wed</span>
            <span style={{ visibility: 'hidden' }}>Thu</span>
            <span>Fri</span>
            <span style={{ visibility: 'hidden' }}>Sat</span>
          </div>

          {/* 53 Columns */}
          <div className="heatmap-grid">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="heatmap-week-col">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className={`heatmap-cell level-${day.level} ${day.isFuture ? 'future' : ''}`}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with Legend */}
      <div className="heatmap-footer">
        <div className="heatmap-footnote">
          Past 365 days of activity · Updated in real time
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-legend-cell level-0" style={{ background: '#161c24', border: '1px solid #292e39' }} />
          <div className="heatmap-legend-cell level-1" style={{ background: '#065f46' }} />
          <div className="heatmap-legend-cell level-2" style={{ background: '#059669' }} />
          <div className="heatmap-legend-cell level-3" style={{ background: '#10b981' }} />
          <div className="heatmap-legend-cell level-4" style={{ background: '#34d399' }} />
          <span>More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {tooltip.visible && (
        <div
          className="heatmap-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          <strong>
            {tooltip.count === 0 ? 'No' : tooltip.count} {tooltip.count === 1 ? 'submission' : 'submissions'}
          </strong> on {tooltip.date}
        </div>
      )}
    </div>
  )
}

export default ActivityHeatmap
