import { AboutMe, AboutProject, ContactForm } from '../components/organisms'

const About = () => {
  
  return (
    <div className="min-h-screen relative">
      <div className="w-full relative z-10">
        <AboutMe />
        <AboutProject />
        <ContactForm />
      </div>
    </div>
  )
}

export default About
