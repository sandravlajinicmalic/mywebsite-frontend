import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Text } from '../atoms'
import { ROUTES } from '../../constants'
import { authService } from '../../services/auth'
import { useI18n } from '../../contexts/i18n'
import UserMenu from './UserMenu'
import Modal from './Modal'
import { useState, useEffect } from 'react'
import { wheelService, type WheelSpin } from '../../services'

const Header = () => {
  const { t } = useI18n()
  const user = authService.getCurrentUser()
  const userNickname = user?.nickname || 'User'
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userNickname)}&background=6366f1&color=fff&size=40`
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [spinHistory, setSpinHistory] = useState<WheelSpin[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

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

  // Refresh history when modal is open (in case new spin happened)
  useEffect(() => {
    if (isHistoryModalOpen && user) {
      const refreshInterval = setInterval(async () => {
        try {
          const history = await wheelService.getHistory()
          setSpinHistory(history)
        } catch (error) {
          console.error('Error refreshing spin history:', error)
        }
      }, 3000) // Refresh every 3 seconds while modal is open

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

  return (
    <header className="bg-transparent sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div></div>
          
          <nav className="flex items-center gap-6">
            <Link 
              to={ROUTES.HOME}
              className="text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline-offset-4 uppercase cursor-pointer"
              style={{ fontFamily: '"Barlow Semi Condensed", sans-serif' }}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to={ROUTES.ABOUT}
              className="text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline-offset-4 uppercase cursor-pointer"
              style={{ fontFamily: '"Barlow Semi Condensed", sans-serif' }}
            >
              {t('nav.about')}
            </Link>
            
            {/* User Info */}
            {user && (
              <>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <div className="flex items-center gap-6 px-1">
                <Text size="base" weight="medium" className="text-gray-900 dark:text-white">
                  {userNickname}
                </Text>
                
                <button
                  onClick={handleTrophyClick}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  aria-label="Prikaži istoriju nagrada"
                >
                  <Trophy 
                    className="w-5 h-5 text-yellow-500 dark:text-yellow-400" 
                    strokeWidth={2}
                  />
                </button>
                
                <UserMenu userNickname={userNickname} userAvatar={userAvatar} />
                </div>
              </>
            )}
          </nav>
        </div>
      </div>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Istorija nagrada"
        size="md"
      >
        <div className="py-4">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center py-8">
              <Text className="text-gray-600 dark:text-gray-400">Učitavanje...</Text>
            </div>
          ) : spinHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Još niste osvojili nijednu nagradu. Zavrtite točak da biste osvojili nagradu!
              </Text>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {spinHistory.map((spin) => (
                <div
                  key={spin.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-1">
                    <Text 
                      size="lg" 
                      weight="semibold" 
                      className="text-indigo-600 dark:text-indigo-400 mb-1"
                    >
                      {spin.reward}
                    </Text>
                    <Text 
                      size="sm" 
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {formatDate(spin.created_at)}
                    </Text>
                  </div>
                  <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400 ml-4" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </header>
  )
}

export default Header
