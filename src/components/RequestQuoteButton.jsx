import { useState } from 'react'
import { Check, FileText } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

/**
 * One-click "Request Quotation" — sends a ready-made quotation request
 * message to the professional immediately. No form to fill in.
 * The request lands in their Client Requests inbox; yours shows in Request Sent.
 */
export default function RequestQuoteButton({ professional, className = '' }) {
  const { user } = useAuth()
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  if (!professional) return null
  if (user?.professional?.id === professional.id) return null

  async function send() {
    setState('sending')
    setError('')
    const myCompany = user?.professional?.companyName || 'A 123Quotes professional'
    const text = `Hello ${professional.companyName}, ${myCompany} would like to request a quotation from you. Please send us your pricing and availability. Thank you.`
    try {
      await api.sendMessage({ professionalId: professional.id, message: text })
      setState('sent')
    } catch (err) {
      setState('error')
      setError(err.message || 'Failed to send request')
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={send}
        disabled={state === 'sending' || state === 'sent'}
        className={`${state === 'sent' ? 'btn-secondary' : 'btn-primary'} !rounded-md !py-2.5 ${className}`}
      >
        {state === 'sent' ? (
          <span className="inline-flex items-center justify-center gap-1.5">
            <Check className="size-4" /> Request Sent
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5">
            <FileText className="size-4" />
            {state === 'sending' ? 'Sending…' : 'Request Quotation'}
          </span>
        )}
      </button>
      {state === 'error' && error ? <span className="text-xs text-danger">{error}</span> : null}
    </span>
  )
}
