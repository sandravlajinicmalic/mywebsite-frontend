import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Text } from '../atoms'
import { ROUTES } from '../../constants'
import { authService } from '../../services/auth'
import { useI18n } from '../../contexts/i18n'
import UserMenu from './UserMenu'
import Modal from './Modal'
import { useState, useEffect, useMemo } from 'react'
import { wheelService, type WheelSpin } from '../../services'

// Function to get random avatar icon based on user identifier (consistent for same user)
const getUserAvatarIcon = (userId: string | undefined, nickname: string): string => {
  const identifier = userId || nickname || 'default'
  
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Get absolute value and map to 1-10 range
  const catNumber = (Math.abs(hash) % 10) + 1
  return `/images/user-profile-icons/cat${catNumber}.svg`
}

const Header = () => {
  const { t } = useI18n()
  const user = authService.getCurrentUser()
  const userNickname = user?.nickname || 'User'
  const userAvatar = useMemo(() => getUserAvatarIcon(user?.id, userNickname), [user?.id, userNickname])
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [spinHistory, setSpinHistory] = useState<WheelSpin[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleTrophyClick = async () => {
    if (!user) return
    
    setIsHistoryModalOpen(true)
    setIsLoadingHistory(true)
    
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Shadow styles for scrolled state with smooth transition
  const textShadowStyle = {
    textShadow: isScrolled 
      ? '0 0 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.85)'
      : '0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)',
    transition: 'text-shadow 0.4s ease-in-out'
  }

  const dropShadowStyle = {
    filter: isScrolled
      ? 'drop-shadow(0 0 3px rgba(0,0,0,1)) drop-shadow(0 0 6px rgba(0,0,0,0.95)) drop-shadow(0 0 10px rgba(0,0,0,0.9)) drop-shadow(0 0 14px rgba(0,0,0,0.85))'
      : 'drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))',
    transition: 'filter 0.4s ease-in-out'
  }

  const smallDropShadowStyle = {
    filter: isScrolled
      ? 'drop-shadow(0 0 2px rgba(0,0,0,0.8)) drop-shadow(0 0 4px rgba(0,0,0,0.6))'
      : 'drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))',
    transition: 'filter 0.4s ease-in-out'
  }

  return (
    <header className="bg-transparent sticky top-0 z-50">
      <div className="container mx-auto px-4 pr-4">
        <div className="flex justify-between items-center py-4">
          <div></div>
          
          <nav className="flex items-center gap-6">
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
                  style={textShadowStyle}
                >
                  {userNickname}
                </Text>
                
                <button
                  onClick={handleTrophyClick}
                  className="cursor-pointer hover:scale-110 transition-all"
                  style={smallDropShadowStyle}
                  aria-label={t('header.rewardHistoryAriaLabel')}
                >
                  <Trophy 
                    className="w-5 h-5 text-white" 
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
        </div>
      </div>

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
            No cats were bribed in the making of these rewards.
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
            <Trophy className="w-16 h-16 text-[#f472b6] mb-4" />
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
