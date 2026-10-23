import { useEffect, useState } from 'react'
import { Globe, MapPin, Plus, X } from 'lucide-react'
import { api } from '../api/client'
import PostcodeInput from './PostcodeInput'

function isNationwideArea(a) {
  const pc = String(a.postcode || '').trim().toUpperCase()
  return pc === 'NATIONWIDE' || pc === 'UK' || String(a.label || '').toLowerCase() === 'nationwide'
}

function normalizeAreasForApi(list) {
  return list.map((a) =>
    isNationwideArea(a)
      ? { postcode: 'NATIONWIDE', city: null, radiusMiles: null, label: 'Nationwide' }
      : {
          postcode: String(a.postcode || '').trim().toUpperCase() || null,
          city: a.city || null,
          radiusMiles: a.radiusMiles ? Number(a.radiusMiles) : null,
          label: a.label || null,
        },
  )
}

function mapAreasFromProfile(serviceAreas) {
  return (serviceAreas || [])
    .filter((a) => String(a.postcode || '').trim() || String(a.city || '').trim())
    .map((a) => ({
      postcode: a.postcode || '',
      city: a.city || '',
      radiusMiles: a.radiusMiles || null,
      label: a.label || '',
    }))
}

/**
 * Services + service areas editor (used in business Settings).
 * Postcode areas persist immediately (and rematch leads); Save also syncs services.
 */
export default function ServicesAreasForm() {
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [areas, setAreas] = useState([])
  const [areaMode, setAreaMode] = useState('postcode')
  const [newPostcode, setNewPostcode] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newRadius, setNewRadius] = useState(15)
  const [areaError, setAreaError] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingAreas, setSavingAreas] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [prof, svc] = await Promise.all([api.getMyProfile(), api.getServices()])
        if (!alive) return
        setServices(svc.services || [])
        setSelectedServices(
          (prof.profile.services || []).map((s) => s.serviceId || s.service?.id),
        )
        setAreas(mapAreasFromProfile(prof.profile.serviceAreas))
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const hasNationwide = areas.some(isNationwideArea)

  async function persistAreas(nextAreas, successNote) {
    setSavingAreas(true)
    setAreaError('')
    setError('')
    setMessage('')
    try {
      const res = await api.setMyAreas(normalizeAreasForApi(nextAreas))
      const saved = mapAreasFromProfile(res.serviceAreas)
      setAreas(saved)
      const matched = res?.rematch?.matched
      setMessage(
        matched != null
          ? `${successNote} — ${matched} matching lead${matched === 1 ? '' : 's'}`
          : successNote,
      )
      return saved
    } catch (err) {
      setAreaError(err.message || 'Failed to update service areas')
      throw err
    } finally {
      setSavingAreas(false)
    }
  }

  async function addPostcodeArea() {
    const pc = String(newPostcode || '').trim().toUpperCase()
    if (!pc) {
      setAreaError('Search and choose a postcode area first')
      return
    }
    if (hasNationwide) {
      setAreaError('Remove Nationwide first before adding postcode areas')
      return
    }
    if (areas.some((a) => String(a.postcode || '').trim().toUpperCase() === pc)) {
      setAreaError('That postcode area is already added')
      return
    }

    const next = [
      ...areas,
      {
        postcode: pc,
        city: newCity || '',
        radiusMiles: Number(newRadius) || null,
        label: '',
      },
    ]
    setNewPostcode('')
    setNewCity('')
    try {
      await persistAreas(next, `Added ${pc}${newCity ? ` · ${newCity}` : ''}`)
    } catch {
      // keep previous areas; error shown
    }
  }

  async function addNationwide() {
    if (hasNationwide) return
    // Nationwide replaces local postcode list for matching
    try {
      await persistAreas(
        [{ postcode: 'NATIONWIDE', city: '', radiusMiles: null, label: 'Nationwide' }],
        'Nationwide coverage saved',
      )
    } catch {
      // keep previous
    }
  }

  async function removeArea(index) {
    const next = areas.filter((_, i) => i !== index)
    try {
      await persistAreas(next, next.length ? 'Service area removed' : 'All service areas cleared')
    } catch {
      // keep previous
    }
  }

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      // Rematch once via areas save (skip on services to avoid double work)
      await api.setMyServices(selectedServices, { skipRematch: true })
      const areasRes = await api.setMyAreas(normalizeAreasForApi(areas))
      setAreas(mapAreasFromProfile(areasRes.serviceAreas))
      const matched = areasRes?.rematch?.matched
      setMessage(
        matched != null
          ? `Services & areas saved — ${matched} matching lead${matched === 1 ? '' : 's'}`
          : 'Services & areas saved',
      )
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="surface grid place-items-center p-10">
        <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const busy = saving || savingAreas

  return (
    <form onSubmit={onSave} className="min-w-0 space-y-5 lg:space-y-6">
      <div className="surface min-w-0 space-y-3 p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-navy">Services</h2>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Services you provide ({selectedServices.length})
          </p>
          {selectedServices.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {services
                .filter((s) => selectedServices.includes(s.id))
                .map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {s.name}
                  </span>
                ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate">
              No services selected yet. Tick your services below so customers can be matched
              with you.
            </p>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          All services — tick to add or remove
        </p>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {services.map((s) => {
            const checked = selectedServices.includes(s.id)
            return (
              <label
                key={s.id}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                  checked ? 'bg-primary/5 font-semibold text-navy' : 'text-slate hover:bg-canvas'
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={checked}
                  onChange={() =>
                    setSelectedServices(
                      checked
                        ? selectedServices.filter((id) => id !== s.id)
                        : [...selectedServices, s.id],
                    )
                  }
                />
                {s.name}
              </label>
            )
          })}
        </div>
      </div>

      <div className="surface min-w-0 space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-display text-xl font-bold text-navy">Service areas</h2>
          <p className="mt-1 text-sm text-muted">
            Add or remove postcode areas anytime — leads update automatically. Use radius to
            cover nearby outcodes.
          </p>
        </div>

        {areas.length ? (
          <ul className="space-y-2">
            {areas.map((a, i) => {
              const nationwide = isNationwideArea(a)
              return (
                <li
                  key={`${a.postcode}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-canvas/60 px-3.5 py-2.5"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      nationwide
                        ? 'bg-primary/15 text-primary'
                        : 'bg-white text-primary ring-1 ring-line'
                    }`}
                  >
                    {nationwide ? (
                      <Globe className="size-4.5" strokeWidth={2} />
                    ) : (
                      <MapPin className="size-4.5" strokeWidth={2} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-navy">
                      {nationwide
                        ? 'Nationwide (whole UK)'
                        : [a.postcode, a.city].filter(Boolean).join(' · ')}
                    </span>
                    <span className="block text-xs text-muted">
                      {nationwide
                        ? 'You receive matching leads from everywhere'
                        : a.radiusMiles
                          ? `Within ${a.radiusMiles} miles`
                          : 'Exact outcode match'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeArea(i)}
                    disabled={busy}
                    aria-label="Remove area"
                    className="shrink-0 rounded-lg p-1.5 text-slate transition hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                  >
                    <X className="size-4" strokeWidth={2} />
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-xl bg-warning/10 px-3.5 py-3 text-sm text-slate">
            No service areas yet — add at least one below so we can match you with the right
            leads.
          </p>
        )}

        <div className="border-t border-line pt-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-canvas p-1">
            {[
              { key: 'postcode', label: 'Postcode area' },
              { key: 'nationwide', label: 'Nationwide' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setAreaMode(t.key)
                  setAreaError('')
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  areaMode === t.key
                    ? 'bg-white text-navy shadow-sm ring-1 ring-line'
                    : 'text-slate hover:text-navy'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {areaMode === 'postcode' ? (
            <div className="mt-3 space-y-3">
              <div>
                <label className="label">Postcode area</label>
                <PostcodeInput
                  value={newPostcode}
                  onChange={(v) => {
                    setNewPostcode(v)
                    if (!v) setNewCity('')
                  }}
                  onSelect={(row) => setNewCity(row?.town || '')}
                  placeholder="Search postcode or town…"
                  disabled={busy || hasNationwide}
                />
                {newCity ? <p className="mt-1 text-xs text-muted">Area: {newCity}</p> : null}
              </div>
              <div>
                <label className="label">Travel radius</label>
                <select
                  className="input-field"
                  value={newRadius}
                  disabled={busy || hasNationwide}
                  onChange={(e) => setNewRadius(Number(e.target.value))}
                >
                  {[5, 10, 15, 25, 50, 100].map((m) => (
                    <option key={m} value={m}>
                      Within {m} miles
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={addPostcodeArea}
                disabled={busy || hasNationwide || !String(newPostcode || '').trim()}
                className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-sm disabled:opacity-50"
              >
                <Plus className="size-4" strokeWidth={2.2} />
                {savingAreas ? 'Saving…' : 'Add postcode area'}
              </button>
              {hasNationwide ? (
                <p className="text-xs text-muted">
                  You already cover Nationwide — remove it first to add specific postcodes.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate">
                Cover the whole UK — you&apos;ll be matched with leads from every postcode
                area. This replaces any postcode areas you already added.
              </p>
              <button
                type="button"
                onClick={addNationwide}
                disabled={busy || hasNationwide}
                className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-sm disabled:opacity-50"
              >
                <Globe className="size-4" strokeWidth={2.2} />
                {hasNationwide ? 'Nationwide added' : savingAreas ? 'Saving…' : 'Add Nationwide'}
              </button>
            </div>
          )}

          {areaError ? <p className="text-sm text-danger">{areaError}</p> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={busy}>
          {saving ? 'Saving…' : 'Save services & areas'}
        </button>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? <p className="text-sm text-success">{message}</p> : null}
      </div>
    </form>
  )
}
