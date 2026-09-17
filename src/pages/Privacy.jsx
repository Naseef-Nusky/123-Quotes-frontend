export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 2026</p>
      <div className="mt-8 space-y-4 text-slate">
        <p>
          123 Quotes processes personal data to operate the quotes marketplace — matching customers with professionals
          and managing accounts, leads and token purchases.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">What we collect</h2>
        <p>
          Account details (name, email, phone, postcode), questionnaire answers on quote requests, professional profile
          information, and payment/token transaction records.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">How we use it</h2>
        <p>
          To create matches, enable lead unlocks, send transactional emails (verification, password reset, lead
          notices), and improve the service.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Sharing</h2>
        <p>
          When a professional unlocks a lead, that professional receives the customer contact details for that request.
          We do not sell personal data.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Your rights</h2>
        <p>
          Depending on your location you may request access, correction or deletion of your data. Contact us via the
          Contact page.
        </p>
      </div>
    </div>
  )
}
