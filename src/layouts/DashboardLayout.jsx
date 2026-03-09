import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, Code, Video, BarChart2, User, Zap, Clock, Briefcase } from 'lucide-react'

// eslint-disable-next-line no-unused-vars
function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </NavLink>
  )
}

export default function DashboardLayout(){

  return (
    <div className="min-h-screen flex">
      <aside className="w-80 bg-white border-r p-6 overflow-y-auto">
        <div className="mb-8 font-semibold text-lg">Placement Prep</div>
        <nav className="space-y-3">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/analyze" icon={Zap} label="Analyze JD" />
          <NavItem to="/history" icon={Clock} label="History" />
          <NavItem to="/applications" icon={Briefcase} label="Applications" />
          <div className="border-t my-4" />
          <NavItem to="/dashboard/practice" icon={Code} label="Practice" />
          <NavItem to="/dashboard/assessments" icon={BarChart2} label="Assessments" />
          <NavItem to="/dashboard/resources" icon={Video} label="Resources" />
          <NavItem to="/dashboard/profile" icon={User} label="Profile" />
        </nav>
      </aside>

      <div className="flex-1 bg-gray-50 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
          <div className="text-xl font-semibold">Placement Prep</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300" aria-hidden></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
