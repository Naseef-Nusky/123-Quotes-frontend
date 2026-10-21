import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, BriefcaseBusiness, FileText, Star, Info } from 'lucide-react'
import { api } from '../api/client'

function timeAgo(date) {
  if (!date) return ''
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function iconFor(type) {
  if (type === 'NEW_LEAD' || type === 'LEAD_UNLOCKED') return BriefcaseBusiness
  if (type === 'QUOTATION_REQUEST') return FileText
  if (type === 'NEW_REVIEW') return Star
  return Info
}

/**
 * Working notification bell for the portal header.
 * Shows unread badge, dropdown list, mark-read on click,
 * deep-links via notification.meta.link, refreshes every minute.
 */
export default function NotificationBell() {
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const load = useCallback(async () => {
    try {
      const d = await api.getNotifications()
      setItems(d.notifications || [])
      setUnread(d.unreadCount || 0)
    } catch {
      /* keep last known state */
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [load])

  // Refresh counts when moving between tabs.
  useEffect(() => {
    load()
  }, [location.pathname, load])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open ])

  async function markAll() {
    try {
      await api.markAllNotificationsRead()
      setItems((list) => list.map((n) => ({ ...n, isRead: true })))
      setUnread(0)
    } catch {
      /* ignore */
    }
  }

  async function openItem(n) {
    setOpen(false)
    if (!n.isRead) {
      try {
        await api.markNotificationRead(n.id)
        setItems((list) => list.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)))
        setUnread((c) => Math.max(0, c - 1))
      } catch {
        /* ignore */
      }
    }
    const link = n.meta?.link
    if (typeof link === 'string' && link.startsWith('/')) navigate(link)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={() => {
          setOpen((v) => !v)
          load()
        }}
        className="relative inline-flex items-center justify-center rounded-xl border border-line bg-white p-2 text-navy transition hover:border-primary/40"
      >
        <Bell className="size-5" strokeWidth={2} />
        {unread > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-rose-600 px-1 py-px text-[10px] font-bold leading-4 text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold text-navy">Notifications</p>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAll}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {!items.length ? (
              <p className="px-4 py-8 text-center text-sm text-muted">No notifications yet.</p>
            ) : (
              <ul className="divide-y divide-line/70">
                {items.map((n) => {
                  const Icon = iconFor(n.type)
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => openItem(n)}
                        className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-canvas ${
                          n.isRead ? '' : 'bg-primary/5'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                            n.isRead ? 'bg-slate-100 text-slate' : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-navy">{n.title}</span>
                            {!n.isRead ? (
                              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                            ) : null}
                          </span>
                          {n.body ? (
                            <span className="mt-0.5 line-clamp-2 block text-xs text-slate">
                              {n.body}
                            </span>
                          ) : null}
                          <span className="mt-1 block text-[11px] text-muted">
                            {timeAgo(n.createdAt)}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
