import { Outlet } from 'react-router-dom'
import Layout from './Layout'

export function CustomerShell() {
  return (
    <Layout variant="public">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </div>
    </Layout>
  )
}

export function ProfessionalShell() {
  return (
    <Layout variant="business">
      <Outlet />
    </Layout>
  )
}
