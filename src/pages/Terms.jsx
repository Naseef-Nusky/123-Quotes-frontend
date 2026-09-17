export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Terms of service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 2026</p>
      <div className="prose mt-8 space-y-4 text-slate">
        <p>
          Welcome to 123 Quotes. By using our marketplace you agree to these terms between you and 123 Quotes.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Accounts</h2>
        <p>
          You must provide accurate registration details and keep your credentials secure. Customer and professional
          accounts have different capabilities and responsibilities.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Quote requests & leads</h2>
        <p>
          Customers submit job requests for matching. Professionals may unlock leads using tokens. Unlocking does not
          guarantee work; it grants contact details for that lead.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Tokens & payments</h2>
        <p>
          Token purchases are non-refundable except where required by law. Sandbox payments may be used during MVP
          testing.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Acceptable use</h2>
        <p>
          Do not misuse the platform, scrape data, or contact users outside permitted lead unlocks. We may suspend
          accounts that breach these terms.
        </p>
        <h2 className="font-display text-xl font-bold text-navy">Contact</h2>
        <p>Questions about these terms: use the Contact page on this site.</p>
      </div>
    </div>
  )
}
