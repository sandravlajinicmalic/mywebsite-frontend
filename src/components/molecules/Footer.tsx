import { Link } from 'react-router-dom'
import { Text } from '../atoms'
import { ROUTES, APP_NAME } from '../../constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Text as="h3" size="lg" weight="bold" className="mb-4 text-white">
              {APP_NAME}
            </Text>
            <Text size="sm" className="text-gray-400">
              Jednostavan i moderan website izgrađen sa React, TypeScript i Tailwind CSS.
            </Text>
          </div>

          {/* Links Section */}
          <div>
            <Text as="h3" size="lg" weight="bold" className="mb-4 text-white">
              Navigacija
            </Text>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={ROUTES.HOME}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to={ROUTES.ABOUT}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Copyright Section */}
          <div>
            <Text as="h3" size="lg" weight="bold" className="mb-4 text-white">
              Informacije
            </Text>
            <Text size="sm" className="text-gray-400">
              © {currentYear} {APP_NAME}. Sva prava zadržana.
            </Text>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <Text size="sm" className="text-gray-400">
            Izgrađeno sa ❤️ koristeći Atomic Design pattern
          </Text>
        </div>
      </div>
    </footer>
  )
}

export default Footer

