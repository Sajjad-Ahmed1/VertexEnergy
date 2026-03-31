import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ASSETS } from '../data/mockData'
import { Boxes, Search, Filter } from 'lucide-react'
import './Assets.css'

const STATUS_ORDER = { critical: 0, warning: 1, nominal: 2, offline: 3 }

export default function Assets() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const visible = ASSETS
    .filter(a => {
      const q = search.toLowerCase()
      return (
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      )
    })
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

  return (
    <div className="assets-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Assets</h1>
          <p className="page-subtitle">{ASSETS.length} monitored assets across all units</p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="assets-toolbar" role="search" aria-label="Filter assets">
        <div className="assets-toolbar__search">
          <Search size={16} aria-hidden="true" className="assets-toolbar__search-icon" />
          <input
            type="search"
            className="assets-toolbar__input"
            placeholder="Search by ID, name, location, type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search assets"
          />
        </div>

        <div
          className="assets-toolbar__filters"
          role="group"
          aria-label="Filter by status"
        >
          <Filter size={14} aria-hidden="true" className="text-muted" />
          {['all', 'critical', 'warning', 'nominal'].map(s => (
            <button
              key={s}
              className={`assets-toolbar__filter-btn ${filterStatus === s ? 'active' : ''} ${s !== 'all' ? `assets-toolbar__filter-btn--${s}` : ''}`}
              onClick={() => setFilterStatus(s)}
              aria-pressed={filterStatus === s}
              aria-label={`Show ${s === 'all' ? 'all assets' : s + ' assets'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Cards */}
      <div className="assets-grid" aria-label="Asset list">
        {visible.length === 0 && (
          <p className="assets-empty text-secondary" role="status">
            No assets match your filters.
          </p>
        )}
        {visible.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
}

function AssetCard({ asset }) {
  return (
    <article
      className={`asset-card asset-card--${asset.status}`}
      aria-label={`${asset.name} — ${asset.status}`}
    >
      <div className="asset-card__header">
        <div>
          <span className="asset-card__id font-mono">{asset.id}</span>
          <h2 className="asset-card__name">{asset.name}</h2>
        </div>
        <span className={`badge badge--${asset.status === 'nominal' ? 'nominal' : asset.status === 'warning' ? 'warning' : 'critical'}`}>
          <span
            className={`live-dot ${asset.status === 'critical' ? 'live-dot--critical' : asset.status === 'warning' ? 'live-dot--warning' : ''}`}
            aria-hidden="true"
          />
          {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
        </span>
      </div>

      <div className="asset-card__meta">
        <span className="badge badge--info">{asset.type}</span>
        <span className="asset-card__location text-secondary">{asset.location}</span>
      </div>

      <div className="asset-card__tags" aria-label="Tag readings">
        {asset.tags.map(tag => (
          <div
            key={tag.id}
            className={`asset-tag asset-tag--${tag.status}`}
            aria-label={`${tag.name}: ${tag.value} ${tag.unit}`}
          >
            <span className="asset-tag__id font-mono">{tag.id}</span>
            <span className="asset-tag__name">{tag.name}</span>
            <span className="asset-tag__value font-mono">
              {tag.value} <span className="asset-tag__unit">{tag.unit}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="asset-card__footer">
        <span className="asset-card__uptime">
          Uptime: <strong className="font-mono">{asset.uptime}%</strong>
        </span>
        <Link
          to={`/assets/${asset.id}`}
          className="asset-card__detail-link"
          aria-label={`View digital twin for ${asset.name}`}
        >
          View Twin →
        </Link>
      </div>
    </article>
  )
}
