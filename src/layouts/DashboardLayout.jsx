import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, Code, Video, BarChart2, User, Zap, Clock, Briefcase } from 'lucide-react'
import ThemeToggleButton from '../components/ThemeToggleButton'

function NavItem({ to, icon, label }) {
  const IconComponent = icon
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `kpb-nav-item ${isActive ? 'kpb-nav-item-active' : ''}`.trim()}
    >
      <IconComponent size={18} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function DashboardLayout() {
  return (
    <div className="kpb-shell">
      <aside className="kpb-sidebar">
        <div className="kpb-brand">Placement Prep</div>
        <nav className="kpb-nav">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/analyze" icon={Zap} label="Analyze JD" />
          <NavItem to="/history" icon={Clock} label="History" />
          <NavItem to="/applications" icon={Briefcase} label="Applications" />
          <div className="kpb-nav-divider" />
          <NavItem to="/dashboard/practice" icon={Code} label="Practice" />
          <NavItem to="/dashboard/assessments" icon={BarChart2} label="Assessments" />
          <NavItem to="/dashboard/resources" icon={Video} label="Resources" />
          <NavItem to="/dashboard/profile" icon={User} label="Profile" />
        </nav>
      </aside>

      <div className="kpb-shell-main">
        <header className="kpb-topbar">
          <div className="kpb-card-title">Placement Prep</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggleButton />
            <div className="kpb-avatar" aria-hidden>
              PP
            </div>
          </div>
        </header>

        <main className="kpb-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
