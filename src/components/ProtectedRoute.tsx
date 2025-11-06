import { Navigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { ROUTES } from '../constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute komponenta - zaštiti rute koje zahtevaju autentifikaciju
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

