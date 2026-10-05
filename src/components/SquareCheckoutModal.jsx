import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApplePay, CreditCard, GooglePay, PaymentForm } from 'react-square-web-payments-sdk'
import { X } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'
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

function splitContactName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { givenName: 'Customer', familyName: '' }
  if (parts.length === 1) return { givenName: parts[0], familyName: '' }
  return { givenName: parts[0], familyName: parts.slice(1).join(' ') }
}

/**
 * Square checkout modal for token packages.
 * - Live: Apple Pay / Google Pay / card → tokenize → POST purchase with sourceId
 * - Mock (PAYMENTS_ENABLED=false): one-click mock purchase
 *
 * Card/wallet PAN never touches our servers — Square tokenizes in-browser (PCI SAQ-A).
 */
export default function SquareCheckoutModal({ open, pkg, onClose, onSuccess }) {
  const { user } = useAuth()
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
          await Square.payments(square.applicationId, square.locationId)
          if (!cancelled) setSdkReady(true)
        } catch (err) {
          if (cancelled) return
          const msg = String(err?.message || err || 'Square checkout failed to start')
          if (msg.toLowerCase().includes('environment')) {
            setError(
              'Square Application ID does not match sandbox. In Square Developer → Credentials, copy the Sandbox Application ID into SQUARE_APPLICATION_ID, then restart the API.',
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

  const currencyCode = pkg?.currency || 'GBP'

  const createPaymentRequest = useCallback(
    () => ({
      countryCode: 'GB',
      currencyCode,
      total: {
        amount: amountForVerify,
        label: pkg?.name || '123 Quotes tokens',
      },
    }),
    [amountForVerify, currencyCode, pkg?.name],
  )

  const createVerificationDetails = useCallback(() => {
    const { givenName, familyName } = splitContactName(
      user?.professional?.contactName || user?.email?.split('@')[0] || 'Customer',
    )
    return {
      amount: amountForVerify,
      currencyCode,
      intent: 'CHARGE',
      billingContact: {
        givenName,
        familyName: familyName || givenName,
        email: user?.email || undefined,
        countryCode: 'GB',
      },
    }
  }, [amountForVerify, currencyCode, user?.email, user?.professional?.contactName])

  if (!open || !pkg) return null

  const liveReady =
    config?.paymentsEnabled && config?.applicationId && config?.locationId && !error
  const showPaymentMethods = liveReady && sdkReady && !loadingConfig

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

  async function onTokenize(tokenResult) {
    if (tokenResult.status !== 'OK' || !tokenResult.token) {
      const detail =
        tokenResult.errors?.[0]?.message || tokenResult.status || 'Payment tokenization failed'
      setError(detail)
      return
    }
    await completePurchase(tokenResult.token)
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
          Secure checkout
        </h2>
        <p className="mt-1 text-sm text-slate">
          {pkg.name} · {pkg.tokens} tokens · {amountLabel}
        </p>
        <p className="mt-1 text-xs text-muted">
          Card and wallet details are processed by Square — never stored on 123 Quotes.
        </p>

        {loadingConfig || !sdkReady ? <Loading className="mt-4 py-6" /> : null}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        {!loadingConfig && sdkReady && config && !config.paymentsEnabled ? (
          <div className="mt-5 space-y-4">
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Square live checkout is off (`PAYMENTS_ENABLED=false` or missing keys). This will
              complete a <strong>mock test purchase</strong> only.
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

        {showPaymentMethods ? (
          <div className="mt-5 space-y-4">
            {config.environment === 'sandbox' ? (
              <p className="text-xs text-muted">
                Sandbox card: 4111 1111 1111 1111 · any future expiry · any CVV · any postal
                code. Google Pay works in Chrome when enabled; Apple Pay needs Safari + domain
                verification in Square.
              </p>
            ) : null}

            {paying ? (
              <p className="text-sm font-semibold text-primary">Processing payment…</p>
            ) : null}

            <PaymentForm
              key={`${pkg.id}-${amountForVerify}`}
              applicationId={config.applicationId}
              locationId={config.locationId}
              overrides={
                config.environment === 'sandbox'
                  ? { scriptSrc: SANDBOX_SCRIPT }
                  : { scriptSrc: PRODUCTION_SCRIPT }
              }
              createPaymentRequest={createPaymentRequest}
              createVerificationDetails={createVerificationDetails}
              cardTokenizeResponseReceived={onTokenize}
            >
              <div className="space-y-3">
                <ApplePay />
                <GooglePay />
                <div className="relative py-1 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <span className="relative z-10 bg-white px-2">or pay by card</span>
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                </div>
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
              </div>
            </PaymentForm>
          </div>
        ) : null}
      </div>
    </div>
  )
}
