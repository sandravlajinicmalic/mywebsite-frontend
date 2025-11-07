import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'

const ContactForm = () => {
  const { t } = useI18n()
  
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
          {t('contact.title')}
        </Text>
        <Text size="lg" color="muted" className="mb-4">
          {t('contact.subtitle')}
        </Text>
        <Text size="base" color="muted">
          {t('contact.description')}
        </Text>
      </div>
    </section>
  )
}

export default ContactForm

