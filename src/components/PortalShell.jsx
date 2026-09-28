import { Outlet } from 'react-router-dom'
import CustomerPortalLayout from './CustomerPortalLayout'
import ProPortalLayout from './ProPortalLayout'

export function CustomerShell() {
  return <CustomerPortalLayout />
}

export function ProfessionalShell() {
  return <ProPortalLayout />
}
