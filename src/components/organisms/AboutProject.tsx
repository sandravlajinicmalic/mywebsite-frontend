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
      'WebSockets': 'socketdotio',
      'SmartChat AI': 'openai'
    }
    
    const iconName = mappings[tech] || tech.toLowerCase().replace(/\s+/g, '')
    return `https://cdn.simpleicons.org/${iconName}`
  }
  
  return (
    <section className="w-full bg-transparent py-6 lg:py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* How It All Started and Tech Stack side by side */}
        <div className="mb-6 lg:mb-12 flex flex-col lg:flex-row gap-8 pb-6 lg:pb-12 px-4 items-center lg:items-start">
          {/* How It All Started */}
          <div className="flex-1 text-left w-full max-w-lg mx-auto lg:mx-0">
            <Text as="h3" size="3xl" weight="bold" className="mb-4 !text-black !font-bold lg:!text-white lg:font-normal md:text-4xl about-project-title how-it-started-title">
              {t('aboutProject.howItStarted.title')}
            </Text>
            <Text size="base" className="mb-4 leading-relaxed !text-black lg:!text-white max-w-sm md:text-lg about-project-text">
              {t('aboutProject.howItStarted.paragraph1')}
            </Text>
            <Text size="base" className="mb-4 leading-relaxed !text-black lg:!text-white max-w-sm md:text-lg about-project-text">
              {t('aboutProject.howItStarted.paragraph2')}
            </Text>
            <div className="mt-4 relative hidden lg:block">
              <img
                src="/images/thinking1.png"
                alt={t('aboutProject.alt.thinkingCat')}
                className="absolute w-1/4 max-w-xs h-auto object-contain"
                style={{ top: '50px', left: '100px' }}
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex-1 text-right lg:text-left w-full max-w-lg mx-auto lg:mx-0">
            <Text as="h3" size="3xl" weight="bold" className="mb-4 !text-black !font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] md:text-4xl about-project-title">
              {t('aboutProject.techStack.title')}
            </Text>
            <Text size="base" className="mb-6 leading-relaxed !text-black md:text-lg about-project-text">
              {t('aboutProject.techStack.description')}
            </Text>
            <Text size="sm" weight="semibold" className="mb-4 !text-black md:text-base about-project-text">
              {t('aboutProject.techStack.subtitle')}
            </Text>
            <div className="flex flex-wrap gap-3 mb-4 justify-end lg:justify-start">
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
        <div className="pb-10 lg:pb-20 px-4 lg:px-0">
          <div className="w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Features List - Left Side */}
              <div className="flex-[1.2] text-left lg:text-right w-full lg:w-auto">
                <Text as="h3" size="3xl" weight="bold" className="mb-4 text-white md:text-4xl about-project-title" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
                  {t('aboutProject.features.title')}
                </Text>
                <ul className="space-y-1">
                  {keyFeatures.map((feature, index) => (
                    <li key={index} className="flex flex-col items-start lg:items-end">
                      <Text as="h4" size="base" className="text-white md:text-lg about-project-text">
                        {feature.title} <span className="text-sm md:text-base font-normal italic text-gray-400 font-sans about-project-text">– {feature.description}</span>
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Cat Image - Right Side */}
              <div className="flex-1 flex justify-center">
                <img
                  src="/images/reading.png"
                  alt={t('aboutProject.alt.readingCat')}
                  className="w-auto max-w-[160px] md:max-w-[200px] lg:max-w-[260px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documentation & Links */}
        <div className="mb-6 lg:mb-12 px-4 lg:px-0">
          <div className="w-full max-w-lg mx-auto lg:max-w-none lg:mx-0 text-right lg:text-center">
            <Text as="h3" size="3xl" weight="bold" className="mb-4 text-white md:text-4xl about-project-title" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
              {t('aboutProject.docs.title')}
            </Text>
            <Text size="base" className="mb-6 leading-relaxed text-white md:text-lg about-project-text">
              {t('aboutProject.docs.subtitle')}
            </Text>
            <ul className="space-y-1 flex flex-col items-end lg:items-center">
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
      </div>
      <style>{`
        /* Smanji font za 2px za tablete i manje ekrane */
        @media (max-width: 1023px) {
          .about-project-title {
            font-size: calc(1.875rem - 2px) !important; /* 3xl (30px) - 2px = 28px */
          }
          @media (min-width: 768px) {
            .about-project-title {
              font-size: calc(2.25rem - 2px) !important; /* 4xl (36px) - 2px = 34px */
            }
          }
          .about-project-text {
            font-size: calc(1rem - 2px) !important; /* base (16px) - 2px = 14px */
          }
          @media (min-width: 768px) {
            .about-project-text {
              font-size: calc(1.125rem - 2px) !important; /* lg (18px) - 2px = 16px */
            }
          }
          .about-project-text.text-sm {
            font-size: calc(0.875rem - 2px) !important; /* sm (14px) - 2px = 12px */
          }
          @media (min-width: 768px) {
            .about-project-text.text-sm {
              font-size: calc(1rem - 2px) !important; /* base (16px) - 2px = 14px */
            }
          }
          .how-it-started-title {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3) !important;
          }
        }
        @media (min-width: 1024px) {
          .how-it-started-title {
            text-shadow: 2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5) !important;
          }
        }
      `}</style>
    </section>
  )
}

export default AboutProject

