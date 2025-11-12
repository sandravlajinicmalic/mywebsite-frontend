import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Text } from '../components/atoms'
import { ROUTES } from '../constants'
import { authService, LoginError } from '../services/auth'
import { useI18n } from '../contexts/i18n'

const Login = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [nicknameError, setNicknameError] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(undefined)
    setNicknameError(undefined)
    
    // Frontend validation before sending to backend
    let hasErrors = false
    
    if (!email || email.trim() === '') {
      setEmailError('Email is required')
      hasErrors = true
    }
    
    if (!nickname || nickname.trim() === '') {
      setNicknameError('Nickname is required')
      hasErrors = true
    }
    
    if (hasErrors) {
      return
    }
    
    setLoading(true)

    try {
      // Call backend API for login/register
      await authService.login(email, nickname)
      
      // Successfully created user - redirect to Home
      navigate(ROUTES.HOME)
    } catch (err: unknown) {
      // Handle error
      if (err instanceof Error) {
        // Check if it's LoginError with specific field errors
        const loginError = err as LoginError
        if (loginError.errors) {
          // Set specific errors for each field
          setEmailError(loginError.errors.email)
          setNicknameError(loginError.errors.nickname)
        } else {
          // If there are no specific errors, try to display generic error below email field
          setEmailError(err.message || t('login.error'))
        }
      } else {
        setEmailError(t('login.error.generic'))
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div 
          className="bg-black rounded-lg p-8 border"
          style={{ 
            boxShadow: '0 0 15px rgba(244, 114, 182, 0.3), 0 0 30px rgba(244, 114, 182, 0.2)',
            borderColor: 'rgba(244, 114, 182, 0.5)'
          }}
        >
          <Text as="h1" size="3xl" weight="bold" className="mb-8 text-center text-white">
            {t('login.welcome')}
          </Text>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
              type="text"
              label={t('login.nickname')}
              placeholder={t('login.nickname.placeholder')}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
                setNicknameError(undefined)
              }}
              error={nicknameError}
              required
              disabled={loading}
            />

            <Input
              type="email"
              label={t('login.email')}
              placeholder={t('login.email.placeholder')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(undefined)
              }}
              error={emailError}
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

            <div className="text-center mt-4">
              <Link 
                to={ROUTES.FORGOT_NICKNAME}
                className="text-pink-400 hover:text-pink-300 text-sm underline"
              >
                {t('login.forgotNickname')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

