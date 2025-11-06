import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Home, About } from './pages'
import { Header, Footer } from './components/molecules'
import { ROUTES } from './constants'

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route 
          path={ROUTES.HOME} 
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </div>
          } 
        />
        <Route 
          path={ROUTES.ABOUT} 
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <About />
              </main>
              <Footer />
            </div>
          } 
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  )
}

export default App

