import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Quotes from './pages/Quotes.jsx'
import Contact from './pages/Contact.jsx'

function Nav() {
  const linkClass = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors ${
      isActive ? 'text-sea' : 'text-slate hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-mist/80 bg-sand/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink">
          123 Quotes
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/quotes" className={linkClass}>
            Quotes
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-mist bg-ink text-mist">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg">123 Quotes</p>
        <p className="text-sm opacity-70">Inspiration, curated for every day.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
