import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Home, About } from './pages'
import { Header, Footer } from './components/molecules'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTES } from './constants'
import { authService } from './services/auth'

function App() {
  return (
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
          path={ROUTES.HOME} 
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
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
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
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
  )
}

export default App

