import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { CustomerShell, ProfessionalShell } from './components/PortalShell'
import { useAuth } from './context/AuthContext'

import Home from './pages/Home'
import BusinessSignup from './pages/BusinessSignup'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import HowItWorks from './pages/HowItWorks'
import Pricing from './pages/Pricing'
import Professionals from './pages/Professionals'
import ProfessionalProfile from './pages/ProfessionalProfile'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SetPassword from './pages/SetPassword'
import PopularServicePage from './pages/PopularServicePage'

import CustomerDashboard from './pages/customer/Dashboard'
import MyRequests from './pages/customer/MyRequests'
import MyRequestedServices from './pages/customer/MyRequestedServices'
import NewRequest from './pages/customer/NewRequest'
import RequestDetail from './pages/customer/RequestDetail'

import ProDashboard from './pages/professional/Dashboard'
import ProLeads from './pages/professional/Leads'
import AvailablePros from './pages/professional/AvailablePros'
import ProPublicProfile from './pages/professional/ProPublicProfile'
import RequestSent from './pages/professional/RequestSent'
import MyRequest from './pages/professional/MyRequest'
import ClientRequests from './pages/professional/ClientRequests'
import Settings from './pages/professional/Settings'
import BuyTokens from './pages/professional/BuyTokens'
import TokenHistory from './pages/professional/TokenHistory'
import ProProfile from './pages/professional/Profile'

function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-8 text-center text-muted">Loading…</p>
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'PROFESSIONAL') return <Navigate to="/pro" replace />
  if (user.role === 'CUSTOMER') return <Navigate to="/app" replace />
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/set-password" element={<SetPassword />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="business/signup" element={<BusinessSignup />} />
        <Route path="services" element={<Services />} />
        <Route path="services/web-development" element={<Navigate to="/web-developer" replace />} />
        <Route path="services/photographers" element={<Navigate to="/wedding-photographers" replace />} />
        <Route path="services/event-photography" element={<Navigate to="/wedding-photographers" replace />} />
        <Route path="services/private-investigators" element={<Navigate to="/private-investigators" replace />} />
        <Route path="services/cleaning-services" element={<Navigate to="/house-cleaning" replace />} />
        <Route path="services/end-of-tenancy-cleaning" element={<Navigate to="/house-cleaning" replace />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="wedding-photographers" element={<PopularServicePage slug="wedding-photographers" />} />
        <Route path="house-cleaning" element={<PopularServicePage slug="house-cleaning" />} />
        <Route path="private-investigators" element={<PopularServicePage slug="private-investigators" />} />
        <Route path="web-developer" element={<PopularServicePage slug="web-developer" />} />
        <Route path="request" element={<NewRequest />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="professionals" element={<Professionals />} />
        <Route path="professionals/:id" element={<ProfessionalProfile />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="dashboard" element={<RoleRedirect />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute roles={['CUSTOMER']}>
            <CustomerShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="requested-services" element={<MyRequestedServices />} />
        <Route path="requests/new" element={<NewRequest />} />
        <Route path="requests/:id" element={<RequestDetail />} />
      </Route>

      <Route
        path="/pro"
        element={
          <ProtectedRoute roles={['PROFESSIONAL']}>
            <ProfessionalShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProDashboard />} />
        <Route path="available-pros" element={<AvailablePros />} />
        <Route path="available-pros/:id" element={<ProPublicProfile />} />
        <Route path="request-sent" element={<RequestSent />} />
        <Route path="my-request" element={<MyRequest />} />
        <Route path="leads" element={<ProLeads />} />
        <Route path="client-requests" element={<ClientRequests />} />
        <Route path="settings" element={<Settings />} />
        <Route path="tokens" element={<BuyTokens />} />
        <Route path="history" element={<TokenHistory />} />
        <Route path="profile" element={<ProProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
