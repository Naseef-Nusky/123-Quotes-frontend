import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function ProDashboard() {
  const { user, refreshMe } = useAuth()
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshMe()
    let alive = true
    ;(async () => {
      try {
        const data = await api.myLeads()
        if (alive) setLeads(data.leads || [])
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [refreshMe])

  const available = leads.filter((l) => l.lead?.contactLocked).length
  const unlocked = leads.filter((l) => !l.lead?.contactLocked).length
  const balance = user?.professional?.tokenBalance ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-5">
          <p className="text-sm font-semibold text-muted">Token balance</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy">{balance}</p>
          <Link to="/pro/tokens" className="mt-3 inline-block text-sm font-bold text-primary">
            Buy tokens →
          </Link>
        </div>
        <div className="surface p-5">
          <p className="text-sm font-semibold text-muted">Available leads</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy">{available}</p>
          <Link to="/pro/leads" className="mt-3 inline-block text-sm font-bold text-primary">
            View leads →
          </Link>
        </div>
        <div className="surface p-5">
          <p className="text-sm font-semibold text-muted">Unlocked</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy">{unlocked}</p>
          <Link to="/pro/profile" className="mt-3 inline-block text-sm font-bold text-primary">
            Edit profile →
          </Link>
        </div>
      </div>

      {loading ? <p className="text-muted">Loading dashboard…</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      <div className="surface p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-navy">Recent leads</h2>
          <Link to="/pro/leads" className="text-sm font-bold text-primary">
            See all
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {leads.slice(0, 5).map((item) => (
            <li key={item.matchId} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-semibold text-navy">{item.lead?.service?.name}</p>
                <p className="text-sm text-muted">
                  {item.lead?.postcode}
                  {item.lead?.city ? ` · ${item.lead.city}` : ''} · {item.lead?.tokenCost} tokens
                </p>
              </div>
              <span className="text-xs font-bold text-primary">
                {item.lead?.contactLocked ? 'Locked' : 'Unlocked'}
              </span>
            </li>
          ))}
        </ul>
        {!loading && !leads.length ? (
          <p className="mt-2 text-sm text-muted">No matched leads yet. Keep your services and areas up to date.</p>
        ) : null}
      </div>
    </div>
  )
}
