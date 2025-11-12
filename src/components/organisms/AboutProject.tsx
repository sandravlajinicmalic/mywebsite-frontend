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
            <Text as="h3" size="4xl" weight="bold" className="mb-4 text-gray-900 dark:text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
              {t('aboutProject.howItStarted.title')}
            </Text>
            <Text size="lg" className="mb-4 leading-relaxed text-white dark:text-white max-w-sm">
              {t('aboutProject.howItStarted.paragraph1')}
            </Text>
            <Text size="lg" className="mb-4 leading-relaxed text-white dark:text-white max-w-sm">
              {t('aboutProject.howItStarted.paragraph2')}
            </Text>
            <div className="mt-4 relative">
              <img
                src="/images/thinking1.png"
                alt="Thinking cat"
                className="absolute w-1/4 max-w-xs h-auto object-contain"
                style={{ top: '50px', left: '100px' }}
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex-1">
            <Text as="h3" size="4xl" weight="bold" className="mb-4 !text-black !font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
              {t('aboutProject.techStack.title')}
            </Text>
            <Text size="lg" className="mb-6 leading-relaxed !text-black">
              {t('aboutProject.techStack.description')}
            </Text>
            <Text size="base" weight="semibold" className="mb-4 !text-black">
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
          <div className="flex-[1.2] text-right">
            <Text as="h3" size="4xl" weight="bold" className="mb-4 text-gray-900 dark:text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
              {t('aboutProject.features.title')}
            </Text>
            <ul className="space-y-1">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex flex-col items-end">
                  <Text as="h4" size="lg" className="text-gray-900 dark:text-white">
                    {feature.title} <span className="text-base font-normal italic text-gray-500 dark:text-gray-400 font-sans">– {feature.description}</span>
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
              className="w-auto max-w-[260px] h-auto object-contain"
            />
          </div>
        </div>

        {/* Documentation & Links */}
        <div className="mb-12 text-center">
          <Text as="h3" size="4xl" weight="bold" className="mb-4 text-white dark:text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
            {t('aboutProject.docs.title')}
          </Text>
          <Text size="lg" className="mb-6 leading-relaxed text-white dark:text-white">
            {t('aboutProject.docs.subtitle')}
          </Text>
          <ul className="space-y-1 flex flex-col items-center">
            {documentationLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg text-[#06B6D4] hover:text-[#0891B2] hover:underline transition-colors"
                >
                  {link.label}
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

