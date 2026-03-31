import React, { useState, useEffect } from 'react'
import { Bell, User, RefreshCw } from 'lucide-react'
import './TopBar.css'

export default function TopBar({ criticalCount, warningCount }) {
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = clock.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const dateStr = clock.toLocaleDateString('en-GB', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <header className="topbar" role="banner">
      {/* Live system clock */}
      <div className="topbar__clock" aria-label={`Current time: ${timeStr}`}>
        <span className="live-dot" aria-hidden="true" />
        <span className="topbar__time font-mono">{timeStr}</span>
        <span className="topbar__date">{dateStr}</span>
      </div>

      {/* System status */}
      <div className="topbar__status" aria-label="System status summary">
        {criticalCount > 0 && (
          <span className="badge badge--critical" role="status" aria-live="polite">
            <span className="live-dot live-dot--critical" aria-hidden="true" />
            {criticalCount} Critical
          </span>
        )}
        {warningCount > 0 && (
          <span className="badge badge--warning" role="status">
            {warningCount} Warning
          </span>
        )}
        {criticalCount === 0 && warningCount === 0 && (
          <span className="badge badge--nominal" role="status">
            All Systems Nominal
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="topbar__actions">
        <button
          className="topbar__icon-btn"
          aria-label="Refresh data"
          title="Refresh data"
        >
          <RefreshCw size={16} aria-hidden="true" />
        </button>

        <button
          className="topbar__icon-btn topbar__icon-btn--alarm"
          aria-label={`Alarms${criticalCount > 0 ? `, ${criticalCount} critical unacknowledged` : ''}`}
          title="Alarms"
        >
          <Bell size={16} aria-hidden="true" />
          {criticalCount > 0 && (
            <span className="topbar__notif" aria-hidden="true">{criticalCount}</span>
          )}
        </button>

        <button
          className="topbar__icon-btn topbar__user-btn"
          aria-label="Operator account menu"
          title="Operator account"
        >
          <User size={16} aria-hidden="true" />
          <span className="topbar__username">OPS\Sajjad</span>
        </button>
      </div>
    </header>
  )
}
