import { useEffect, useMemo, useState } from 'react'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'
import { X } from 'lucide-react'
import { api } from '../api/client'
import { formatMoney } from '../utils/questionnaire'

const SANDBOX_SCRIPT = 'https://sandbox.web.squarecdn.com/v1/square.js'
const PRODUCTION_SCRIPT = 'https://web.squarecdn.com/v1/square.js'

function loadSquareScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing && window.Square) {
      resolve(window.Square)
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve(window.Square)
    script.onerror = () => reject(new Error('Failed to load Square Web Payments SDK'))
    document.head.appendChild(script)
  })
}

/**
 * Square checkout modal for token packages.
 * - Live mode: card form → tokenize → POST purchase with sourceId
 * - Mock mode (PAYMENTS_ENABLED=false): one-click mock purchase
 */
export default function SquareCheckoutModal({ open, pkg, onClose, onSuccess }) {
  const [config, setConfig] = useState(null)
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setError('')
    setSdkReady(false)
    setLoadingConfig(true)

    api
      .getPaymentConfig()
      .then(async (d) => {
        if (cancelled) return
        const square = d.square || null
        setConfig(square)

        const live =
          square?.paymentsEnabled && square?.applicationId && square?.locationId
        if (!live) {
          setSdkReady(true)
          return
        }

        const scriptSrc =
          square.environment === 'sandbox' ? SANDBOX_SCRIPT : PRODUCTION_SCRIPT
        try {
          const Square = await loadSquareScript(scriptSrc)
          if (cancelled) return
          // Fail fast with a clear message if App ID / environment don't match
          await Square.payments(square.applicationId, square.locationId)
          if (!cancelled) setSdkReady(true)
        } catch (err) {
          if (cancelled) return
          const msg = String(err?.message || err || 'Square checkout failed to start')
          if (msg.toLowerCase().includes('environment')) {
            setError(
              'Square Application ID does not match sandbox. In Square Developer → 123quotes → Credentials, copy the Sandbox Application ID (usually starts with sandbox-sq0idb-) into SQUARE_APPLICATION_ID in the backend .env, then restart the API.',
            )
          } else {
            setError(msg)
          }
          setSdkReady(true)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load payment config')
          setSdkReady(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingConfig(false)
      })

    return () => {
      cancelled = true
    }
  }, [open])

  const amountLabel = useMemo(() => {
    if (!pkg) return ''
    return formatMoney(pkg.priceCents, pkg.currency || 'GBP')
  }, [pkg])

  const amountForVerify = useMemo(() => {
    if (!pkg) return '0.00'
    return (Number(pkg.priceCents || 0) / 100).toFixed(2)
  }, [pkg])

  if (!open || !pkg) return null

  const liveReady =
    config?.paymentsEnabled && config?.applicationId && config?.locationId && !error
  const showCardForm = liveReady && sdkReady && !loadingConfig

  async function completePurchase(sourceId) {
    setPaying(true)
    setError('')
    try {
      const data = await api.buyTokens(pkg.id, sourceId || undefined)
      onSuccess?.(data)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="square-checkout-title"
      onClick={() => !paying && onClose?.()}
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white px-6 pb-6 pt-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded text-muted transition hover:bg-canvas hover:text-navy disabled:opacity-50"
          aria-label="Close"
          disabled={paying}
          onClick={() => onClose?.()}
        >
          <X className="size-5" strokeWidth={2} />
        </button>

        <h2 id="square-checkout-title" className="pr-8 text-xl font-bold text-navy">
          Pay with Square
        </h2>
        <p className="mt-1 text-sm text-slate">
          {pkg.name} · {pkg.tokens} points · {amountLabel}
        </p>

        {loadingConfig || !sdkReady ? (
          <p className="mt-4 text-sm text-muted">Loading checkout…</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        {!loadingConfig && sdkReady && config && !config.paymentsEnabled ? (
          <div className="mt-5 space-y-4">
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Square live checkout is off (`PAYMENTS_ENABLED=false` or missing keys). This will
              complete a <strong>mock test purchase</strong> in the CRM only.
            </p>
            <button
              type="button"
              className="btn-primary w-full"
              disabled={paying}
              onClick={() => completePurchase(null)}
            >
              {paying ? 'Processing…' : `Mock pay ${amountLabel}`}
            </button>
          </div>
        ) : null}

        {showCardForm ? (
          <div className="mt-5">
            <p className="mb-3 text-xs text-muted">
              Sandbox test card: 4111 1111 1111 1111 · any future expiry · any CVV · any postal
              code
            </p>
            {paying ? (
              <p className="mb-2 text-sm font-semibold text-primary">Processing payment…</p>
            ) : null}
            <PaymentForm
              applicationId={config.applicationId}
              locationId={config.locationId}
              overrides={
                config.environment === 'sandbox'
                  ? { scriptSrc: SANDBOX_SCRIPT }
                  : { scriptSrc: PRODUCTION_SCRIPT }
              }
              cardTokenizeResponseReceived={async (tokenResult) => {
                if (tokenResult.status !== 'OK' || !tokenResult.token) {
                  const detail =
                    tokenResult.errors?.[0]?.message ||
                    tokenResult.status ||
                    'Card tokenization failed'
                  setError(detail)
                  return
                }
                await completePurchase(tokenResult.token)
              }}
              createVerificationDetails={() => ({
                amount: amountForVerify,
                currencyCode: pkg.currency || 'GBP',
                intent: 'CHARGE',
                billingContact: {
                  givenName: 'Test',
                  familyName: 'Buyer',
                  countryCode: 'GB',
                },
              })}
            >
              <CreditCard
                buttonProps={{
                  isLoading: paying,
                  css: {
                    backgroundColor: '#1e8fd5',
                    fontSize: '15px',
                    color: '#ffffff',
                  },
                }}
              />
            </PaymentForm>
          </div>
        ) : null}
      </div>
    </div>
  )
}
