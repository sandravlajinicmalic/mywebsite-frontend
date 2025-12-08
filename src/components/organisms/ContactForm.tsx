import { useState } from 'react'
import { Text, Button, Image } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import { contactService } from '../../services/contact'
import { authService } from '../../services/auth'

const ContactForm = () => {
  const { t } = useI18n()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError(t('contact.error.messageRequired'))
      return
    }
    
    setIsLoading(true)
    setError(null)
    setFieldError(null)
    setSuccess(false)
    
    try {
      const user = authService.getCurrentUser()
      await contactService.sendMessage({
        name: user?.nickname || t('contact.guest.name'),
        email: user?.email || t('contact.guest.email'),
        message: message.trim(),
      })
      
      setSuccess(true)
      setMessage('')
      setFieldError(null)
    } catch (err) {
      if (err instanceof Error) {
        const errorWithField = err as Error & { field?: string }
        // err.message is already a translation key from the service
        const translatedMessage = errorWithField.message ? t(errorWithField.message) : t('contact.error.failed')
        // If error is related to message field, display it below textarea
        if (errorWithField.field === 'message') {
          setFieldError(translatedMessage)
        } else {
          // For other errors (name, email, general), display as general error
          setError(translatedMessage)
        }
      } else {
        setError(t('contact.error.failed'))
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Title and subtitle above */}
        <div className="text-center md:text-right mb-6 px-4">
          <Text as="h2" size="3xl" weight="bold" className="mb-4 !text-black !font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] md:text-4xl">
            {t('contact.titleSection')}
          </Text>
          <div className="w-full md:w-1/2 md:ml-auto pb-4">
            <Text size="base" className="!text-black md:text-lg">
              {t('contact.subtitleSection')}
            </Text>
          </div>
        </div>
        
        {/* Image and Form in the same div */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
          {/* Image */}
          <div className="w-full md:w-1/3 relative flex justify-center md:justify-end">
            <Image
              src="/images/education.png"
              alt={t('contact.alt.education')}
              className="max-w-48 md:max-w-64 lg:max-w-80 h-auto relative md:absolute"
              style={{ bottom: '60px', right: '0' }}
              objectFit="contain"
            />
          </div>
          
          {/* Form */}
          <div className="w-full md:w-2/3 flex flex-col justify-end">
            <form onSubmit={handleSubmit} className="w-full flex flex-col">
              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    // Clear error when user starts typing
                    if (fieldError) {
                      setFieldError(null)
                    }
                    if (error) {
                      setError(null)
                    }
                  }}
                  placeholder={t('contact.messagePlaceholder') || 'Enter your message...'}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none"
                  disabled={isLoading}
                />
                {/* Error message container with fixed height to prevent layout shift */}
                <div className="mt-1 min-h-[20px]">
                  {fieldError && (
                    <p className="text-sm text-black dark:text-black">
                      {fieldError}
                    </p>
                  )}
                  {error && !fieldError && (
                    <p className="text-sm text-black dark:text-black">
                      {error}
                    </p>
                  )}
                  {success && !fieldError && !error && (
                    <p className="text-sm text-black dark:text-black">
                      {t('contact.success') || 'Message sent successfully!'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="min-w-32"
                >
                  {isLoading ? t('contact.sending') : t('contact.button')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm

