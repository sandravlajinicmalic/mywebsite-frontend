import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import MyJourney from './MyJourney'

const AboutMe = () => {
  const { t } = useI18n()

  const toolsCategories = [
    {
      title: t('aboutMe.tools.frontend.title'),
      techs: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI']
    },
    {
      title: t('aboutMe.tools.cloud.title'),
      techs: ['AWS', 'Docker', 'Azure DevOps', 'GitLab']
    },
    {
      title: t('aboutMe.tools.testing.title'),
      techs: ['Jest', 'Mocha', 'Chai']
    },
    {
      title: t('aboutMe.tools.versionControl.title'),
      techs: ['Git', 'GitHub', 'GitLab', 'Bitbucket']
    },
    {
      title: t('aboutMe.tools.design.title'),
      techs: ['Figma', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator']
    },
    {
      title: t('aboutMe.tools.projectManagement.title'),
      techs: ['Jira', 'Trello', 'Asana']
    }
  ]

  const getIconUrl = (tech: string): string => {
    // Local icons that don't exist on simple-icons CDN
    const localIcons: Record<string, string> = {
      'AWS': '/images/tools-icon/aws.svg',
      'Azure DevOps': '/images/tools-icon/azure.svg',
      'Adobe XD': '/images/tools-icon/adobdexd.svg',
      'Adobe Photoshop': '/images/tools-icon/photoshop.svg',
      'Adobe Illustrator': '/images/tools-icon/adobeilustrator.svg'
    }
    
    if (localIcons[tech]) {
      return localIcons[tech]
    }
    
    // Default to simple-icons for other technologies
    const mappings: Record<string, string> = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'React': 'react',
      'Vue.js': 'vue.js',
      'Angular': 'angular',
      'Sass': 'sass',
      'Tailwind CSS': 'tailwindcss',
      'Bootstrap': 'bootstrap',
      'Material UI': 'mui',
      'Docker': 'docker',
      'GitLab': 'gitlab',
      'Jest': 'jest',
      'Mocha': 'mocha',
      'Chai': 'chai',
      'Git': 'git',
      'GitHub': 'github',
      'Bitbucket': 'bitbucket',
      'Figma': 'figma',
      'Jira': 'jira',
      'Trello': 'trello',
      'Asana': 'asana'
    }
    
    const iconName = mappings[tech] || tech.toLowerCase().replace(/\s+/g, '')
    return `https://cdn.simpleicons.org/${iconName}`
  }
  
  return (
    <section className="w-full bg-transparent py-12 pb-16 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          <MyJourney />

          {/* My Toolbox of Tricks */}
          <div>
            <Text as="h2" size="3xl" weight="bold" className="mb-4 text-center text-white dark:text-white md:text-4xl" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
              {t('aboutMe.tools.title')}
            </Text>
            <Text size="base" className="mb-12 text-center text-white dark:text-white md:text-lg">
              {t('aboutMe.tools.subtitle')}
            </Text>
            
            {/* Tool Categories */}
            <div className="space-y-10">
              {toolsCategories.map((category, catIndex) => (
                <div key={catIndex}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Text as="h3" size="lg" weight="bold" className="text-gray-900 dark:text-white md:text-xl">
                      {category.title}
                    </Text>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {category.techs.map((tech) => {
                      const iconUrl = getIconUrl(tech);
                      return (
                        <span key={tech} className="inline-flex items-center gap-2 px-4 py-2 bg-black rounded-lg text-sm text-white border border-[rgba(244,114,182,0.5)]">
                          <img
                            src={iconUrl}
                            alt={tech}
                            className="w-4 h-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMe

