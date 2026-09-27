import DailyGoals from '../components/DailyGoals'
import './DailyGoalsPage.css'

function DailyGoalsPage() {
  return (
    <div className="daily-goals-page">
      <div className="goals-page-header">
        <h2>🎯 Daily Goals & Strategic Planner</h2>
        <p>Plan tomorrow today so you wake up with absolute clarity. Tomorrow's queued tasks automatically activate as your daily goals.</p>
      </div>

      <div className="goals-strategy-cards">
        <div className="strategy-card">
          <div className="strategy-icon">⚡</div>
          <div className="strategy-content">
            <h4>Today's Focus</h4>
            <p>Execute your priority targets. Check them off to build real algorithmic momentum.</p>
          </div>
        </div>

        <div className="strategy-card">
          <div className="strategy-icon">📅</div>
          <div className="strategy-content">
            <h4>Tomorrow's Queue</h4>
            <p>Eliminate decision fatigue by queuing your problem targets the night before.</p>
          </div>
        </div>

        <div className="strategy-card">
          <div className="strategy-icon">🔄</div>
          <div className="strategy-content">
            <h4>Sunrise Auto-Fetch</h4>
            <p>When tomorrow arrives, your planned tasks instantly become today's active goals.</p>
          </div>
        </div>
      </div>

      <DailyGoals />
    </div>
  )
}

export default DailyGoalsPage
