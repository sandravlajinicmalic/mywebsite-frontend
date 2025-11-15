import { Text, Image } from '../atoms'
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
    <section className="w-full bg-transparent py-12 pb-16 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Career Timeline */}
          <div className='mb-16'>
            <Text as="h1" size="4xl" weight="bold" className="mb-8 text-gray-900 dark:text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
              {t('aboutMe.career.title')}
            </Text>
            <div className="relative flex h-screen justify-center">
              {/* Curved Road Path - full width, first curve starts from right side */}
              <div className="absolute left-0 right-0 w-full -top-32">
                <svg 
                  width="100%" 
                  height="100vh" 
                  viewBox="0 0 1200 700" 
                  preserveAspectRatio="none"
                  className="overflow-visible"
                >
                  {/* Vertical road path in S shape - first curve starts from right side, wide amplitudes */}
                  <path
                    d="M 1100 0 Q 50 100, 600 200 S 1150 350, 600 500 S 300 750, 600 850"
                    stroke="rgb(236, 72, 153)"
                    strokeWidth="60"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* White center line */}
                  <path
                    d="M 1100 0 Q 50 100, 600 200 S 1150 350, 600 500 S 300 750, 600 850"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10, 8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              {/* Content positioned one below another, centered */}
              <div className="relative w-full flex flex-col items-center justify-start gap-6 h-full -mt-10 px-8">
                {/* MANIA Marketing Agency */}
                <div className="w-[350px] self-end -mt-4">
                  <div className="text-right">
                    <div className="mb-2 flex flex-col items-end">
                      <Text size="2xl" weight="semibold" className="!text-black uppercase">
                        {careerPath[0].company}
                      </Text>
                      <Text size="lg" className="!text-black">
                        {careerPath[0].location}
                      </Text>
                    </div>
                    <Text size="xl" weight="semibold" className="!text-black mb-3">
                      {careerPath[0].role}
                    </Text>
                    <Text size="lg" className="!text-black whitespace-pre-line">
                      {careerPath[0].description}
                    </Text>
                  </div>
                </div>

                {/* Bondex B.V. */}
                <div className="w-[600px] self-start ml-12 -mt-16">
                  <div className="text-left">
                    <div className="mb-2 flex flex-col items-start">
                      <Text size="2xl" weight="semibold" className="!text-black uppercase">
                        {careerPath[1].company}
                      </Text>
                      <Text size="lg" className="!text-black">
                        {careerPath[1].location}
                      </Text>
                    </div>
                    <Text size="xl" weight="semibold" className="!text-black mb-3">
                      {careerPath[1].role}
                    </Text>
                    <Text size="lg" className="!text-black whitespace-pre-line">
                      {careerPath[1].description}
                    </Text>
                  </div>
                </div>

                {/* Endava */}
                <div className="w-[700px] self-end">
                  <div className="text-right">
                    <div className="mb-2 flex flex-col items-end">
                      <Text size="2xl" weight="semibold" className="!text-black uppercase">
                        {careerPath[2].company}
                      </Text>
                      <Text size="lg" className="!text-black">
                        {careerPath[2].location}
                      </Text>
                    </div>
                    <Text size="xl" weight="semibold" className="!text-black mb-3">
                      {careerPath[2].role}
                    </Text>
                    <Text size="lg" className="!text-black whitespace-pre-line">
                      {careerPath[2].description}
                    </Text>
                  </div>
                </div>
              </div>
              
              {/* Thinking cat image - absolute positioned bottom right */}
              <div className="absolute -bottom-24 right-36">
                <Image 
                  src="/images/thinking2.png" 
                  alt={t('aboutMe.alt.thinkingCat')}
                  className="w-52 h-52"
                />
              </div>
            </div>
          </div>

          {/* My Toolbox of Tricks */}
          <div>
            <Text as="h2" size="4xl" weight="bold" className="mb-4 text-center text-white dark:text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
              {t('aboutMe.tools.title')}
            </Text>
            <Text size="lg" className="mb-12 text-center text-white dark:text-white">
              {t('aboutMe.tools.subtitle')}
            </Text>
            
            {/* Tool Categories */}
            <div className="space-y-10">
              {toolsCategories.map((category, catIndex) => (
                <div key={catIndex}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Text as="h3" size="xl" weight="bold" className="text-gray-900 dark:text-white">
                      {category.title}
                    </Text>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
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

