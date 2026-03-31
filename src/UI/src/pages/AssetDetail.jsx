import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ASSETS, TELEMETRY_SERIES } from '../data/mockData'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { ArrowLeft, Cpu, Activity, GitBranch, MapPin } from 'lucide-react'
import './AssetDetail.css'

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip" role="tooltip">
      <p className="chart-tooltip__label font-mono">{label}</p>
      {payload.map(e => (
        <p key={e.dataKey} className="chart-tooltip__row" style={{ color: e.color }}>
          <span className="font-mono">value</span>
          <span className="font-mono">{e.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AssetDetail() {
  const { assetId } = useParams()
  const asset = ASSETS.find(a => a.id === assetId)

  if (!asset) {
    return (
      <div className="asset-detail-notfound">
        <p className="text-secondary">Asset <span className="font-mono">{assetId}</span> not found.</p>
        <Link to="/assets" className="asset-detail-back">← Back to Assets</Link>
      </div>
    )
  }

  // Pick a chart series for the first tag if available
  const firstTagKey = Object.keys(TELEMETRY_SERIES).find(k =>
    asset.tags.some(t => t.id === k)
  ) ?? Object.keys(TELEMETRY_SERIES)[0]
  const series = TELEMETRY_SERIES[firstTagKey]

  return (
    <div className="asset-detail">
      {/* Back */}
      <Link to="/assets" className="asset-detail-back" aria-label="Back to Assets list">
        <ArrowLeft size={14} aria-hidden="true" />
        All Assets
      </Link>

      {/* Header */}
      <header className="asset-detail-header card">
        <div className="asset-detail-header__left">
          <Cpu size={24} className="asset-detail-header__icon" aria-hidden="true" />
          <div>
            <span className="asset-detail-header__id font-mono">{asset.id}</span>
            <h1 className="asset-detail-header__name">{asset.name}</h1>
            <p className="asset-detail-header__loc">
              <MapPin size={12} aria-hidden="true" />
              {asset.location}
            </p>
          </div>
        </div>
        <div className="asset-detail-header__right">
          <span className={`badge badge--${asset.status === 'nominal' ? 'nominal' : asset.status === 'warning' ? 'warning' : 'critical'}`}>
            <span
              className={`live-dot ${asset.status === 'critical' ? 'live-dot--critical' : asset.status === 'warning' ? 'live-dot--warning' : ''}`}
              aria-hidden="true"
            />
            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
          </span>
          <div className="asset-detail-uptime">
            Uptime: <strong className="font-mono">{asset.uptime}%</strong>
          </div>
        </div>
      </header>

      <div className="asset-detail-grid">
        {/* Tag readings */}
        <section className="card" aria-labelledby="tag-readings-heading">
          <h2 id="tag-readings-heading" className="asset-detail-section-title">
            <Activity size={16} aria-hidden="true" />
            Tag Readings
          </h2>
          <div className="asset-detail-tags">
            {asset.tags.map(tag => (
              <div
                key={tag.id}
                className={`asset-detail-tag asset-detail-tag--${tag.status}`}
                aria-label={`${tag.name}: ${tag.value} ${tag.unit}, status ${tag.status}`}
              >
                <div className="asset-detail-tag__top">
                  <span className="asset-detail-tag__id font-mono">{tag.id}</span>
                  <span className={`badge badge--${tag.status === 'nominal' ? 'nominal' : tag.status === 'warning' ? 'warning' : 'critical'}`}>
                    {tag.status}
                  </span>
                </div>
                <div className="asset-detail-tag__value font-mono">
                  {tag.value}
                  <span className="asset-detail-tag__unit">{tag.unit}</span>
                </div>
                <div className="asset-detail-tag__name">{tag.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trend chart */}
        <section className="card" aria-labelledby="trend-chart-heading">
          <h2 id="trend-chart-heading" className="asset-detail-section-title">
            <Activity size={16} aria-hidden="true" />
            Trend — <span className="font-mono" style={{ color: series.color }}>{firstTagKey}</span>
            &nbsp;({series.label})
          </h2>
          <div aria-hidden="true">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={series.data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="grad-detail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={series.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={series.color} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#6E7681', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} interval={7} axisLine={{ stroke: '#30363D' }} tickLine={false} />
                <YAxis tick={{ fill: '#6E7681', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="value" stroke={series.color} strokeWidth={2} fill="url(#grad-detail)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Digital Twin link */}
        <section className="card asset-detail-twin-card" aria-labelledby="twin-link-heading">
          <GitBranch size={24} className="asset-detail-twin-card__icon" aria-hidden="true" />
          <div>
            <h2 id="twin-link-heading" className="asset-detail-section-title" style={{ marginBottom: 4 }}>
              Digital Twin
            </h2>
            <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              View the synchronized virtual model for this asset with live tag simulation.
            </p>
          </div>
          <Link to="/twin" className="asset-detail-twin-btn" aria-label={`Open Digital Twin for ${asset.name}`}>
            Open Twin →
          </Link>
        </section>
      </div>
    </div>
  )
}