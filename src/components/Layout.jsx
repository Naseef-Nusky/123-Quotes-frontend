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
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

const customerLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/categories', label: 'Categories' },
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/requests', label: 'My Requests', end: true },
]

const customerFooterLinks = [
  { to: '/services', label: 'Browse services' },
  { to: '/categories', label: 'Browse categories' },
  { to: '/services', label: 'Get free quotes' },
  { to: '/professionals', label: 'Find professionals' },
  { to: '/how-it-works', label: 'How it works' },
]

const proFooterLinks = [
  { to: '/business/signup', label: 'Join as a professional' },
  { to: '/business/login', label: 'Business login' },
  { to: '/pricing', label: 'Token pricing' },
  { to: '/how-it-works', label: 'How it works for pros' },
]

const companyFooterLinks = [
  { to: '/contact', label: 'Contact us' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/login', label: 'Customer login' },
]

export default function Layout({ variant = 'public', children }) {
  const { isAuthenticated, isCustomer, isProfessional } = useAuth()
  const [open, setOpen] = useState(false)
  const isCustomerPortal = variant === 'customer'

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-panel font-semibold text-primary-dark' : 'text-slate hover:bg-canvas hover:text-navy'
    }`

  const navItems = isCustomerPortal ? customerLinks : publicLinks
  const logoTo = isCustomerPortal ? '/app' : '/'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white shadow-[0_6px_24px_-18px_rgba(10,47,92,0.4)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <div className="min-w-0 shrink">
            <Logo size="lg" to={logoTo} />
          </div>

          <div className="hidden items-center gap-4 lg:flex xl:gap-5">
            <nav className="flex items-center gap-1 xl:gap-1.5">
              {navItems.map((l) => (
                <NavLink key={`${l.to}-${l.label}`} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {isCustomerPortal || isAuthenticated ? (
              <div className="flex items-center gap-3">
                {!isCustomerPortal && isProfessional ? (
                  <Link
                    to="/pro"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-slate transition-colors hover:text-navy"
                  >
                    <LayoutGrid className="size-4" strokeWidth={2} />
                    Portal
                  </Link>
                ) : null}
                {!isCustomerPortal && isCustomer ? (
                  <Link
                    to="/app"
                    className="whitespace-nowrap text-sm font-medium text-slate transition-colors hover:text-navy"
                  >
                    Dashboard
                  </Link>
                ) : null}
                <UserAvatarMenu settingsTo={isProfessional ? '/pro/settings' : '/app'} />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap px-2 text-sm font-medium text-slate transition-colors hover:text-navy"
                >
                  <LogIn className="size-4" strokeWidth={2} />
                  Login
                </Link>
                <Link
                  to="/business/login"
                  className="whitespace-nowrap rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:border-primary hover:bg-panel"
                >
                  Business Login
                </Link>
              </div>
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
            <nav className="flex flex-col gap-1.5">
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
                  <hr className="my-2 border-line" />
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate"
                  >
                    <LogIn className="size-4" strokeWidth={2} />
                    Login
                  </Link>
                  <Link
                    to="/business/login"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-primary/40 px-4 py-2 text-center text-sm font-semibold text-primary-dark"
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

      <footer className="bg-navy-gradient mt-auto text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <span className="inline-flex rounded-2xl bg-white px-3 py-1.5">
                <Logo size="md" to={logoTo} />
              </span>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                The contemporary way to find the professional service you need. Compare free quotes
                from verified local professionals, and hire with confidence.
              </p>
              <div className="mt-5 space-y-2 text-sm text-white/80">
                <a
                  href="mailto:info@123quotes.co.uk"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-[#8fd0f5]" strokeWidth={2} />
                  info@123quotes.co.uk
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#8fd0f5]" strokeWidth={2} />
                  1st Floor, 239 Kensington High St, London W8 6SN
                </p>
              </div>
            </div>

            <nav aria-label="For customers">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">For Customers</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {customerFooterLinks.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="For professionals">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">For Professionals</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {proFooterLinks.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Company</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {companyFooterLinks.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row">
            <p>© {new Date().getFullYear()} 123 Quotes. All rights reserved.</p>
            <p>Free quotes from verified UK professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
