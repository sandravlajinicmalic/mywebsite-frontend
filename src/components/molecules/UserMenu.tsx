import { useState, useRef, useEffect } from 'react'
import { LogOut, Globe, Trash2, Cat } from 'lucide-react'
import { Text } from '../atoms'
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
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { t, language, setLanguage } = useI18n()
  const navigate = useNavigate()

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const handleDeleteProfile = () => {
    // TODO: Implement delete profile functionality
    console.log('Delete profile clicked')
    setIsOpen(false)
  }

  const handleLanguageChange = (lang: 'sr' | 'en') => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Shadow style for avatar button when scrolled
  const dropShadowStyle = {
    filter: isScrolled
      ? 'drop-shadow(0 0 2px rgba(0,0,0,0.8)) drop-shadow(0 0 4px rgba(0,0,0,0.6))'
      : 'drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))',
    transition: 'filter 0.4s ease-in-out'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 dark:border-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
        style={dropShadowStyle}
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
        <div 
          className="absolute right-0 mt-2 w-56 bg-black rounded-lg z-50 flex flex-col"
          style={{ boxShadow: '0 0 15px rgba(244, 114, 182, 0.3), 0 0 30px rgba(244, 114, 182, 0.2)' }}
        >
          {/* User Info */}
          <div className="px-4 border-b py-4" style={{ borderColor: 'rgba(244, 114, 182, 0.5)' }}>
            <div className="flex items-center gap-2">
              <Cat className="w-5 h-5 text-white" />
              <Text size="sm" weight="medium" className="text-white">
                {userNickname}
              </Text>
            </div>
          </div>

          {/* Language Selector */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-white" />
              <Text size="sm" weight="medium" className="text-white">
                {t('nav.language')}
              </Text>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('sr')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#374151] ${
                  language === 'sr'
                    ? 'bg-[#374151] hover:bg-[#4b5563] text-[#FFFFFF] border-2 border-[#06B6D4]'
                    : 'bg-[#374151] hover:bg-[#4b5563] text-[#FFFFFF]'
                }`}
              >
                {t('nav.language.sr')}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#374151] ${
                  language === 'en'
                    ? 'bg-[#374151] hover:bg-[#4b5563] text-[#FFFFFF] border-2 border-[#06B6D4]'
                    : 'bg-[#374151] hover:bg-[#4b5563] text-[#FFFFFF]'
                }`}
              >
                {t('nav.language.en')}
              </button>
            </div>
          </div>

          {/* Delete Profile Button */}
          <div className="px-4 border-t py-2" style={{ borderColor: 'rgba(244, 114, 182, 0.5)' }}>
            <button
              onClick={handleDeleteProfile}
              className="w-full flex items-center gap-2 pt-2 text-sm font-medium text-white bg-transparent hover:text-[#06B6D4] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="ml-[3px]">{t('nav.deleteProfile')}</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="px-4 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 pb-2 text-sm font-medium text-white bg-transparent hover:text-[#06B6D4] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 ml-[2px]" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu

