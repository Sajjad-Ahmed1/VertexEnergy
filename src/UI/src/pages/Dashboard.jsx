import React from 'react'
import KPICard from '../components/Dashboard/KPICard'
import AlarmPanel from '../components/Dashboard/AlarmPanel'
import TelemetryChart from '../components/Dashboard/TelemetryChart'
import AssetStatusTable from '../components/Dashboard/AssetStatusTable'
import { KPI_SUMMARY } from '../data/mockData'
import {
  Boxes,
  Wifi,
  AlertTriangle,
  XCircle,
  TrendingUp,
  GitBranch,
} from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Control Center</h1>
          <p className="page-subtitle">Real-time operations overview — Vertex Energy Platform</p>
        </div>
      </header>

      {/* KPI row — operational criticality order */}
      <section
        className="kpi-grid"
        aria-label="Key performance indicators"
      >
        <KPICard
          label="Critical Alarms"
          value={KPI_SUMMARY.criticalAlarms}
          icon={XCircle}
          severity={KPI_SUMMARY.criticalAlarms > 0 ? 'critical' : 'nominal'}
          description="Unacknowledged — immediate action required"
        />
        <KPICard
          label="Active Warnings"
          value={KPI_SUMMARY.warningAlarms}
          icon={AlertTriangle}
          severity={KPI_SUMMARY.warningAlarms > 0 ? 'warning' : 'nominal'}
          description="Unacknowledged — attention needed"
        />
        <KPICard
          label="Assets Online"
          value={`${KPI_SUMMARY.assetsOnline}/${KPI_SUMMARY.totalAssets}`}
          icon={Boxes}
          severity="info"
          description="Active monitored assets"
        />
        <KPICard
          label="Avg. Uptime"
          value={KPI_SUMMARY.avgUptime}
          unit="%"
          icon={TrendingUp}
          severity="nominal"
          trend={0.2}
          description="Fleet average — last 30 days"
        />
        <KPICard
          label="Digital Twins"
          value={KPI_SUMMARY.activeDigitalTwins}
          icon={GitBranch}
          severity="info"
          description="Active synchronized twins"
        />
        <KPICard
          label="Field Connectivity"
          value="OPC-UA"
          icon={Wifi}
          severity="nominal"
          description="SCADA link — nominal"
        />
      </section>

      {/* Main content grid */}
      <div className="dashboard__grid">
        {/* Left column */}
        <div className="dashboard__col-main">
          <TelemetryChart />
          <AssetStatusTable />
        </div>

        {/* Right column */}
        <div className="dashboard__col-side">
          <AlarmPanel />
        </div>
      </div>
    </div>
  )
}
