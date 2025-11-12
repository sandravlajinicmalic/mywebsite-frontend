import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Home, About, ForgotNickname } from './pages'
import { Header, Footer } from './components/molecules'
import { CurvedBackground, AboutCurvedBackground } from './components/organisms'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTES } from './constants'
import { authService } from './services/auth'
import { I18nProvider } from './contexts/i18n'

function App() {
  return (
    <I18nProvider>
      <Router>
        <Routes>
          <Route 
            path={ROUTES.LOGIN} 
            element={
              authService.isAuthenticated() ? (
                <Navigate to={ROUTES.HOME} replace />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path={ROUTES.FORGOT_NICKNAME} 
            element={
              authService.isAuthenticated() ? (
                <Navigate to={ROUTES.HOME} replace />
              ) : (
                <ForgotNickname />
              )
            } 
          />
          <Route 
            path={ROUTES.HOME} 
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen relative">
                  <CurvedBackground />
                  <Header />
                  <main className="flex-grow relative z-10">
                    <Home />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.ABOUT} 
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen relative">
                  <AboutCurvedBackground />
                  <Header />
                  <main className="flex-grow relative z-10">
                    <About />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Router>
    </I18nProvider>
  )
}

export default App

