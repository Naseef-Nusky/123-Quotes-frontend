import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X, LogIn, LayoutGrid, Mail, MapPin } from 'lucide-react'
import Logo from './Logo'
import UserAvatarMenu from './UserAvatarMenu'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/categories', label: 'Categories' },
]

const customerLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/categories', label: 'Categories' },
  { to: '/app', label: 'Dashborad', end: true },
  { to: '/app/requests', label: 'My Requests', end: true },
  { to: '/app/requested-services', label: 'My Requested Services' },
]

export default function Layout({ variant = 'public', children }) {
  const { isAuthenticated, isCustomer, isProfessional } = useAuth()
  const [open, setOpen] = useState(false)
  const isCustomerPortal = variant === 'customer'

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-slate hover:text-navy'
    }`

  const navItems = isCustomerPortal ? customerLinks : publicLinks
  const logoTo = isCustomerPortal ? '/app' : '/'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <div className="min-w-0 shrink">
            <Logo size="lg" to={logoTo} />
          </div>

          <div className="hidden items-center gap-5 lg:flex xl:gap-6">
            <nav className="flex items-center gap-5 xl:gap-6">
              {navItems.map((l) => (
                <NavLink key={`${l.to}-${l.label}`} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {isCustomerPortal || isAuthenticated ? (
              <div className="flex items-center gap-3">
                {!isCustomerPortal && isProfessional ? (
                  <Link to="/pro" className={`${linkClass({ isActive: false })} inline-flex items-center gap-1.5`}>
                    <LayoutGrid className="size-4" strokeWidth={2} />
                    Portal
                  </Link>
                ) : null}
                {!isCustomerPortal && isCustomer ? (
                  <Link to="/app" className={linkClass({ isActive: false })}>
                    Dashborad
                  </Link>
                ) : null}
                <UserAvatarMenu settingsTo={isProfessional ? '/pro/settings' : '/app'} />
              </div>
            ) : (
              <>
                <Link to="/login" className={`${linkClass({ isActive: false })} inline-flex items-center gap-1.5`}>
                  <LogIn className="size-4" strokeWidth={2} />
                  Login
                </Link>
                <Link
                  to="/business/login"
                  className="rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Business Login
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {isCustomerPortal || isAuthenticated ? (
              <UserAvatarMenu settingsTo={isProfessional ? '/pro/settings' : '/app'} />
            ) : null}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-line p-2 text-navy"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
            </button>
          </div>
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
              {!isCustomerPortal && !isAuthenticated ? (
                <>
                  <hr className="border-line" />
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate"
                  >
                    <LogIn className="size-4" strokeWidth={2} />
                    Login
                  </Link>
                  <Link
                    to="/business/login"
                    onClick={() => setOpen(false)}
                    className="inline-block rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Business Login
                  </Link>
                </>
              ) : null}
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
