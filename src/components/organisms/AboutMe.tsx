import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'

const AboutMe = () => {
  const { t } = useI18n()
  
  const careerPath = [
    {
      company: t('aboutMe.career.mania.company'),
      location: t('aboutMe.career.mania.location'),
      role: t('aboutMe.career.mania.role'),
      description: t('aboutMe.career.mania.description')
    },
    {
      company: t('aboutMe.career.bondex.company'),
      location: t('aboutMe.career.bondex.location'),
      role: t('aboutMe.career.bondex.role'),
      description: t('aboutMe.career.bondex.description')
    },
    {
      company: t('aboutMe.career.endava.company'),
      location: t('aboutMe.career.endava.location'),
      role: t('aboutMe.career.endava.role'),
      description: t('aboutMe.career.endava.description')
    }
  ]

  const toolsCategories = [
    {
      title: t('aboutMe.tools.frontend.title'),
      description: t('aboutMe.tools.frontend.description'),
      techs: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI']
    },
    {
      title: t('aboutMe.tools.cloud.title'),
      description: t('aboutMe.tools.cloud.description'),
      techs: ['AWS', 'Docker', 'Azure DevOps', 'GitLab']
    },
    {
      title: t('aboutMe.tools.testing.title'),
      description: t('aboutMe.tools.testing.description'),
      techs: ['Jest', 'Mocha', 'Chai']
    },
    {
      title: t('aboutMe.tools.versionControl.title'),
      description: t('aboutMe.tools.versionControl.description'),
      techs: ['Git', 'GitHub', 'GitLab', 'Bitbucket']
    },
    {
      title: t('aboutMe.tools.design.title'),
      description: t('aboutMe.tools.design.description'),
      techs: ['Figma', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator']
    },
    {
      title: t('aboutMe.tools.projectManagement.title'),
      description: t('aboutMe.tools.projectManagement.description'),
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
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">

        {/* Career Timeline */}
    
          <Text as="h1" size="4xl" weight="bold" className="mb-8 text-gray-900 dark:text-white">
            {t('aboutMe.career.title')}
          </Text>
          <div className="relative">
            {/* Vertical line connecting all points */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Career points */}
            <div className="space-y-12">
              {careerPath.map((item, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Circle */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  
                  {/* Career details */}
                  <div className="ml-8 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Text size="lg" weight="semibold" className="text-gray-900 dark:text-white">
                        {item.company}
                      </Text>
                      <Text size="lg" color="muted">
                        {item.location}
                      </Text>
                    </div>
                    <Text size="base" weight="semibold" className="text-blue-600 dark:text-blue-400 mb-3">
                      {item.role}
                    </Text>
                    <Text size="sm" className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {item.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
  
        </div>

        {/* My Toolbox of Tricks */}
        <div className="mt-16">
          <Text as="h2" size="3xl" weight="bold" className="mb-4 text-gray-900 dark:text-white">
            {t('aboutMe.tools.title')}
          </Text>
          <Text size="lg" color="muted" className="mb-12">
            {t('aboutMe.tools.subtitle')}
          </Text>
          
          {/* Tool Categories */}
          <div className="space-y-12">
            {toolsCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <div className="flex items-center gap-2 mb-3">
                  <Text as="h3" size="xl" weight="bold" className="text-gray-900 dark:text-white">
                    {category.title}
                  </Text>
                </div>
                <Text size="sm" color="muted" className="mb-4 italic">
                  {category.description}
                </Text>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {category.techs.map((tech) => {
                    const iconUrl = getIconUrl(tech);
                    return (
                      <div key={tech} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-800 p-2 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700">
                          <img
                            src={iconUrl}
                            alt={tech}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs text-gray-400">${tech.substring(0, 3)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <Text size="xs" className="text-center text-gray-700 dark:text-gray-300">
                          {tech}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMe

