import { useNavigate } from 'react-router-dom'
import { Button, Text } from '../atoms'
import { ROUTES } from '../../constants'
import { useI18n } from '../../contexts/i18n'

const GoToAbout = () => {
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleGoToAbout = () => {
    navigate(ROUTES.ABOUT)
  }

  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto text-center">
        <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
          {t('goToAbout.title')}
        </Text>
        <Text size="lg" color="muted" className="mb-6">
          {t('goToAbout.subtitle')}
        </Text>
        <Button
          onClick={handleGoToAbout}
          variant="primary"
          size="lg"
          className="mt-4"
        >
          {t('goToAbout.button')}
        </Button>
      </div>
    </section>
  )
}

export default GoToAbout

