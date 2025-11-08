import { useNavigate } from 'react-router-dom'
import { Button, Text, Image } from '../atoms'
import { ROUTES } from '../../constants'
import { useI18n } from '../../contexts/i18n'

const GoToAbout = () => {
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleGoToAbout = () => {
    navigate(ROUTES.ABOUT)
  }

  return (
    <section className="w-full bg-transparent pt-12 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Text as="h2" size="3xl" weight="bold" className="mb-4 text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
            {t('goToAbout.title')}
          </Text>
          <Text size="lg" className="mb-6 pb-20 text-white">
            {t('goToAbout.subtitle')}
          </Text>
          <div className="relative flex flex-col items-center mt-4">
            <Image
              src="/images/laptop-computer.png"
              alt="Cat with laptop"
              className="absolute -top-[110px] z-10 w-32 h-32 object-contain"
              objectFit="contain"
            />
            <Button
              onClick={handleGoToAbout}
              variant="primary"
              size="lg"
              className="relative z-0"
            >
              {t('goToAbout.button')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GoToAbout

