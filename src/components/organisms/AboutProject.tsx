import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'

const AboutProject = () => {
  const { t } = useI18n()
  
  const keyFeatures = [
    {
      title: t('aboutProject.features.login.title'),
      description: t('aboutProject.features.login.description')
    },
    {
      title: t('aboutProject.features.smartchat.title'),
      description: t('aboutProject.features.smartchat.description')
    },
    {
      title: t('aboutProject.features.wheel.title'),
      description: t('aboutProject.features.wheel.description')
    },
    {
      title: t('aboutProject.features.websocket.title'),
      description: t('aboutProject.features.websocket.description')
    },
    {
      title: t('aboutProject.features.modular.title'),
      description: t('aboutProject.features.modular.description')
    },
    {
      title: t('aboutProject.features.responsive.title'),
      description: t('aboutProject.features.responsive.description')
    }
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
      label: t('aboutProject.docs.frontend'),
      href: t('aboutProject.docs.frontendUrl')
    },
    {
      label: t('aboutProject.docs.backend'),
      href: t('aboutProject.docs.backendUrl')
    },
    {
      label: t('aboutProject.docs.database'),
      href: t('aboutProject.docs.databaseUrl')
    },
    {
      label: t('aboutProject.docs.smartchat'),
      href: t('aboutProject.docs.smartchatUrl')
    },
    {
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
        {/* <Text as="h2" size="3xl" weight="bold" className="mb-8 text-gray-900 dark:text-white">
          {t('aboutProject.title')}
        </Text> */}

        {/* How It All Started and Tech Stack side by side */}
        <div className="mb-12 flex flex-col md:flex-row gap-8 pb-12">
          {/* How It All Started */}
          <div className="flex-1">
            <Text as="h3" size="4xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
              {t('aboutProject.howItStarted.title')}
            </Text>
            <Text size="lg" color="muted" className="mb-4 leading-relaxed">
              {t('aboutProject.howItStarted.paragraph1')}
            </Text>
            <Text size="lg" color="muted" className="mb-4 leading-relaxed">
              {t('aboutProject.howItStarted.paragraph2')}
            </Text>
            <div className="mt-4 flex gap-4">
              <img
                src="/images/thinking1.png"
                alt="Thinking cat"
                className="w-1/4 max-w-xs h-auto object-contain"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex-1">
            <Text as="h3" size="4xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
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
                <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-black rounded-lg text-sm text-white">
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
        </div>

        {/* Key Features */}
        <div className="pb-20 flex flex-col md:flex-row gap-8 items-center">
          {/* Features List - Left Side */}
          <div className="flex-1 text-right">
            <Text as="h3" size="4xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
              {t('aboutProject.features.title')}
            </Text>
            <ul className="space-y-1">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex flex-col items-end">
                  <Text as="h4" size="lg" className="text-gray-900 dark:text-white">
                    {feature.title} <span className="text-base font-normal italic text-gray-500 dark:text-gray-400">– {feature.description}</span>
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cat Image - Right Side */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/reading.png"
              alt="Reading cat"
              className="w-auto max-w-xs h-auto object-contain"
            />
          </div>
        </div>

        {/* Documentation & Links */}
        <div className="mb-12 text-center">
          <Text as="h3" size="4xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutProject.docs.title')}
          </Text>
          <Text size="lg" color="muted" className="mb-6 leading-relaxed">
            {t('aboutProject.docs.subtitle')}
          </Text>
          <ul className="space-y-1 flex flex-col items-center">
            {documentationLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                >
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

