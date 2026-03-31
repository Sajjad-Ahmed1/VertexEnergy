import React from 'react'
import { Link } from 'react-router-dom'
import { ASSETS } from '../../data/mockData'
import './AssetStatusTable.css'

const STATUS_LABEL = {
  nominal:  'Nominal',
  warning:  'Warning',
  critical: 'Critical',
  offline:  'Offline',
}

export default function AssetStatusTable() {
  return (
    <section className="asset-table card" aria-labelledby="asset-table-heading">
      <h2 id="asset-table-heading" className="asset-table__title">
        Asset Status Overview
      </h2>

      <table className="asset-table__table" aria-label="Asset status overview">
        <thead>
          <tr>
            <th scope="col">Asset ID</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Location</th>
            <th scope="col">Status</th>
            <th scope="col" className="align-right">Uptime</th>
          </tr>
        </thead>
        <tbody>
          {ASSETS.map(asset => (
            <tr key={asset.id} className={`asset-row asset-row--${asset.status}`}>
              <td>
                <Link
                  to={`/assets/${asset.id}`}
                  className="asset-table__link font-mono"
                  aria-label={`View details for ${asset.name}`}
                >
                  {asset.id}
                </Link>
              </td>
              <td className="asset-table__name">{asset.name}</td>
              <td>
                <span className="asset-table__type-badge">{asset.type}</span>
              </td>
              <td className="asset-table__location">{asset.location}</td>
              <td>
                <span className={`asset-table__status-badge asset-table__status-badge--${asset.status === 'nominal' ? 'nominal' : asset.status === 'warning' ? 'warning' : 'critical'}`}>
                  <span
                    className={`live-dot ${asset.status === 'critical' ? 'live-dot--critical' : asset.status === 'warning' ? 'live-dot--warning' : ''}`}
                    aria-hidden="true"
                  />
                  {STATUS_LABEL[asset.status]}
                </span>
              </td>
              <td className="align-right font-mono asset-table__uptime">
                {asset.uptime}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
