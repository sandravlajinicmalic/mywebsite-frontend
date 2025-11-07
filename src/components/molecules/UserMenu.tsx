import { useState, useRef, useEffect } from 'react'
import { LogOut, Globe } from 'lucide-react'
import { Button, Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import { authService } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'

interface UserMenuProps {
  userNickname: string
  userAvatar: string
}

const UserMenu = ({ userNickname, userAvatar }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { t, language, setLanguage } = useI18n()
  const navigate = useNavigate()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    authService.logout()
    navigate(ROUTES.LOGIN)
    setIsOpen(false)
  }

  const handleLanguageChange = (lang: 'sr' | 'en') => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 dark:border-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
        aria-label="User menu"
      >
        <img
          src={userAvatar}
          alt={`${userNickname} avatar`}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Text size="sm" weight="medium" className="text-gray-900 dark:text-white">
              {userNickname}
            </Text>
          </div>

          {/* Language Selector */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <Text size="sm" weight="medium" className="text-gray-700 dark:text-gray-300">
                {t('nav.language')}
              </Text>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('sr')}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                  language === 'sr'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('nav.language.sr')}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('nav.language.en')}
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu

