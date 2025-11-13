import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Home, About, ForgotNickname } from './pages'
import { Header, Footer } from './components/molecules'
import { CurvedBackground, AboutCurvedBackground, ActiveRewards } from './components/organisms'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTES } from './constants'
import { authService } from './services/auth'
import { I18nProvider } from './contexts/i18n'
import { useEffect } from 'react'

function App() {
  // Restore scroll position after page refresh (for reward refresh)
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition')
    const savedScrollPath = sessionStorage.getItem('scrollPath')
    
    if (savedScrollPosition && savedScrollPath && savedScrollPath === window.location.pathname) {
      const scrollY = parseInt(savedScrollPosition, 10)
      
      if (isNaN(scrollY) || scrollY < 0) {
        // Invalid scroll position, clear it
        sessionStorage.removeItem('scrollPosition')
        sessionStorage.removeItem('scrollPath')
        return
      }
      
      console.log('📍 Restoring scroll position:', scrollY)
      
      // Function to restore scroll position
      const restoreScroll = () => {
        // Use multiple methods to ensure scroll works
        try {
          window.scrollTo(0, scrollY)
          document.documentElement.scrollTop = scrollY
          document.body.scrollTop = scrollY
          // Force scroll on window
          if (window.scrollTo) {
            window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' })
          }
        } catch (e) {
          console.error('Error restoring scroll:', e)
        }
      }
      
      // Try immediately
      restoreScroll()
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        restoreScroll()
        requestAnimationFrame(() => {
          restoreScroll()
        })
      })
      
      // Try after various delays to ensure DOM is ready
      const timeouts = [
        0, 10, 50, 100, 200, 300, 500, 750, 1000
      ]
      
      timeouts.forEach(delay => {
        setTimeout(restoreScroll, delay)
      })
      
      // Also try on window load event
      const handleLoad = () => {
        restoreScroll()
      }
      
      // Check if already loaded
      if (document.readyState === 'complete') {
        restoreScroll()
      } else {
        window.addEventListener('load', handleLoad)
      }
      
      // Also listen for DOMContentLoaded
      const handleDOMContentLoaded = () => {
        restoreScroll()
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)
      } else {
        handleDOMContentLoaded()
      }
      
      // Clear saved position after restoring (with delay)
      setTimeout(() => {
        window.removeEventListener('load', handleLoad)
        document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
        sessionStorage.removeItem('scrollPosition')
        sessionStorage.removeItem('scrollPath')
      }, 1500)
      
      return () => {
        window.removeEventListener('load', handleLoad)
        document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
      }
    }
  }, [])

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
                  <ActiveRewards />
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
                  <ActiveRewards />
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

