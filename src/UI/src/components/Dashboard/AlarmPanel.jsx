import React, { useState } from 'react'
import { AlertTriangle, XCircle, CheckCircle, Clock } from 'lucide-react'
import { ALARMS } from '../../data/mockData'
import './AlarmPanel.css'

function formatAge(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
}

const PRIORITY_ICON = {
  critical: XCircle,
  warning:  AlertTriangle,
  nominal:  CheckCircle,
}

export default function AlarmPanel() {
  const [alarms, setAlarms] = useState(ALARMS)

  function acknowledge(id) {
    setAlarms(prev =>
      prev.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    )
  }

  const sorted = [...alarms].sort((a, b) => {
    const pri = { critical: 0, warning: 1, nominal: 2 }
    if (pri[a.priority] !== pri[b.priority]) return pri[a.priority] - pri[b.priority]
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  return (
    <section className="alarm-panel card" aria-labelledby="alarm-panel-heading">
      <div className="alarm-panel__header">
        <h2 id="alarm-panel-heading" className="alarm-panel__title">
          Active Alarms
        </h2>
        <span className="badge badge--critical" aria-live="polite">
          {alarms.filter(a => a.priority === 'critical' && !a.acknowledged).length} Unacknowledged
        </span>
      </div>

      <ul
        className="alarm-panel__list"
        role="list"
        aria-label="Active alarm list"
      >
        {sorted.map(alarm => {
          const Icon = PRIORITY_ICON[alarm.priority] ?? AlertTriangle
          return (
            <li
              key={alarm.id}
              className={`alarm-item alarm-item--${alarm.priority} ${alarm.acknowledged ? 'alarm-item--acked' : ''}`}
              aria-label={`${alarm.priority} alarm on ${alarm.assetName}: ${alarm.description}`}
            >
              <span className="alarm-item__icon" aria-hidden="true">
                <Icon size={16} />
              </span>

              <div className="alarm-item__body">
                <div className="alarm-item__top">
                  <span className="alarm-item__id font-mono">{alarm.id}</span>
                  <span className="alarm-item__tag font-mono">{alarm.tag}</span>
                  <span className="alarm-item__asset">{alarm.assetName}</span>
                </div>
                <p className="alarm-item__desc">{alarm.description}</p>
                <div className="alarm-item__meta">
                  <Clock size={12} aria-hidden="true" />
                  <time dateTime={alarm.timestamp}>{formatAge(alarm.timestamp)}</time>
                  {alarm.acknowledged && (
                    <span className="alarm-item__acked-label">Acknowledged</span>
                  )}
                </div>
              </div>

              {!alarm.acknowledged && (
                <button
                  className="alarm-item__ack-btn"
                  onClick={() => acknowledge(alarm.id)}
                  aria-label={`Acknowledge alarm ${alarm.id}`}
                >
                  ACK
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
