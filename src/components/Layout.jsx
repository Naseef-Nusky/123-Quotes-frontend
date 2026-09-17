import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/professionals', label: 'Professionals' },
]

export default function Layout({ variant = 'public', children }) {
  const { user, isAuthenticated, logout, isCustomer, isProfessional } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const dashLink = isProfessional ? '/pro' : isCustomer ? '/app' : null

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-primary' : 'text-slate hover:text-navy'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo size="md" />

          {variant === 'public' ? (
            <>
              <nav className="hidden items-center gap-7 lg:flex">
                {publicLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                    {l.label}
                  </NavLink>
                ))}
                {isAuthenticated ? (
                  <>
                    {dashLink ? (
                      <Link to={dashLink} className="text-sm font-semibold text-slate hover:text-navy">
                        Dashboard
                      </Link>
                    ) : null}
                    <button type="button" onClick={handleLogout} className="text-sm font-semibold text-slate hover:text-navy">
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-semibold text-slate hover:text-navy">
                      Login
                    </Link>
                    <Link
                      to="/register?role=professional"
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
                    >
                      Business Signup
                    </Link>
                  </>
                )}
              </nav>
              <button
                type="button"
                className="inline-flex rounded-lg border border-line p-2 lg:hidden"
                aria-label="Toggle menu"
                onClick={() => setOpen((v) => !v)}
              >
                <span className="block h-0.5 w-5 bg-navy text-navy shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">{user?.email}</span>
              <Link to="/" className="text-sm font-semibold text-primary">
                Site
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary !py-2 !text-sm">
                Log out
              </button>
            </div>
          )}
        </div>

        {variant === 'public' && open ? (
          <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {publicLinks.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              <hr className="border-line" />
              {isAuthenticated ? (
                <>
                  {dashLink ? (
                    <Link to={dashLink} onClick={() => setOpen(false)} className="font-semibold text-primary">
                      Dashboard
                    </Link>
                  ) : null}
                  <button type="button" onClick={handleLogout} className="text-left font-semibold text-slate">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="font-semibold text-slate">
                    Login
                  </Link>
                  <Link
                    to="/register?role=professional"
                    onClick={() => setOpen(false)}
                    className="inline-block bg-primary px-4 py-2 text-center text-sm font-bold text-white"
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

      {variant === 'public' ? (
        <footer className="mt-auto bg-navy text-white">
          <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
            <p className="text-sm text-white/90">
              Email:{' '}
              <a href="mailto:info@123quotes.co.uk" className="hover:text-primary">
                info@123quotes.co.uk
              </a>{' '}
              | 1st Floor, 239 Kensington High St, London W8 6SN
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
            <p className="mt-5 text-xs text-white/55">© {new Date().getFullYear()}, All Rights Reserved</p>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
