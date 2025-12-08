import { Link } from 'react-router-dom'
import { Trophy, Menu, X, LogOut, Globe, Trash2, Cat } from 'lucide-react'
import { Text, Button } from '../atoms'
import { ROUTES } from '../../constants'
import { authService } from '../../services/auth'
import { useI18n } from '../../contexts/i18n'
import UserMenu from './UserMenu'
import Modal from './Modal'
import { useState, useEffect, useMemo, useRef } from 'react'
import { wheelService, userService, type WheelSpin } from '../../services'
import { getUserDefaultAvatar } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { disconnectSocket } from '../../services/socket'

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const Header = () => {
  const { t, language, setLanguage } = useI18n()
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const userNickname = user?.nickname || t('header.defaultNickname')
  
  // Calculate default avatar based on user ID/nickname to avoid flash of wrong avatar
  const defaultAvatar = useMemo(() => {
    return getUserDefaultAvatar(user?.id, userNickname)
  }, [user?.id, userNickname])
  
  const [userAvatar, setUserAvatar] = useState<string>(defaultAvatar)
  const [nicknameReward, setNicknameReward] = useState<{ style?: string; prefix?: string; fontSize?: string } | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [spinHistory, setSpinHistory] = useState<WheelSpin[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const avatarExpirationTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Update default avatar when user changes
  useEffect(() => {
    if (user && userAvatar === defaultAvatar) {
      // Only update if we're still using default avatar
      setUserAvatar(defaultAvatar)
    }
  }, [defaultAvatar, user])

  // Fetch active rewards from backend
  useEffect(() => {
    const fetchRewards = async () => {
      if (!user) return
      
      try {
        // Fetch avatar
        const avatarData = await userService.getActiveAvatar()
        const previousAvatar = userAvatar
        
        // Check if avatar reward is expired
        const isAvatarExpired = avatarData.isTemporary && avatarData.expiresAt 
          ? new Date(avatarData.expiresAt) < new Date()
          : false
        
        // Use original avatar if temporary avatar expired, otherwise use the avatar from response
        const avatarToUse = (avatarData.isTemporary && isAvatarExpired) 
          ? avatarData.originalAvatar 
          : avatarData.avatar
        
        if (previousAvatar !== avatarToUse) {
          console.log('🔄 Avatar changed:', {
            from: previousAvatar,
            to: avatarToUse,
            isTemporary: avatarData.isTemporary && !isAvatarExpired,
            expiresAt: avatarData.expiresAt,
            originalAvatar: avatarData.originalAvatar
          })
        }
        
        setUserAvatar(avatarToUse)
        
        // Clear existing avatar expiration timer
        if (avatarExpirationTimerRef.current) {
          clearTimeout(avatarExpirationTimerRef.current)
          avatarExpirationTimerRef.current = null
        }
        
        // Set up timer to automatically revert avatar when it expires
        if (avatarData.isTemporary && avatarData.expiresAt && !isAvatarExpired) {
          const expiresIn = new Date(avatarData.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            avatarExpirationTimerRef.current = setTimeout(() => {
              console.log('🔄 Avatar reward expired, reverting to default:', avatarData.originalAvatar)
              setUserAvatar(avatarData.originalAvatar)
              // Also refresh rewards to get updated state
              fetchRewards()
            }, expiresIn)
          }
        }

        // Fetch all active rewards to check for nickname rewards
        const activeRewards = await userService.getActiveRewards()
        const nicknameRewardData = activeRewards.nickname
        
        // Check if nickname reward is expired
        const isNicknameExpired = nicknameRewardData?.expiresAt 
          ? new Date(nicknameRewardData.expiresAt) < new Date()
          : true
        
        if (nicknameRewardData && nicknameRewardData.value && !isNicknameExpired) {
          const previousReward = nicknameReward
          const newReward = nicknameRewardData.value
          
          if (JSON.stringify(previousReward) !== JSON.stringify(newReward)) {
            console.log('🔄 Nickname reward changed:', {
              from: previousReward,
              to: newReward,
              expiresAt: nicknameRewardData.expiresAt
            })
          }
          
          setNicknameReward(newReward)
        } else {
          if (nicknameReward !== null) {
            console.log('🔄 Nickname reward expired, using default')
          }
          setNicknameReward(null)
        }
      } catch (error) {
        console.error('Error fetching rewards:', error)
      }
    }

    fetchRewards()

    // Refresh rewards every 5 seconds to check for expired rewards (more frequent check for accurate expiration)
    const interval = setInterval(fetchRewards, 5000)
    
    // Also listen for custom event to refresh rewards immediately when reward is activated
    const handleRewardActivated = () => {
      // Fetch immediately for faster avatar update
      fetchRewards()
    }
    window.addEventListener('reward-activated', handleRewardActivated)

    return () => {
      clearInterval(interval)
      window.removeEventListener('reward-activated', handleRewardActivated)
      // Clear avatar expiration timer on unmount
      if (avatarExpirationTimerRef.current) {
        clearTimeout(avatarExpirationTimerRef.current)
        avatarExpirationTimerRef.current = null
      }
    }
  }, [user, userAvatar, nicknameReward])

  const handleTrophyClick = async () => {
    if (!user) return
    
    setIsHistoryModalOpen(true)
    setIsLoadingHistory(true)
    setIsSideMenuOpen(false) // Close side menu when opening modal
    
    // Always refresh history when opening modal
    try {
      const history = await wheelService.getHistory()
      setSpinHistory(history)
    } catch (error) {
      console.error('Error fetching spin history:', error)
      setSpinHistory([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleLogout = () => {
    // Disconnect socket if connected
    disconnectSocket()
    // Logout user
    authService.logout()
    // Close side menu
    setIsSideMenuOpen(false)
    // Navigate to login page and reload
    window.location.href = ROUTES.LOGIN
  }

  const handleDeleteProfile = () => {
    setIsDeleteModalOpen(true)
    setIsSideMenuOpen(false)
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
      // error.message is already a translation key from the service
      const errorMessage = error instanceof Error 
        ? (error.message ? t(error.message) : t('nav.deleteProfile.error'))
        : t('nav.deleteProfile.error')
      alert(errorMessage)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setIsDeleting(false)
  }

  const handleLanguageChange = (lang: 'sr' | 'en') => {
    setLanguage(lang)
  }

  // Close side menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isSideMenuOpen && !target.closest('.side-menu') && !target.closest('.hamburger-button')) {
        setIsSideMenuOpen(false)
      }
    }

    if (isSideMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isSideMenuOpen])

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Refresh history when modal is open (in case new spin happened)
  useEffect(() => {
    if (isHistoryModalOpen && user) {
      const refreshInterval = setInterval(async () => {
        try {
          const history = await wheelService.getHistory()
          // Only update if history actually changed to prevent unnecessary re-renders
          setSpinHistory(prevHistory => {
            if (JSON.stringify(prevHistory) !== JSON.stringify(history)) {
              return history
            }
            return prevHistory
          })
        } catch (error) {
          console.error('Error refreshing spin history:', error)
        }
      }, 5000) // Refresh every 5 seconds while modal is open (reduced frequency)

      return () => clearInterval(refreshInterval)
    }
  }, [isHistoryModalOpen, user])

  // Memoize shadow styles to avoid recalculation on every render
  const textShadowStyle = useMemo(() => ({
    textShadow: isScrolled 
      ? '0 0 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.85)'
      : '0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)',
    transition: 'text-shadow 0.4s ease-in-out'
  }), [isScrolled])

  const dropShadowStyle = useMemo(() => ({
    filter: isScrolled
      ? 'drop-shadow(0 0 3px rgba(0,0,0,1)) drop-shadow(0 0 6px rgba(0,0,0,0.95)) drop-shadow(0 0 10px rgba(0,0,0,0.9)) drop-shadow(0 0 14px rgba(0,0,0,0.85))'
      : 'drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))',
    transition: 'filter 0.4s ease-in-out'
  }), [isScrolled])

  const smallDropShadowStyle = useMemo(() => ({
    filter: isScrolled
      ? 'drop-shadow(0 0 2px rgba(0,0,0,0.8)) drop-shadow(0 0 4px rgba(0,0,0,0.6))'
      : 'drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))',
    transition: 'filter 0.4s ease-in-out'
  }), [isScrolled])

  return (
    <header className="bg-transparent sticky top-0 z-50">
      <div className="container mx-auto px-4 pr-4">
        <div className="flex justify-between items-center py-4">
          <div></div>
          
          {/* Desktop Navigation - hidden on tablet and mobile */}
          <nav className="hidden lg:flex items-center gap-6 justify-end">
            <Link 
              to={ROUTES.HOME}
              className="text-base font-medium text-gray-900 dark:text-white hover:text-[#06B6D4] transition-all underline-offset-4 uppercase cursor-pointer"
              style={{ 
                fontFamily: '"Barlow Semi Condensed", sans-serif',
                ...textShadowStyle
              }}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to={ROUTES.ABOUT}
              className="text-base font-medium text-gray-900 dark:text-white hover:text-[#06B6D4] transition-all underline-offset-4 uppercase cursor-pointer"
              style={{ 
                fontFamily: '"Barlow Semi Condensed", sans-serif',
                ...textShadowStyle
              }}
            >
              {t('nav.about')}
            </Link>
            
            {/* User Info */}
            {user && (
              <>
                <div 
                  className="w-1 h-1 rounded-full bg-white mx-2 transition-all"
                  style={dropShadowStyle}
                ></div>
                <div className="flex items-center gap-8">
                <Text 
                  size="base" 
                  weight="medium" 
                  className="text-gray-900 dark:text-white transition-all"
                  style={{
                    ...textShadowStyle,
                    fontStyle: nicknameReward?.style === 'cursive' ? 'italic' : 'normal',
                    fontFamily: nicknameReward?.style === 'cursive' 
                      ? '"Brush Script MT", "Lucida Handwriting", cursive' 
                      : undefined,
                    fontSize: nicknameReward?.fontSize 
                      ? `${parseFloat(nicknameReward.fontSize)}em` 
                      : undefined
                  }}
                >
                  {nicknameReward?.prefix ? `${nicknameReward.prefix} ` : ''}{userNickname}
                </Text>
                
                <button
                  onClick={handleTrophyClick}
                  className="cursor-pointer hover:scale-110 transition-all"
                  style={smallDropShadowStyle}
                  aria-label={t('header.rewardHistoryAriaLabel')}
                >
                  <Trophy 
                    className="w-5 h-5 text-white hover:text-[#06B6D4] transition-colors" 
                    strokeWidth={2}
                  />
                </button>
                
                <div>
                  <UserMenu userNickname={userNickname} userAvatar={userAvatar} />
                </div>
                </div>
              </>
            )}
          </nav>

          {/* Hamburger Button - visible on tablet and mobile (768px+) */}
          {user && (
            <button
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
              className="lg:hidden hamburger-button cursor-pointer p-2 text-white hover:text-[#06B6D4] transition-colors"
              style={smallDropShadowStyle}
              aria-label={t('header.menuAriaLabel') || 'Menu'}
            >
              {isSideMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={2} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSideMenuOpen(false)}
        />
      )}

      {/* Side Menu - visible on tablet and mobile (768px+) */}
      <div 
        className={`side-menu fixed top-0 right-0 h-full w-80 bg-black z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.5)',
          borderLeft: '1px solid rgba(244, 114, 182, 0.5)'
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header with close button */}
          <div className="flex justify-end items-center p-4">
            <button
              onClick={() => setIsSideMenuOpen(false)}
              className="text-white hover:text-[#06B6D4] transition-colors p-2"
              aria-label={t('header.closeMenu') || 'Close menu'}
            >
              <X className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          {/* User Info Section - First */}
          {user && (
            <>
              {/* User Avatar and Nickname */}
              <div className="p-4 border-t border-b border-[rgba(244,114,182,0.5)]">
                <div className="flex items-center justify-start gap-3">
                  <img
                    src={userAvatar}
                    alt={`${userNickname} avatar`}
                    className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
                  />
                  <div className="flex flex-col items-start">
                    <Text 
                      size="base" 
                      weight="medium" 
                      className="text-white text-left"
                      style={{
                        fontStyle: nicknameReward?.style === 'cursive' ? 'italic' : 'normal',
                        fontFamily: nicknameReward?.style === 'cursive' 
                          ? '"Brush Script MT", "Lucida Handwriting", cursive' 
                          : undefined,
                        fontSize: nicknameReward?.fontSize 
                          ? `${parseFloat(nicknameReward.fontSize)}em` 
                          : undefined
                      }}
                    >
                      {nicknameReward?.prefix ? `${nicknameReward.prefix} ` : ''}{userNickname}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Navigation Links - Second */}
              <div className="flex flex-col p-4 border-b border-[rgba(244,114,182,0.5)]">
                <Link
                  to={ROUTES.HOME}
                  onClick={() => setIsSideMenuOpen(false)}
                  className="text-base font-medium text-white hover:text-[#06B6D4] transition-all uppercase py-3 px-2 text-left"
                  style={{ 
                    fontFamily: '"Barlow Semi Condensed", sans-serif',
                  }}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to={ROUTES.ABOUT}
                  onClick={() => setIsSideMenuOpen(false)}
                  className="text-base font-medium text-white hover:text-[#06B6D4] transition-all uppercase py-3 px-2 text-left"
                  style={{ 
                    fontFamily: '"Barlow Semi Condensed", sans-serif',
                  }}
                >
                  {t('nav.about')}
                </Link>
              </div>

              {/* Trophy Button */}
              <div className="px-4 pt-4 pb-2">
                <button
                  onClick={handleTrophyClick}
                  className="w-full flex items-center justify-start gap-3 text-white hover:text-[#06B6D4] transition-colors py-2"
                >
                  <Trophy className="w-5 h-5" strokeWidth={2} />
                  <Text size="base" weight="medium">
                    {t('header.rewardHistoryTitle')}
                  </Text>
                </button>
              </div>

              {/* Language Selector */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-start gap-3">
                  <Globe className="w-5 h-5 text-white" />
                  <button
                    onClick={() => handleLanguageChange(language === 'sr' ? 'en' : 'sr')}
                    className="flex items-center gap-2 text-white hover:text-[#06B6D4] transition-colors cursor-pointer"
                  >
                    <span className={`text-base font-medium ${language === 'sr' ? 'text-[#06B6D4]' : 'text-white'}`}>
                      SR
                    </span>
                    <span className="text-white">/</span>
                    <span className={`text-base font-medium ${language === 'en' ? 'text-[#06B6D4]' : 'text-white'}`}>
                      EN
                    </span>
                  </button>
                </div>
              </div>

              {/* Delete Profile Button */}
              <div className="px-4 pt-2 pb-4 border-b border-[rgba(244,114,182,0.5)]">
                <button
                  onClick={handleDeleteProfile}
                  className="w-full flex items-center justify-start gap-3 text-white hover:text-red-400 transition-colors py-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <Text size="base" weight="medium">
                    {t('nav.deleteProfile')}
                  </Text>
                </button>
              </div>

              {/* Logout Button */}
              <div className="p-4 mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-end gap-3 text-white hover:text-[#06B6D4] transition-colors py-2"
                >
                  <Text size="base" weight="medium">
                    {t('nav.logout')}
                  </Text>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reward History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-white" />
            <Text as="h3" size="2xl" weight="bold" className="text-white">
              {t('header.rewardHistoryTitle')}
            </Text>
          </div>
        }
        footer={
          <Text size="sm" weight="normal" className="text-white text-center italic">
            {t('header.footerMessage')}
          </Text>
        }
        size="md"
        disableBodyScroll={true}
      >
        {isLoadingHistory ? (
          <div className="flex justify-center items-center py-8 m-6">
            <Text className="text-white">{t('header.loading')}</Text>
          </div>
        ) : spinHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 m-6">
            <Trophy className="w-16 h-16 text-brand-pink-light mb-4" />
            <Text className="text-white text-center">
              {t('header.noRewards')}
            </Text>
          </div>
        ) : (
          <div 
            className={`space-y-3 my-6 ml-6 mr-[5px] ${spinHistory.length > 5 ? 'overflow-y-scroll max-h-[200px] min-h-0 custom-scrollbar' : ''}`}
            style={{ 
              scrollbarGutter: 'stable', 
              maxHeight: spinHistory.length > 5 ? '200px' : 'none',
              overflowY: spinHistory.length > 5 ? 'scroll' : 'visible',
              display: 'block'
            }}
          >
            {spinHistory.map((spin) => (
              <div
                key={spin.id}
                className="flex items-center justify-between gap-4 mr-6"
              >
                <Text 
                  size="lg" 
                  weight="semibold" 
                  className="text-white"
                >
                  {spin.reward}
                </Text>
                <Text 
                  size="sm" 
                  className="text-gray-300"
                >
                  {formatDate(spin.created_at)}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title={t('userMenu.deleteModal.title')}
        size="md"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleDeleteConfirm}
              className="flex-1 bg-black"
              disabled={isDeleting}
            >
              {isDeleting ? t('userMenu.deleteModal.deleting') : t('userMenu.deleteModal.deleteButton')}
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteCancel}
              className="flex-1"
              disabled={isDeleting}
            >
              {t('userMenu.deleteModal.cancelButton')}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-center">
          <Text size="base" className="text-white">
            {t('userMenu.deleteModal.message1')}
          </Text>
          <Text size="base" className="text-white">
            {t('userMenu.deleteModal.message2')}
          </Text>
        </div>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af transparent;
        }
      `}</style>
    </header>
  )
}

export default Header
