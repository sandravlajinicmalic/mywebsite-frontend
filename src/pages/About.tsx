import { useEffect } from 'react'
import { AboutMe, AboutProject, ContactForm } from '../components/organisms'

const About = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  return (
    <div className="min-h-screen relative">
      <div className="w-full relative z-10">
      <AboutProject />
        <AboutMe />
        <ContactForm />
      </div>
    </div>
  )
}

export default About
