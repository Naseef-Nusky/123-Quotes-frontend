import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Loading from '../components/Loading'
import BannerHeader from '../components/BannerHeader'
import { BANNERS } from '../data/banners'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const data = await api.getService(slug)
        if (alive) setService(data.service)
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [slug])

  if (loading) return <Loading overlay />
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-danger">{error}</p>
  if (!service) return null

  const ctaTo = `/request?service=${encodeURIComponent(service.slug || service.id)}`

  return (
    <div>
      <BannerHeader
        image={BANNERS.serviceDetail}
        eyebrow={service.category?.name || 'Service'}
        title={service.name}
        subtitle={service.description || service.shortDesc}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/services" className="text-sm font-semibold text-primary">
          ← All services
        </Link>

        <div className="surface mt-6 p-6">
        <p className="font-display text-lg font-bold text-navy">What happens next</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Answer a short questionnaire tailored to this service.</li>
          <li>Share your location so we can match nearby professionals.</li>
          <li>Matched pros can unlock your contact details and send quotes.</li>
        </ul>
        {(service.questions?.length || 0) > 0 ? (
          <p className="mt-4 text-sm text-slate">
            This request includes <strong>{service.questions.length}</strong> question
            {service.questions.length === 1 ? '' : 's'}.
          </p>
        ) : null}
          <Link to={ctaTo} className="btn-primary mt-6">
            Get quotes for {service.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
