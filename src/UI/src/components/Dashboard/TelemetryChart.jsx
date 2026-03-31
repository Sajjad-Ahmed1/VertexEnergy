import React, { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { TELEMETRY_SERIES } from '../../data/mockData'
import './TelemetryChart.css'

const SERIES_KEYS = Object.keys(TELEMETRY_SERIES)

// Custom tooltip styled for dark mode
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

export default function TelemetryChart() {
  const [selected, setSelected] = useState([SERIES_KEYS[0], SERIES_KEYS[1]])

  // Merge series into single array for recharts
  const chartData = TELEMETRY_SERIES[SERIES_KEYS[0]].data.map((point, i) => {
    const row = { time: point.time }
    SERIES_KEYS.forEach(key => {
      row[key] = TELEMETRY_SERIES[key].data[i]?.value ?? null
    })
    return row
  })

  function toggleSeries(key) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  return (
    <section className="telemetry-chart card" aria-labelledby="telemetry-chart-heading">
      <div className="telemetry-chart__header">
        <h2 id="telemetry-chart-heading" className="telemetry-chart__title">
          Live Telemetry — 24h
        </h2>
        <div
          className="telemetry-chart__legend"
          role="group"
          aria-label="Toggle telemetry series"
        >
          {SERIES_KEYS.map(key => {
            const s = TELEMETRY_SERIES[key]
            const active = selected.includes(key)
            return (
              <button
                key={key}
                className={`telemetry-chart__legend-btn ${active ? 'active' : ''}`}
                style={{ '--series-color': s.color }}
                onClick={() => toggleSeries(key)}
                aria-pressed={active}
                aria-label={`${active ? 'Hide' : 'Show'} ${s.label}`}
              >
                <span className="telemetry-chart__legend-dot" aria-hidden="true" />
                <span className="font-mono">{key}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="telemetry-chart__plot" aria-hidden="true">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
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
              width={40}
            />
            <Tooltip content={<DarkTooltip />} />
            {SERIES_KEYS.filter(k => selected.includes(k)).map(key => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={TELEMETRY_SERIES[key].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
