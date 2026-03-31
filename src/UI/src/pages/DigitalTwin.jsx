import React, { useState, useEffect } from 'react'
import { ASSETS } from '../data/mockData'
import { GitBranch, Cpu, Activity, Zap, RefreshCw, CheckCircle } from 'lucide-react'
import './DigitalTwin.css'

// Simulated live tag values with drift
function useLiveTags(asset) {
  const [tags, setTags] = useState(asset?.tags ?? [])

  useEffect(() => {
    if (!asset) return
    setTags(asset.tags)
    const id = setInterval(() => {
      setTags(prev => prev.map(tag => ({
        ...tag,
        value: +(tag.value + (Math.random() - 0.5) * tag.value * 0.02).toFixed(2),
      })))
    }, 2000)
    return () => clearInterval(id)
  }, [asset?.id])

  return tags
}

const TWIN_ASSETS = ASSETS.slice(0, 4) // first 4 have active twins

export default function DigitalTwin() {
  const [selected, setSelected] = useState(TWIN_ASSETS[0])
  const liveTags = useLiveTags(selected)
  const [syncPulse, setSyncPulse] = useState(false)

  // Flash sync indicator every 2s
  useEffect(() => {
    const id = setInterval(() => {
      setSyncPulse(true)
      setTimeout(() => setSyncPulse(false), 400)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="twin-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Digital Twin</h1>
          <p className="page-subtitle">Real-time virtual model — synchronized with live SCADA data</p>
        </div>
        <div className={`twin-sync-indicator ${syncPulse ? 'twin-sync-indicator--pulse' : ''}`} aria-live="polite" aria-label="SCADA synchronization status">
          <span className="live-dot" aria-hidden="true" />
          SCADA Sync Active
        </div>
      </header>

      <div className="twin-layout">
        {/* Asset selector */}
        <aside className="twin-sidebar" aria-label="Select asset for digital twin">
          <h2 className="twin-sidebar__title">Active Twins</h2>
          <ul role="list" className="twin-asset-list">
            {TWIN_ASSETS.map(asset => (
              <li key={asset.id}>
                <button
                  className={`twin-asset-btn ${selected?.id === asset.id ? 'twin-asset-btn--active' : ''} twin-asset-btn--${asset.status}`}
                  onClick={() => setSelected(asset)}
                  aria-pressed={selected?.id === asset.id}
                  aria-label={`Select ${asset.name} digital twin`}
                >
                  <Cpu size={16} aria-hidden="true" />
                  <div className="twin-asset-btn__info">
                    <span className="twin-asset-btn__id font-mono">{asset.id}</span>
                    <span className="twin-asset-btn__name">{asset.name}</span>
                  </div>
                  <span
                    className={`live-dot ${asset.status === 'critical' ? 'live-dot--critical' : asset.status === 'warning' ? 'live-dot--warning' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Twin viewer */}
        {selected && (
          <main className="twin-viewer" aria-label={`Digital twin for ${selected.name}`}>
            {/* Header */}
            <div className="twin-viewer__header card">
              <div className="twin-viewer__header-left">
                <GitBranch size={20} aria-hidden="true" className="twin-viewer__icon" />
                <div>
                  <h2 className="twin-viewer__name">{selected.name}</h2>
                  <p className="twin-viewer__meta">
                    <span className="font-mono text-telemetry">{selected.id}</span>
                    <span className="text-secondary">·</span>
                    <span className="text-secondary">{selected.type}</span>
                    <span className="text-secondary">·</span>
                    <span className="text-secondary">{selected.location}</span>
                  </p>
                </div>
              </div>
              <span className={`badge badge--${selected.status === 'nominal' ? 'nominal' : selected.status === 'warning' ? 'warning' : 'critical'}`}>
                {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
              </span>
            </div>

            {/* Live tag readings */}
            <section aria-labelledby="twin-tags-heading">
              <h3 id="twin-tags-heading" className="twin-section-title">
                <Activity size={16} aria-hidden="true" />
                Live Tag Readings
                <span className={`twin-live-badge ${syncPulse ? 'twin-live-badge--flash' : ''}`} aria-hidden="true">
                  LIVE
                </span>
              </h3>
              <div className="twin-tags-grid">
                {liveTags.map(tag => (
                  <div
                    key={tag.id}
                    className={`twin-tag-card twin-tag-card--${tag.status}`}
                    aria-label={`${tag.name}: ${tag.value} ${tag.unit}, status ${tag.status}`}
                  >
                    <div className="twin-tag-card__header">
                      <span className="twin-tag-card__id font-mono">{tag.id}</span>
                      <span className={`live-dot ${tag.status === 'critical' ? 'live-dot--critical' : tag.status === 'warning' ? 'live-dot--warning' : ''}`} aria-hidden="true" />
                    </div>
                    <div className="twin-tag-card__value font-mono">
                      {tag.value}
                      <span className="twin-tag-card__unit">{tag.unit}</span>
                    </div>
                    <div className="twin-tag-card__name">{tag.name}</div>
                    <div className={`twin-tag-card__status-bar twin-tag-card__status-bar--${tag.status}`} aria-hidden="true" />
                  </div>
                ))}
              </div>
            </section>

            {/* Twin metadata */}
            <section className="twin-meta-grid" aria-labelledby="twin-meta-heading">
              <h3 id="twin-meta-heading" className="twin-section-title">
                <Zap size={16} aria-hidden="true" />
                Twin Metadata
              </h3>
              <div className="twin-meta-cards">
                <MetaCard label="Model Fidelity"    value="High-Fidelity" icon={CheckCircle} />
                <MetaCard label="Sync Latency"      value="< 250ms"       icon={RefreshCw}   />
                <MetaCard label="Uptime (30d)"      value={`${selected.uptime}%`} icon={Activity} />
                <MetaCard label="Data Protocol"     value="OPC-UA"        icon={Zap}         />
                <MetaCard label="Last Sync"         value="Just now"      icon={RefreshCw}   />
                <MetaCard label="Twin Engine"       value="v2.4.1"        icon={Cpu}         />
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

function MetaCard({ label, value, icon: Icon }) {
  return (
    <div className="twin-meta-card card">
      <Icon size={16} className="twin-meta-card__icon" aria-hidden="true" />
      <span className="twin-meta-card__label">{label}</span>
      <span className="twin-meta-card__value font-mono">{value}</span>
    </div>
  )
}