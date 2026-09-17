import { NavLink, Outlet } from 'react-router-dom'
import Layout from './Layout'

export function CustomerShell() {
  const links = [
    { to: '/app', end: true, label: 'My requests' },
    { to: '/app/requests/new', label: 'New request' },
  ]
  return (
    <Layout variant="portal">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Customer portal</p>
            <h1 className="font-display text-3xl font-bold text-navy">Your quotes</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive ? 'bg-primary text-white' : 'bg-white text-slate border border-line hover:border-blue-200'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}

export function ProfessionalShell() {
  const links = [
    { to: '/pro', end: true, label: 'Dashboard' },
    { to: '/pro/leads', label: 'Leads' },
    { to: '/pro/tokens', label: 'Buy tokens' },
    { to: '/pro/history', label: 'Token history' },
    { to: '/pro/profile', label: 'Profile' },
  ]
  return (
    <Layout variant="portal">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Professional portal</p>
            <h1 className="font-display text-3xl font-bold text-navy">Grow with leads</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive ? 'bg-primary text-white' : 'bg-white text-slate border border-line hover:border-blue-200'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}
