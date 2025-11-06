import { Text } from '../components/atoms'
import { AboutMe, AboutProject, ContactForm } from '../components/organisms'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Text as="h1" size="5xl" weight="bold" className="mb-12 text-center text-gray-900 dark:text-white">
            O meni
          </Text>
          
          <div className="space-y-8">
            <AboutMe />
            <AboutProject />
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
