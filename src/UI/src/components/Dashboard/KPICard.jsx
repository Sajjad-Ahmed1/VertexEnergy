import React from 'react'
import './KPICard.css'

/**
 * KPICard — displays a single key performance indicator
 * severity: 'nominal' | 'warning' | 'critical' | 'info'
 */
export default function KPICard({ label, value, unit, icon: Icon, severity = 'info', trend, description }) {
  return (
    <article
      className={`kpi-card kpi-card--${severity}`}
      aria-label={`${label}: ${value}${unit ? ' ' + unit : ''}`}
    >
      <div className="kpi-card__header">
        <span className="kpi-card__label">{label}</span>
        {Icon && (
          <span className="kpi-card__icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
      </div>

      <div className="kpi-card__value-row">
        <span className="kpi-card__value font-mono">{value}</span>
        {unit && <span className="kpi-card__unit">{unit}</span>}
        {trend !== undefined && (
          <span
            className={`kpi-card__trend ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-flat'}`}
            aria-label={trend > 0 ? 'trending up' : trend < 0 ? 'trending down' : 'stable'}
          >
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'}
          </span>
        )}
      </div>

      {description && (
        <p className="kpi-card__desc">{description}</p>
      )}
    </article>
  )
}
