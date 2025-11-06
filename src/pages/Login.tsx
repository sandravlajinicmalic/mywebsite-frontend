import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Text } from '../components/atoms'
import { ROUTES } from '../constants'
import { authService } from '../services/auth'

const Login = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Pozovi backend API za login/register
      await authService.login(email, nickname)
      
      // Uspešno kreiran korisnik - prebaci na Home
      navigate(ROUTES.HOME)
    } catch (err: unknown) {
      // Handle error
      if (err instanceof Error) {
        setError(err.message || 'Došlo je do greške prilikom prijave')
      } else {
        setError('Došlo je do greške prilikom prijave. Pokušajte ponovo.')
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <Text as="h1" size="4xl" weight="bold" className="mb-2 text-center text-gray-900 dark:text-white">
            Dobrodošli
          </Text>
          <Text size="base" color="muted" className="mb-8 text-center">
            Unesite vaše podatke da biste nastavili
          </Text>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <Text size="sm">{error}</Text>
              </div>
            )}

            <Input
              type="text"
              label="Nickname"
              placeholder="Unesite vaš nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="email"
              label="Email adresa"
              placeholder="Unesite vašu email adresu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Učitavanje...' : 'Next'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

