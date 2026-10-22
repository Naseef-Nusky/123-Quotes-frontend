import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'

export const defaultFaqs = [
  {
    q: 'Is it free to request quotes?',
    a: 'Yes. Requesting quotes on 123 Quotes is completely free for customers. Tell us what you need, answer a few quick questions, and local professionals will get in touch with their quotes. There is no obligation to hire anyone.',
  },
  {
    q: 'How do I get matched with professionals?',
    a: 'When you submit a request, we match it with verified professionals who offer that service in your postcode area. They review your job details and contact you directly with quotes so you can compare prices, reviews and availability.',
  },
  {
    q: 'Are the professionals verified?',
    a: 'Every professional on 123 Quotes has a registered business profile. We recommend comparing reviews and asking for references before booking, and you always deal directly with the professional you choose.',
  },
  {
    q: 'How does it work for professionals?',
    a: 'Professionals create a free business profile, buy a token package, and unlock the customer leads they want. Contact details stay hidden until you unlock a lead, so you only pay for the jobs you actually pursue.',
  },
  {
    q: 'Can I attach photos or documents to my request?',
    a: 'Yes. You can attach up to 3 files (photos, PDFs or documents, up to 10 MB each) when you submit a request, so professionals can quote more accurately. Only professionals who unlock your lead can download them.',
  },
]

export default function Faq({ items = defaultFaqs, title = 'Frequently asked questions' }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="mx-auto max-w-3xl">
      <Reveal>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-10 space-y-3">
        {items.map((item, i) => {
          const open = openIndex === i
          return (
            <Reveal key={item.q} delay={i * 0.05}>
              <div
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  open ? 'border-primary/40 shadow-[0_14px_36px_-20px_rgba(10,47,92,0.35)]' : 'border-line'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-navy sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    strokeWidth={2.25}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
