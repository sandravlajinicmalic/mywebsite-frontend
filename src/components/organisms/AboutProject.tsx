import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'

const AboutProject = () => {
  const { t } = useI18n()
  
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
          {t('aboutProject.title')}
        </Text>
        <Text size="lg" color="muted" className="mb-4">
          {t('aboutProject.intro')}
        </Text>
        <Text size="base" color="muted" className="mb-4">
          {t('aboutProject.technologies')}
        </Text>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <Text size="base" color="muted">{t('aboutProject.tech.react')}</Text>
          </li>
          <li>
            <Text size="base" color="muted">{t('aboutProject.tech.vite')}</Text>
          </li>
          <li>
            <Text size="base" color="muted">{t('aboutProject.tech.tailwind')}</Text>
          </li>
          <li>
            <Text size="base" color="muted">{t('aboutProject.tech.router')}</Text>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default AboutProject

