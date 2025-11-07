import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Text } from '../atoms'
import { ROUTES } from '../../constants'
import { authService } from '../../services/auth'
import { useI18n } from '../../contexts/i18n'
import UserMenu from './UserMenu'

const Header = () => {
  const { t } = useI18n()
  const user = authService.getCurrentUser()
  const userNickname = user?.nickname || 'User'
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userNickname)}&background=6366f1&color=fff&size=40`

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
                
                <Trophy 
                  className="w-5 h-5 text-yellow-500 dark:text-yellow-400" 
                  strokeWidth={2}
                />
                
                <UserMenu userNickname={userNickname} userAvatar={userAvatar} />
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
