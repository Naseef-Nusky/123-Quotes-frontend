import { Outlet } from 'react-router-dom'
import Layout from './Layout'

export function CustomerShell() {
  return (
    <Layout variant="customer">
      <Outlet />
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
