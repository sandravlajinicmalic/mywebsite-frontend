import { Github, Linkedin } from 'lucide-react'
import { Text } from '../atoms'
import { APP_NAME } from '../../constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Copyright */}
          <Text size="sm" className="text-white">
            © {currentYear} {APP_NAME}. All rights reserved.
          </Text>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

