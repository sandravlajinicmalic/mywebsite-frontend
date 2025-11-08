import { useState } from 'react'
import { Text, Button } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import { contactService } from '../../services/contact'
import { authService } from '../../services/auth'

const ContactForm = () => {
  const { t } = useI18n()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError('Please enter a message')
      return
    }
    
    setIsLoading(true)
    setError(null)
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
          {t('contact.title')}
        </Text>
        <Text size="lg" color="muted" className="mb-4">
          {t('contact.subtitle')}
        </Text>
        <Text size="base" color="muted" className="mb-6">
          {t('contact.description')}
        </Text>
        
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('contact.messagePlaceholder') || 'Enter your message...'}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isLoading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                {t('contact.success') || 'Message sent successfully!'}
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="w-full sm:w-auto"
          >
            {isLoading ? (t('contact.sending') || 'Sending...') : (t('contact.send') || 'Send')}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default ContactForm

