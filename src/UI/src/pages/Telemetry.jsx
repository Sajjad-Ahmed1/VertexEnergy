import React, { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import { ASSETS, TELEMETRY_SERIES } from '../data/mockData'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import './Telemetry.css'

const SERIES_KEYS = Object.keys(TELEMETRY_SERIES)

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip" role="tooltip">
      <p className="chart-tooltip__label font-mono">{label}</p>
      {payload.map(entry => (
        <p key={entry.dataKey} className="chart-tooltip__row" style={{ color: entry.color }}>
          <span className="font-mono">{entry.dataKey}</span>
          <span className="font-mono">{entry.value} {TELEMETRY_SERIES[entry.dataKey]?.unit}</span>
        </p>
      ))}
    </div>
  )
}

function trendIcon(data) {
  if (!data || data.length < 2) return <Minus size={14} />
  const delta = data[data.length - 1].value - data[data.length - 2].value
  if (delta > 0.5) return <TrendingUp size={14} className="trend-up" aria-label="trending up" />
  if (delta < -0.5) return <TrendingDown size={14} className="trend-down" aria-label="trending down" />
  return <Minus size={14} className="trend-flat" aria-label="stable" />
}

export default function Telemetry() {
  const [selectedTag, setSelectedTag] = useState(SERIES_KEYS[0])
  const series = TELEMETRY_SERIES[selectedTag]

  // All tags flat list from all assets
  const allTags = ASSETS.flatMap(a => a.tags.map(t => ({ ...t, assetId: a.id, assetName: a.name })))

  return (
    <div className="telemetry-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Telemetry</h1>
          <p className="page-subtitle">Live tag data — all assets, all instruments</p>
        </div>
      </header>

      {/* Tag selector row */}
      <section className="telemetry-tag-selector" aria-label="Select tag for trend chart">
        <h2 className="telemetry-tag-selector__label">Trend View</h2>
        <div className="telemetry-tag-btns" role="group" aria-label="Tag selection">
          {SERIES_KEYS.map(key => {
            const s = TELEMETRY_SERIES[key]
            return (
              <button
                key={key}
                className={`telemetry-tag-btn ${selectedTag === key ? 'active' : ''}`}
                style={{ '--series-color': s.color }}
                onClick={() => setSelectedTag(key)}
                aria-pressed={selectedTag === key}
                aria-label={`Show trend for ${s.label}`}
              >
                <span className="telemetry-tag-btn__dot" aria-hidden="true" />
                <span className="font-mono">{key}</span>
                <span className="telemetry-tag-btn__label">{s.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Main trend chart */}
      <section className="card telemetry-main-chart" aria-labelledby="main-chart-heading">
        <div className="telemetry-main-chart__header">
          <div>
            <h2 id="main-chart-heading" className="telemetry-main-chart__title">
              <span className="font-mono" style={{ color: series.color }}>{selectedTag}</span>
              &nbsp;— {series.label}
            </h2>
            <p className="telemetry-main-chart__meta text-secondary">
              24-hour trend · 30-minute intervals · unit: <span className="font-mono">{series.unit}</span>
            </p>
          </div>
          <div className="telemetry-main-chart__current" aria-label={`Current value: ${series.data[series.data.length - 1]?.value} ${series.unit}`}>
            <span className="font-mono telemetry-main-chart__value" style={{ color: series.color }}>
              {series.data[series.data.length - 1]?.value}
            </span>
            <span className="telemetry-main-chart__unit text-muted font-mono">{series.unit}</span>
            {trendIcon(series.data)}
          </div>
        </div>

        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={series.data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id={`grad-${selectedTag}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={series.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={series.color} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#6E7681', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                interval={7}
                axisLine={{ stroke: '#30363D' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6E7681', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip content={<DarkTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={series.color}
                strokeWidth={2}
                fill={`url(#grad-${selectedTag})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: series.color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* All tags table */}
      <section className="card" aria-labelledby="all-tags-heading">
        <h2 id="all-tags-heading" className="telemetry-table-title">
          <Activity size={16} aria-hidden="true" />
          All Tag Readings
        </h2>
        <div className="telemetry-table-wrap" role="region" aria-label="All tag readings" tabIndex={0}>
          <table className="telemetry-table">
            <thead>
              <tr>
                <th scope="col">Tag ID</th>
                <th scope="col">Name</th>
                <th scope="col">Asset</th>
                <th scope="col" className="align-right">Value</th>
                <th scope="col" className="align-right">Unit</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {allTags.map(tag => (
                <tr
                  key={`${tag.assetId}-${tag.id}`}
                  className={`telemetry-row telemetry-row--${tag.status}`}
                  aria-label={`${tag.id}: ${tag.value} ${tag.unit}`}
                >
                  <td className="font-mono telemetry-tag-id">{tag.id}</td>
                  <td>{tag.name}</td>
                  <td className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>{tag.assetName}</td>
                  <td className="align-right font-mono telemetry-tag-value"
                    style={{ color: tag.status === 'critical' ? 'var(--critical)' : tag.status === 'warning' ? 'var(--warning)' : 'var(--text-primary)' }}>
                    {tag.value}
                  </td>
                  <td className="align-right font-mono text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    {tag.unit}
                  </td>
                  <td>
                    <span className={`badge badge--${tag.status === 'nominal' ? 'nominal' : tag.status === 'warning' ? 'warning' : 'critical'}`}>
                      {tag.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}