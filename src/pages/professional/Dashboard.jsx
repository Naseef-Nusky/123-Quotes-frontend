import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DUMMY_LEADS } from '../../data/dummy'
import { api } from '../../api/client'

export default function ProDashboard() {
  const [count, setCount] = useState(DUMMY_LEADS.length)

  useEffect(() => {
    api
      .myLeads()
      .then((d) => setCount((d.leads || []).length || DUMMY_LEADS.length))
      .catch(() => setCount(DUMMY_LEADS.length))
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Find The Best Opportunities For Your Business.</h1>
        <p className="mt-3 text-lg text-slate">View Local Opportunities To You !</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Link to="/pro/leads" className="surface p-6 transition hover:border-primary/40 hover:shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Leads</p>
          <p className="mt-2 text-3xl font-bold text-navy">{count}</p>
          <p className="mt-1 text-sm text-muted">Available opportunities nearby</p>
        </Link>
        <Link to="/pro/available-pros" className="surface p-6 transition hover:border-primary/40 hover:shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Available Pros.</p>
          <p className="mt-2 text-3xl font-bold text-navy">Browse</p>
          <p className="mt-1 text-sm text-muted">See professionals in the directory</p>
        </Link>
        <Link to="/pro/settings" className="surface p-6 transition hover:border-primary/40 hover:shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
          <p className="mt-2 text-3xl font-bold text-navy">Account</p>
          <p className="mt-1 text-sm text-muted">Profile, tokens & payments</p>
        </Link>
      </div>
    </section>
  )
}
