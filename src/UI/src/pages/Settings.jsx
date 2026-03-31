import React, { useState } from 'react'
import { Settings as SettingsIcon, Bell, Shield, Database, Monitor, Save } from 'lucide-react'
import './Settings.css'

const SECTIONS = [
  { id: 'display',    label: 'Display',        icon: Monitor  },
  { id: 'alarms',     label: 'Alarm Config',   icon: Bell     },
  { id: 'security',   label: 'Security & RBAC',icon: Shield   },
  { id: 'data',       label: 'Data & Historian',icon: Database },
]

export default function Settings() {
  const [active, setActive] = useState('display')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="settings-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Platform configuration — changes are audited and logged</p>
        </div>
        <button
          className={`settings-save-btn ${saved ? 'settings-save-btn--saved' : ''}`}
          onClick={handleSave}
          aria-label="Save settings"
        >
          <Save size={14} aria-hidden="true" />
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </header>

      <div className="settings-layout">
        {/* Settings nav */}
        <nav className="settings-nav" aria-label="Settings sections">
          <ul role="list">
            {SECTIONS.map(s => (
              <li key={s.id}>
                <button
                  className={`settings-nav__btn ${active === s.id ? 'settings-nav__btn--active' : ''}`}
                  onClick={() => setActive(s.id)}
                  aria-current={active === s.id ? 'page' : undefined}
                >
                  <s.icon size={16} aria-hidden="true" />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings panel */}
        <div className="settings-content card">
          {active === 'display' && <DisplaySettings />}
          {active === 'alarms'  && <AlarmSettings />}
          {active === 'security'&& <SecuritySettings />}
          {active === 'data'    && <DataSettings />}
        </div>
      </div>
    </div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="setting-row">
      <div className="setting-row__label-group">
        <label className="setting-row__label">{label}</label>
        {description && <p className="setting-row__desc">{description}</p>}
      </div>
      <div className="setting-row__control">{children}</div>
    </div>
  )
}

function Toggle({ defaultChecked = false, ariaLabel }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={`toggle ${on ? 'toggle--on' : ''}`}
      onClick={() => setOn(v => !v)}
    >
      <span className="toggle__thumb" aria-hidden="true" />
    </button>
  )
}

function DisplaySettings() {
  return (
    <div className="settings-section">
      <h2 className="settings-section__title">Display &amp; Theme</h2>
      <SettingRow label="Theme" description="Industrial Dark is optimized for control room environments">
        <select className="settings-select" aria-label="Theme selection">
          <option value="dark">Industrial Dark</option>
          <option value="light" disabled>Light (not recommended for control rooms)</option>
        </select>
      </SettingRow>
      <SettingRow label="Data Refresh Rate" description="How often live telemetry data is polled from the historian">
        <select className="settings-select" aria-label="Data refresh rate">
          <option value="1">1 second</option>
          <option value="2" selected>2 seconds</option>
          <option value="5">5 seconds</option>
          <option value="10">10 seconds</option>
        </select>
      </SettingRow>
      <SettingRow label="Monospace Values" description="Display all numeric tag values in monospace font">
        <Toggle defaultChecked={true} ariaLabel="Toggle monospace values" />
      </SettingRow>
      <SettingRow label="Trend Sparklines" description="Show mini trend charts inline in asset tables">
        <Toggle defaultChecked={false} ariaLabel="Toggle trend sparklines" />
      </SettingRow>
      <SettingRow label="Dense Data Mode" description="Reduce row padding for higher data density in tables">
        <Toggle defaultChecked={false} ariaLabel="Toggle dense data mode" />
      </SettingRow>
    </div>
  )
}

function AlarmSettings() {
  return (
    <div className="settings-section">
      <h2 className="settings-section__title">Alarm Configuration</h2>
      <SettingRow label="Audio Alerts — Critical" description="Play audible tone for unacknowledged critical alarms">
        <Toggle defaultChecked={true} ariaLabel="Toggle critical audio alerts" />
      </SettingRow>
      <SettingRow label="Audio Alerts — Warning" description="Play audible tone for warning alarms">
        <Toggle defaultChecked={false} ariaLabel="Toggle warning audio alerts" />
      </SettingRow>
      <SettingRow label="Auto-Acknowledge Timeout" description="Auto-acknowledge resolved alarms after this period">
        <select className="settings-select" aria-label="Auto-acknowledge timeout">
          <option value="never">Never (manual only)</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>
      </SettingRow>
      <SettingRow label="Critical Alarm Flash" description="Flash the screen border on new critical alarms">
        <Toggle defaultChecked={true} ariaLabel="Toggle critical alarm flash" />
      </SettingRow>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="settings-section">
      <h2 className="settings-section__title">Security &amp; Access Control</h2>
      <div className="settings-info-banner" role="note">
        <Shield size={16} aria-hidden="true" />
        All operator actions are logged with timestamps and user identity per audit requirements.
      </div>
      <SettingRow label="Session Timeout" description="Automatically lock session after inactivity">
        <select className="settings-select" aria-label="Session timeout">
          <option value="15">15 minutes</option>
          <option value="30" selected>30 minutes</option>
          <option value="60">1 hour</option>
        </select>
      </SettingRow>
      <SettingRow label="Two-Factor Authentication" description="Require MFA for all operator logins">
        <Toggle defaultChecked={true} ariaLabel="Toggle two-factor authentication" />
      </SettingRow>
      <SettingRow label="Read-Only Mode" description="Prevent all write operations from this session">
        <Toggle defaultChecked={false} ariaLabel="Toggle read-only mode" />
      </SettingRow>
    </div>
  )
}

function DataSettings() {
  return (
    <div className="settings-section">
      <h2 className="settings-section__title">Data &amp; Historian</h2>
      <SettingRow label="Historian Endpoint" description="Time-series database connection">
        <input
          type="text"
          className="settings-input font-mono"
          defaultValue="historian.vertex-energy.internal:8086"
          aria-label="Historian endpoint URL"
          readOnly
        />
      </SettingRow>
      <SettingRow label="OPC-UA Server" description="SCADA gateway connection string">
        <input
          type="text"
          className="settings-input font-mono"
          defaultValue="opc.tcp://scada-gw.vertex-energy.internal:4840"
          aria-label="OPC-UA server address"
          readOnly
        />
      </SettingRow>
      <SettingRow label="Data Retention" description="How long raw tag data is retained in the historian">
        <select className="settings-select" aria-label="Data retention period">
          <option value="30">30 days</option>
          <option value="90" selected>90 days</option>
          <option value="365">1 year</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </SettingRow>
    </div>
  )
}