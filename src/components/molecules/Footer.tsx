import { Github, Linkedin, Mail } from 'lucide-react'
import { Text } from '../atoms'
import { APP_NAME } from '../../constants'
import { useI18n } from '../../contexts/i18n'

const Footer = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Copyright */}
          <Text size="sm" className="text-white">
            © {currentYear} {APP_NAME}. {t('footer.allRightsReserved')}
          </Text>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="https://github.com/sandravlajinicmalic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label={t('footer.ariaLabel.github')}
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/sandra-vlajinic-malic-65919119b"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label={t('footer.ariaLabel.linkedin')}
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:sandravlajinicmalic@gmail.com"
              className="text-white hover:text-gray-400 transition-colors"
              aria-label={t('footer.ariaLabel.email')}
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

