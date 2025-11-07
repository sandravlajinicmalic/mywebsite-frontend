import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Text } from '../components/atoms'
import { ROUTES } from '../constants'
import { authService } from '../services/auth'
import { useI18n } from '../contexts/i18n'

const Login = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { t } = useI18n()

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
        setError(err.message || t('login.error'))
      } else {
        setError(t('login.error.generic'))
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
            {t('login.welcome')}
          </Text>
          <Text size="base" color="muted" className="mb-8 text-center">
            {t('login.subtitle')}
          </Text>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <Text size="sm">{error}</Text>
              </div>
            )}

            <Input
              type="text"
              label={t('login.nickname')}
              placeholder={t('login.nickname.placeholder')}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="email"
              label={t('login.email')}
              placeholder={t('login.email.placeholder')}
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
              {loading ? t('login.loading') : t('login.submit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

