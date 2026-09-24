import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, LogIn, LayoutGrid, Mail, MapPin } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const publicLinks = [{ to: '/', label: 'Home', end: true }]

const customerLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/app', label: 'Dashborad', end: true },
  { to: '/app/requests', label: 'My Requests', end: true },
  { to: '/app/requested-services', label: 'My Requested Services' },
]

const businessLinks = [
  { to: '/pro', label: 'Home', end: true },
  { to: '/pro/available-pros', label: 'Available Pros.' },
  { to: '/pro/request-sent', label: 'Request Sent' },
  { to: '/pro/my-request', label: 'My Request' },
  { to: '/pro/leads', label: 'Leads' },
  { to: '/pro/client-requests', label: 'Client Requests' },
  { to: '/pro/settings', label: 'Settings' },
]

export default function Layout({ variant = 'public', children }) {
  const { isAuthenticated, logout, isCustomer, isProfessional } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const isBusiness = variant === 'business'
  const isCustomerPortal = variant === 'customer'

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-slate hover:text-navy'
    }`

  const navItems = isBusiness ? businessLinks : isCustomerPortal ? customerLinks : publicLinks
  const logoTo = isBusiness ? '/pro' : isCustomerPortal ? '/app' : '/'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo size="lg" to={logoTo} />

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
            {navItems.map((l) => (
              <NavLink key={`${l.to}-${l.label}`} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}

            {isBusiness || isCustomerPortal ? (
              <button
                type="button"
                onClick={handleLogout}
                className={`${linkClass({ isActive: false })} inline-flex items-center gap-1.5`}
              >
                Logout
              </button>
            ) : isAuthenticated ? (
              <>
                {isProfessional ? (
                  <Link to="/pro" className={`${linkClass({ isActive: false })} inline-flex items-center gap-1.5`}>
                    <LayoutGrid className="size-4" strokeWidth={2} />
                    Portal
                  </Link>
                ) : null}
                {isCustomer ? (
                  <Link to="/app" className={linkClass({ isActive: false })}>
                    Dashborad
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${linkClass({ isActive: false })} inline-flex items-center gap-1.5`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${linkClass({ isActive: false })} inline-flex items-center gap-1.5`}>
                  <LogIn className="size-4" strokeWidth={2} />
                  Login
                </Link>
                <Link
                  to="/business/signup"
                  className="rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Business Signup
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-line p-2 text-navy lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((l) => (
                <NavLink
                  key={`${l.to}-${l.label}`}
                  to={l.to}
                  end={l.end}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              <hr className="border-line" />
              {isBusiness || isCustomerPortal ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 text-left text-sm font-medium text-slate"
                >
                  Logout
                </button>
              ) : isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 text-left text-sm font-medium text-slate"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate"
                  >
                    <LogIn className="size-4" strokeWidth={2} />
                    Login
                  </Link>
                  <Link
                    to="/business/signup"
                    onClick={() => setOpen(false)}
                    className="inline-block rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Business Signup
                  </Link>
                </>
              )}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children ?? <Outlet />}</main>

      <footer className="mt-auto bg-[#0a2f5c] text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/90">
            <Mail className="size-3.5 shrink-0 text-primary" strokeWidth={2} />
            <a href="mailto:info@123quotes.co.uk" className="hover:text-primary">
              info@123quotes.co.uk
            </a>
            <span className="opacity-50">|</span>
            <MapPin className="size-3.5 shrink-0 text-primary" strokeWidth={2} />
            <span>1st Floor, 239 Kensington High St, London W8 6SN</span>
          </p>
          <p className="mt-4 text-sm text-white/80">
            <Link to="/terms" className="hover:text-primary">
              Terms of Use
            </Link>
            <span className="mx-2 opacity-60">||</span>
            <Link to="/privacy" className="hover:text-primary">
              Terms and conditions
            </Link>
          </p>
          <div className="mx-auto my-5 h-px max-w-xl bg-white/15" />
          <p className="text-xs text-white/55">© {new Date().getFullYear()}, All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}
