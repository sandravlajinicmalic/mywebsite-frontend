import { useState, useRef, useEffect } from 'react'
import { LogOut, Globe, Trash2, Cat } from 'lucide-react'
import { Text, Button } from '../atoms'
import { Modal } from './'
import { useI18n } from '../../contexts/i18n'
import { authService } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { disconnectSocket } from '../../services/socket'

interface UserMenuProps {
  userNickname: string
  userAvatar: string
}

const UserMenu = ({ userNickname, userAvatar }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
    // Disconnect socket if connected
    disconnectSocket()
    // Logout user
    authService.logout()
    // Close menu
    setIsOpen(false)
    // Navigate to login page and reload
    window.location.href = ROUTES.LOGIN
  }

  const handleDeleteProfile = () => {
    setIsDeleteModalOpen(true)
    setIsOpen(false)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await authService.deleteAccount()
      // Close modal first
      setIsDeleteModalOpen(false)
      setIsDeleting(false)
      // Navigate to login after successful deletion
      navigate(ROUTES.LOGIN, { replace: true })
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Error deleting account:', error)
      setIsDeleting(false)
      alert(
        error instanceof Error 
          ? error.message 
          : (t('nav.deleteProfile.error') || 'Failed to delete account. Please try again.')
      )
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setIsDeleting(false)
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
          className="absolute right-0 mt-2 w-56 bg-black rounded-lg z-50 flex flex-col shadow-[0_0_15px_rgba(244,114,182,0.3),0_0_30px_rgba(244,114,182,0.2)]"
        >
          {/* User Info */}
          <div className="px-4 border-b border-[rgba(244,114,182,0.5)] py-4">
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
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4] ${
                  language === 'sr'
                    ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white'
                    : 'bg-brand-gray-dark hover:bg-[#0891B2] text-white border-2 border-[#06B6D4]'
                }`}
              >
                {t('nav.language.sr')}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4] ${
                  language === 'en'
                    ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white'
                    : 'bg-brand-gray-dark hover:bg-[#0891B2] text-white border-2 border-[#06B6D4]'
                }`}
              >
                {t('nav.language.en')}
              </button>
            </div>
          </div>

          {/* Delete Profile Button */}
          <div className="px-4 border-t border-[rgba(244,114,182,0.5)] py-2">
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

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title="Danger Zone Ahead!"
        size="md"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleDeleteConfirm}
              className="flex-1 bg-black"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Anyway'}
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteCancel}
              className="flex-1"
              disabled={isDeleting}
            >
              Never Mind
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-center">
          <Text size="base" className="text-white">
            This action can't be undone — unless you know time travel (in which case, cool).
          </Text>
          <Text size="base" className="text-white">
            Proceed with caution… and regret later.
          </Text>
        </div>
      </Modal>
    </div>
  )
}

export default UserMenu

