import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Text } from '../components/atoms'
import { ROUTES } from '../constants'
import { authService } from '../services/auth'
import { useI18n } from '../contexts/i18n'

const ForgotNickname = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(undefined)
    setSuccess(false)
    
    // Frontend validacija
    if (!email || email.trim() === '') {
      setEmailError(t('forgotNickname.email.required'))
      return
    }
    
    setLoading(true)

    try {
      await authService.forgotNickname(email)
      setSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setEmailError(err.message || t('forgotNickname.error'))
      } else {
        setEmailError(t('forgotNickname.error'))
      }
      console.error('Forgot nickname error:', err)
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
          <Text as="h1" size="3xl" weight="bold" className="mb-4 text-center text-white">
            {t('forgotNickname.title')}
          </Text>

          <Text as="p" className="mb-6 text-center text-gray-400">
            {t('forgotNickname.description')}
          </Text>

          {success ? (
            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                <Text className="text-green-400 text-center">
                  {t('forgotNickname.success')}
                </Text>
              </div>
              
              <Button 
                type="button"
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                {t('forgotNickname.backToLogin')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Input
                type="email"
                label={t('forgotNickname.email.label')}
                placeholder={t('forgotNickname.email.placeholder')}
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
                {loading ? t('forgotNickname.loading') : t('forgotNickname.submit')}
              </Button>

              <div className="text-center">
                <Link 
                  to={ROUTES.LOGIN}
                  className="text-pink-400 hover:text-pink-300 text-sm underline"
                >
                  {t('forgotNickname.backToLogin')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotNickname

