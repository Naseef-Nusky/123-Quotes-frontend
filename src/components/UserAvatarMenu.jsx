import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Settings2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function initials(name = '', email = '') {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  if (parts.length === 1 && parts[0].length) return parts[0].slice(0, 2).toUpperCase()
  return String(email || 'U').slice(0, 2).toUpperCase()
}

function displayName(user) {
  if (!user) return 'Account'
  const customerName = [user.customer?.firstName, user.customer?.lastName].filter(Boolean).join(' ')
  return (
    user.professional?.companyName ||
    user.professional?.contactName ||
    customerName ||
    user.name ||
    user.email?.split('@')[0] ||
    'Account'
  )
}

/**
 * Header avatar + name. Logout lives only inside the dropdown.
 */
export default function UserAvatarMenu({ settingsTo }) {
  const { user, logout, isProfessional, isCustomer } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const name = displayName(user)
  const email = user?.email || ''
  const settingsPath = settingsTo || (isProfessional ? '/pro/settings' : isCustomer ? '/app' : '/')

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-[220px] items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-2.5 transition hover:border-primary/40 hover:shadow-sm"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] text-xs font-bold text-white">
          {initials(name, email)}
        </span>
        <span className="min-w-0 truncate text-left text-sm font-semibold text-navy">{name}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate transition ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-navy/10 animate-fade-up"
        >
          <div className="border-b border-line bg-canvas/70 px-4 py-3">
            <p className="truncate text-sm font-bold text-navy">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <div className="p-1.5">
            {settingsPath ? (
              <Link
                to={settingsPath}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate transition hover:bg-canvas hover:text-navy"
              >
                <Settings2 className="size-4 text-primary" strokeWidth={2} />
                Settings
              </Link>
            ) : null}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-danger/5"
            >
              <LogOut className="size-4" strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
