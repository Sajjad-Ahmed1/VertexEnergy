import React, { useState } from 'react'
import { ALARMS } from '../data/mockData'
import { AlertTriangle, XCircle, CheckCircle, Clock, CheckCheck } from 'lucide-react'
import './Alarms.css'

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}
function formatAge(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function Alarms() {
  const [alarms, setAlarms] = useState(ALARMS)
  const [filter, setFilter] = useState('active')

  const unackedCritical = alarms.filter(a => a.priority === 'critical' && !a.acknowledged).length

  function ack(id) {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }
  function ackAll() {
    setAlarms(prev => prev.map(a => ({ ...a, acknowledged: true })))
  }

  const visible = alarms
    .filter(a => {
      if (filter === 'active')  return !a.acknowledged
      if (filter === 'critical') return a.priority === 'critical'
      if (filter === 'warning')  return a.priority === 'warning'
      return true
    })
    .sort((a, b) => {
      const pri = { critical: 0, warning: 1 }
      if (!a.acknowledged && b.acknowledged) return -1
      if (a.acknowledged && !b.acknowledged) return 1
      return (pri[a.priority] ?? 2) - (pri[b.priority] ?? 2)
    })

  return (
    <div className="alarms-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Alarm Management</h1>
          <p className="page-subtitle">
            {unackedCritical > 0
              ? `${unackedCritical} critical alarm${unackedCritical > 1 ? 's' : ''} require immediate attention`
              : 'No unacknowledged critical alarms'}
          </p>
        </div>
        <button
          className="ack-all-btn"
          onClick={ackAll}
          disabled={alarms.every(a => a.acknowledged)}
          aria-label="Acknowledge all active alarms"
        >
          <CheckCheck size={14} aria-hidden="true" />
          Acknowledge All
        </button>
      </header>

      {/* Stats */}
      <div className="alarms-stats" aria-label="Alarm summary">
        <div className="alarms-stat alarms-stat--critical">
          <XCircle size={20} aria-hidden="true" />
          <div>
            <span className="alarms-stat__count font-mono">
              {alarms.filter(a => a.priority === 'critical' && !a.acknowledged).length}
            </span>
            <span className="alarms-stat__label">Critical Active</span>
          </div>
        </div>
        <div className="alarms-stat alarms-stat--warning">
          <AlertTriangle size={20} aria-hidden="true" />
          <div>
            <span className="alarms-stat__count font-mono">
              {alarms.filter(a => a.priority === 'warning' && !a.acknowledged).length}
            </span>
            <span className="alarms-stat__label">Warning Active</span>
          </div>
        </div>
        <div className="alarms-stat alarms-stat--nominal">
          <CheckCircle size={20} aria-hidden="true" />
          <div>
            <span className="alarms-stat__count font-mono">
              {alarms.filter(a => a.acknowledged).length}
            </span>
            <span className="alarms-stat__label">Acknowledged</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="alarms-tabs"
        role="tablist"
        aria-label="Filter alarms"
      >
        {[
          { key: 'active',   label: 'Active' },
          { key: 'critical', label: 'Critical' },
          { key: 'warning',  label: 'Warning' },
          { key: 'all',      label: 'All' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`alarms-tab ${filter === tab.key ? 'alarms-tab--active' : ''}`}
            onClick={() => setFilter(tab.key)}
            role="tab"
            aria-selected={filter === tab.key}
            aria-label={`Show ${tab.label} alarms`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alarm table */}
      <div className="alarms-table-wrap card" role="region" aria-label="Alarm table" tabIndex={0}>
        <table className="alarms-table" aria-label="Alarms">
          <thead>
            <tr>
              <th scope="col">Priority</th>
              <th scope="col">Alarm ID</th>
              <th scope="col">Tag</th>
              <th scope="col">Asset</th>
              <th scope="col">Description</th>
              <th scope="col">Time</th>
              <th scope="col">Age</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="alarms-table__empty text-secondary">
                  No alarms match current filter.
                </td>
              </tr>
            )}
            {visible.map(alarm => (
              <tr
                key={alarm.id}
                className={`alarm-row alarm-row--${alarm.priority} ${alarm.acknowledged ? 'alarm-row--acked' : ''}`}
                aria-label={`${alarm.priority} alarm ${alarm.id}`}
              >
                <td>
                  <span className={`badge badge--${alarm.priority === 'critical' ? 'critical' : 'warning'}`}>
                    {alarm.priority === 'critical'
                      ? <XCircle size={12} aria-hidden="true" />
                      : <AlertTriangle size={12} aria-hidden="true" />
                    }
                    {alarm.priority}
                  </span>
                </td>
                <td className="font-mono" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                  {alarm.id}
                </td>
                <td>
                  <span className="alarm-tag-pill font-mono">{alarm.tag}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                  {alarm.assetName}
                </td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', maxWidth: 320 }}>
                  {alarm.description}
                </td>
                <td className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  <Clock size={11} aria-hidden="true" style={{ display: 'inline', marginRight: 4 }} />
                  <time dateTime={alarm.timestamp}>{formatTime(alarm.timestamp)}</time>
                </td>
                <td className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatAge(alarm.timestamp)}
                </td>
                <td>
                  {alarm.acknowledged ? (
                    <span className="badge badge--nominal">
                      <CheckCircle size={11} aria-hidden="true" />
                      ACK
                    </span>
                  ) : (
                    <button
                      className="alarm-ack-btn"
                      onClick={() => ack(alarm.id)}
                      aria-label={`Acknowledge alarm ${alarm.id}`}
                    >
                      ACK
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
