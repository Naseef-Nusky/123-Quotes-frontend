import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Plus, X } from 'lucide-react'
import { api } from '../api/client'

let cachedPostcodes = null
let loadPromise = null

function loadPostcodes() {
  if (cachedPostcodes) return Promise.resolve(cachedPostcodes)
  if (!loadPromise) {
    loadPromise = api
      .listPostcodes()
      .then((d) => {
        cachedPostcodes = d.results || []
        return cachedPostcodes
      })
      .catch((err) => {
        loadPromise = null
        throw err
      })
  }
  return loadPromise
}

function optionLabel(row) {
  return [row.outcode, row.town].filter(Boolean).join(' — ')
}

function normalizePostcode(raw) {
  return String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
}

/**
 * Searchable postcode dropdown — pick from list or add a manual value.
 * Menu is portaled so hero/modals with overflow:hidden cannot clip it.
 */
export default function PostcodeInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search postcode…',
  className = '',
  id,
  disabled,
  allowCustom = true,
}) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState(cachedPostcodes || [])
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [menuPos, setMenuPos] = useState(null)
  const wrapRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const selected = useMemo(
    () => options.find((o) => o.outcode === String(value || '').toUpperCase()) || null,
    [options, value],
  )

  const inputValue = open ? query : selected ? optionLabel(selected) : value || ''

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q) return options.slice(0, 80)
    return options
      .filter(
        (o) =>
          o.outcode.includes(q) ||
          (o.town && o.town.toUpperCase().includes(q)) ||
          (o.region && o.region.toUpperCase().includes(q)),
      )
      .slice(0, 80)
  }, [options, query])

  const typed = normalizePostcode(query)
  const hasExactOutcode = options.some((o) => o.outcode === typed)
  const showCustom = allowCustom && typed.length >= 2 && !hasExactOutcode
  const listLength = filtered.length + (showCustom ? 1 : 0)

  function updateMenuPos() {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 4
    const maxH = 240
    const spaceBelow = window.innerHeight - r.bottom - gap
    const openUp = spaceBelow < 160 && r.top > spaceBelow
    setMenuPos({
      left: r.left,
      width: Math.max(r.width, 200),
      top: openUp ? undefined : r.bottom + gap,
      bottom: openUp ? window.innerHeight - r.top + gap : undefined,
      maxHeight: Math.min(maxH, openUp ? r.top - gap - 8 : spaceBelow - 8),
    })
  }

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current?.contains(e.target)) return
      if (listRef.current?.contains(e.target)) return
      setOpen(false)
      setQuery('')
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (options.length) return
    setLoading(true)
    loadPostcodes()
      .then((list) => setOptions(list))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false))
  }, [options.length])

  useEffect(() => {
    setHighlight(0)
  }, [query, open])

  useEffect(() => {
    if (!open) {
      setMenuPos(null)
      return
    }
    updateMenuPos()
    const onReposition = () => updateMenuPos()
    window.addEventListener('resize', onReposition)
    // capture scroll from any ancestor (hero, modals, page)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  function pick(row) {
    onChange(row.outcode)
    onSelect?.(row)
    setQuery('')
    setOpen(false)
  }

  function pickCustom(raw) {
    const v = normalizePostcode(raw)
    if (!v) return
    onChange(v)
    onSelect?.({ outcode: v, town: null, region: null, custom: true })
    setQuery('')
    setOpen(false)
  }

  function clear(e) {
    e.stopPropagation()
    onChange('')
    onSelect?.(null)
    setQuery('')
    setOpen(true)
    inputRef.current?.focus()
  }

  function onKeyDown(e) {
    if (disabled) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlight((h) => Math.min(h + 1, Math.max(listLength - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      if (!open) {
        setOpen(true)
        return
      }
      if (showCustom && highlight === 0) {
        pickCustom(typed)
        return
      }
      const idx = showCustom ? highlight - 1 : highlight
      if (filtered[idx]) pick(filtered[idx])
      else if (showCustom) pickCustom(typed)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  // Always keep the flex shell layout — callers may pass plain input classes
  // (e.g. `input-field`) which would otherwise stack the chevron below the input.
  const shellClass = `${
    className ||
    'w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
  } flex items-center gap-2`

  const menu =
    open && menuPos
      ? createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            style={{
              position: 'fixed',
              top: menuPos.top,
              bottom: menuPos.bottom,
              left: menuPos.left,
              width: menuPos.width,
              maxHeight: menuPos.maxHeight,
              zIndex: 9999,
            }}
            className="overflow-auto rounded-xl border border-[#d6e4f0] bg-white py-1 shadow-xl"
          >
            {loading ? (
              <li className="grid place-items-center px-3 py-3">
                <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </li>
            ) : null}
            {!loading && showCustom ? (
              <li role="option" aria-selected={highlight === 0}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
                    highlight === 0 ? 'bg-primary/10' : 'hover:bg-[#eef7fc]'
                  }`}
                  onMouseEnter={() => setHighlight(0)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickCustom(typed)}
                >
                  <Plus className="size-4 shrink-0 text-primary" strokeWidth={2} />
                  <span className="text-slate">
                    Use <span className="font-bold text-navy">{typed}</span>
                    <span className="ml-1 text-muted">(add manually)</span>
                  </span>
                </button>
              </li>
            ) : null}
            {!loading && !filtered.length && !showCustom ? (
              <li className="px-3 py-3 text-sm text-muted">
                {query ? 'No matches — try another search' : 'Start typing a postcode or town'}
              </li>
            ) : null}
            {filtered.map((r, i) => {
              const optionIndex = showCustom ? i + 1 : i
              const active = value === r.outcode
              const focused = optionIndex === highlight
              return (
                <li key={r.outcode} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
                      focused || active ? 'bg-primary/10' : 'hover:bg-[#eef7fc]'
                    }`}
                    onMouseEnter={() => setHighlight(optionIndex)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(r)}
                  >
                    <span className="font-bold text-navy">{r.outcode}</span>
                    <span className="truncate text-slate">
                      {[r.town, r.region].filter(Boolean).join(', ')}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )
      : null

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`${shellClass} ${disabled ? 'opacity-60' : 'cursor-text'}`}
        onClick={() => {
          if (disabled) return
          setOpen(true)
          if (!open) {
            setQuery('')
            setTimeout(() => inputRef.current?.focus(), 0)
          } else {
            inputRef.current?.focus()
          }
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const next = e.target.value.toUpperCase()
            setQuery(next)
            setOpen(true)
            if (value) onChange('')
          }}
          onFocus={() => {
            if (disabled) return
            setOpen(true)
            if (selected) setQuery('')
            else if (value) setQuery(String(value).toUpperCase())
          }}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 border-0 bg-transparent uppercase outline-none placeholder:normal-case placeholder:text-slate-400"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={clear}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        ) : null}
        <ChevronDown
          className={`size-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </div>
      {menu}
    </div>
  )
}
