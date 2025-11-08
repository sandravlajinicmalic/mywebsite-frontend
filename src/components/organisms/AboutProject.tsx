import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'

const AboutProject = () => {
  const { t } = useI18n()
  
  const keyFeatures = [
    t('aboutProject.features.login'),
    t('aboutProject.features.smartchat'),
    t('aboutProject.features.wheel'),
    t('aboutProject.features.websocket'),
    t('aboutProject.features.modular'),
    t('aboutProject.features.responsive')
  ]

  const techStack = [
    'React',
    'Tailwind CSS',
    'Vite',
    'Node.js',
    'Supabase',
    'WebSockets',
    'SmartChat AI'
  ]

  const documentationLinks = [
    {
      emoji: '🖥️',
      label: t('aboutProject.docs.frontend'),
      href: t('aboutProject.docs.frontendUrl')
    },
    {
      emoji: '⚙️',
      label: t('aboutProject.docs.backend'),
      href: t('aboutProject.docs.backendUrl')
    },
    {
      emoji: '🗄️',
      label: t('aboutProject.docs.database'),
      href: t('aboutProject.docs.databaseUrl')
    },
    {
      emoji: '🧠',
      label: t('aboutProject.docs.smartchat'),
      href: t('aboutProject.docs.smartchatUrl')
    },
    {
      emoji: '🎡',
      label: t('aboutProject.docs.wheel'),
      href: t('aboutProject.docs.wheelUrl')
    }
  ]

  const getTechIconUrl = (tech: string): string => {
    const mappings: Record<string, string> = {
      'React': 'react',
      'Tailwind CSS': 'tailwindcss',
      'Vite': 'vite',
      'Node.js': 'nodedotjs',
      'Supabase': 'supabase',
      'WebSockets': 'websocket',
      'SmartChat AI': 'openai'
    }
    
    const iconName = mappings[tech] || tech.toLowerCase().replace(/\s+/g, '')
    return `https://cdn.simpleicons.org/${iconName}`
  }
  
  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <Text as="h2" size="3xl" weight="bold" className="mb-8 text-gray-900 dark:text-white">
          {t('aboutProject.title')}
        </Text>

        {/* How It All Started */}
        <div className="mb-12">
          <Text as="h3" size="2xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutProject.howItStarted.title')}
          </Text>
          <Text size="lg" color="muted" className="mb-4 leading-relaxed">
            {t('aboutProject.howItStarted.paragraph1')}
          </Text>
          <Text size="lg" color="muted" className="mb-4 leading-relaxed">
            {t('aboutProject.howItStarted.paragraph2')}
          </Text>
          <Text size="lg" color="muted" className="leading-relaxed">
            {t('aboutProject.howItStarted.paragraph3')}
          </Text>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <Text as="h3" size="2xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutProject.techStack.title')}
          </Text>
          <Text size="lg" color="muted" className="mb-6 leading-relaxed">
            {t('aboutProject.techStack.description')}
          </Text>
          <Text size="base" weight="semibold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutProject.techStack.subtitle')}
          </Text>
          <div className="flex flex-wrap gap-3 mb-4">
            {techStack.map((tech, index) => (
              <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                <img
                  src={getTechIconUrl(tech)}
                  alt={tech}
                  className="w-4 h-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <Text as="h3" size="2xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutProject.features.title')}
          </Text>
          <ul className="space-y-3">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Text size="lg" className="text-gray-700 dark:text-gray-300">
                  {feature}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        {/* Documentation & Links */}
        <div className="mb-12">
          <Text as="h3" size="2xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutProject.docs.title')}
          </Text>
          <Text size="lg" color="muted" className="mb-6 leading-relaxed">
            {t('aboutProject.docs.subtitle')}
          </Text>
          <ul className="space-y-3">
            {documentationLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  <span>{link.emoji}</span>
                  <Text size="lg" className="text-blue-600 dark:text-blue-400">
                    {link.label}
                  </Text>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AboutProject

