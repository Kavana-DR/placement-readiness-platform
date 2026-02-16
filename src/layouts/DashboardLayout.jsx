import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, Code, Video, BarChart2, User } from 'lucide-react'

export default function DashboardLayout(){
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink to={to} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </NavLink>
  )

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4">
        <div className="mb-6 font-semibold">Placement Prep</div>
        <nav className="space-y-2">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/dashboard/practice" icon={Code} label="Practice" />
          <NavItem to="/dashboard/assessments" icon={BarChart2} label="Assessments" />
          <NavItem to="/dashboard/resources" icon={Video} label="Resources" />
          <NavItem to="/dashboard/profile" icon={User} label="Profile" />
        </nav>
      </aside>

      <div className="flex-1 bg-gray-50">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div className="text-lg font-semibold">Placement Prep</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300" aria-hidden></div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
