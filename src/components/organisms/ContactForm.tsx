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
      setError('Please enter a message')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setFieldError(null)
    setSuccess(false)
    
    try {
      const user = authService.getCurrentUser()
      await contactService.sendMessage({
        name: user?.nickname || 'Guest',
        email: user?.email || 'guest@example.com',
        message: message.trim(),
      })
      
      setSuccess(true)
      setMessage('')
      setFieldError(null)
    } catch (err) {
      if (err instanceof Error) {
        const errorWithField = err as Error & { field?: string }
        // If error is related to message field, display it below textarea
        if (errorWithField.field === 'message') {
          setFieldError(errorWithField.message)
        } else {
          // For other errors (name, email, general), display as general error
          setError(errorWithField.message)
        }
      } else {
        setError('Failed to send message')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Title and subtitle above */}
        <div className="text-right mb-6">
          <Text as="h2" size="4xl" weight="bold" className="mb-4 !text-black !font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Let's Talk (or Meow)
          </Text>
          <div className="w-1/2 ml-auto pb-4">
            <Text size="lg" className="!text-black">
              Got questions, feedback, or just want to say hi? Drop a message below — I promise my SmartChat won't answer this one for me.
            </Text>
          </div>
        </div>
        
        {/* Image and Form in the same div */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
          {/* Image */}
          <div className="w-full md:w-1/3 relative">
            <Image
              src="/images/education.png"
              alt="Education"
              className="absolute max-w-80 h-auto"
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
                  {isLoading ? (t('contact.sending') || 'Sending...') : 'Meow to Me'}
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

