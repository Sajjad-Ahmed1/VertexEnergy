import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { KPI_SUMMARY } from '../../data/mockData'
import './AppLayout.css'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        criticalCount={KPI_SUMMARY.criticalAlarms}
      />

      <div className="app-layout__main">
        <TopBar
          criticalCount={KPI_SUMMARY.criticalAlarms}
          warningCount={KPI_SUMMARY.warningAlarms}
        />
        <main id="main-content" className="app-layout__content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
