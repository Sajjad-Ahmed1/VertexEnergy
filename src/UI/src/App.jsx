import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import AssetDetail from './pages/AssetDetail'
import Alarms from './pages/Alarms'
import DigitalTwin from './pages/DigitalTwin'
import Telemetry from './pages/Telemetry'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:assetId" element={<AssetDetail />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="twin" element={<DigitalTwin />} />
          <Route path="telemetry" element={<Telemetry />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}