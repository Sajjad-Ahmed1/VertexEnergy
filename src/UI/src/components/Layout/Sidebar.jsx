import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  Bell,
  GitBranch,
  Activity,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard',     end: true },
  { to: '/assets',    icon: Boxes,           label: 'Assets'                   },
  { to: '/alarms',    icon: Bell,            label: 'Alarms',        badge: 'critical' },
  { to: '/twin',      icon: GitBranch,       label: 'Digital Twin'             },
  { to: '/telemetry', icon: Activity,        label: 'Telemetry'                },
]

export default function Sidebar({ collapsed, onToggle, criticalCount }) {
  return (
    <aside
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="sidebar__logo" aria-label="Vertex Energy">
        <Zap size={22} className="sidebar__logo-icon" aria-hidden="true" />
        {!collapsed && (
          <span className="sidebar__logo-text">
            Vertex<strong>Energy</strong>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar__nav" aria-label="Primary navigation">
        <ul role="list">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                aria-label={collapsed ? label : undefined}
                title={collapsed ? label : undefined}
              >
                <span className="sidebar__link-icon" aria-hidden="true">
                  <Icon size={18} />
                  {badge === 'critical' && criticalCount > 0 && (
                    <span className="sidebar__badge" aria-label={`${criticalCount} critical alarms`}>
                      {criticalCount}
                    </span>
                  )}
                </span>
                {!collapsed && <span className="sidebar__link-label">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="sidebar__bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
          aria-label={collapsed ? 'Settings' : undefined}
          title={collapsed ? 'Settings' : undefined}
        >
          <span className="sidebar__link-icon" aria-hidden="true">
            <Settings size={18} />
          </span>
          {!collapsed && <span className="sidebar__link-label">Settings</span>}
        </NavLink>

        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed
            ? <ChevronRight size={16} aria-hidden="true" />
            : <ChevronLeft  size={16} aria-hidden="true" />
          }
        </button>
      </div>
    </aside>
  )
}
