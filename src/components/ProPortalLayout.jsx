import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Home,
  Inbox,
  LogOut,
  Menu,
  Send,
  Settings2,
  X,
} from 'lucide-react'
import Logo from './Logo'
import UserAvatarMenu from './UserAvatarMenu'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/pro', label: 'Home', icon: Home, end: true },
  { to: '/pro/available-pros', label: 'Available Pros', icon: Building2 },
  { to: '/pro/request-sent', label: 'Request Sent', icon: Send },
  { to: '/pro/my-request', label: 'My Request', icon: ClipboardList },
  { to: '/pro/leads', label: 'Leads', icon: BriefcaseBusiness },
  { to: '/pro/client-requests', label: 'Client Requests', icon: Inbox },
  { to: '/pro/settings', label: 'Settings', icon: Settings2 },
]

function pageTitle(pathname) {
  if (pathname.startsWith('/pro/available-pros/')) return 'Professional profile'
  if (pathname.startsWith('/pro/tokens')) return 'Buy tokens'
  if (pathname.startsWith('/pro/history')) return 'Token history'
  if (pathname.startsWith('/pro/profile')) return 'Profile'
  const ordered = [...NAV].sort((a, b) => b.to.length - a.to.length)
  const hit = ordered.find((n) => (n.end ? pathname === n.to : pathname === n.to || pathname.startsWith(`${n.to}/`)))
  return hit?.label || 'Portal'
}

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-white text-navy shadow-sm shadow-navy/5'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition ${
                  isActive ? 'bg-primary/15 text-primary' : 'bg-white/10 text-white/80 group-hover:bg-white/15'
                }`}
              >
                <Icon className="size-4" strokeWidth={2} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarLogout({ onDone }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    onDone?.()
    logout()
    navigate('/')
  }

  return (
    <div className="mt-auto border-t border-white/10 px-3 py-4">
      <button
        type="button"
        onClick={handleLogout}
        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/80 transition group-hover:bg-rose-500/20 group-hover:text-rose-200">
          <LogOut className="size-4" strokeWidth={2} />
        </span>
        Logout
      </button>
    </div>
  )
}

export default function ProPortalLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col bg-gradient-to-b from-[#0a3a7a] via-[#0a2f5c] to-[#071f3d] lg:flex">
        <div className="w-full border-b border-white/10 bg-white px-4 py-4">
          <Logo fullWidth to="/" />
        </div>
        <NavItems />
        <SidebarLogout />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-gradient-to-b from-[#0a3a7a] via-[#0a2f5c] to-[#071f3d] shadow-2xl animate-fade-up">
            <div className="flex w-full items-center gap-2 border-b border-white/10 bg-white px-3 py-3">
              <div className="min-w-0 flex-1">
                <Logo fullWidth to="/" />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="shrink-0 rounded-lg p-2 text-navy hover:bg-canvas"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>
            <NavItems onNavigate={() => setMobileOpen(false)} />
            <SidebarLogout onDone={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-line bg-white p-2 text-navy transition hover:border-primary/40 lg:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-5" strokeWidth={2} />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Business
                </p>
                <h1 className="truncate text-base font-bold text-navy sm:text-lg">
                  {pageTitle(location.pathname)}
                </h1>
              </div>
            </div>
            <UserAvatarMenu settingsTo="/pro/settings" />
          </div>
        </header>

        <main className="flex-1 animate-fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
