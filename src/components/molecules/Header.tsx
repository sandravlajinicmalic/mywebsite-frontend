import { Link, useNavigate } from 'react-router-dom'
import { Trophy, LogOut } from 'lucide-react'
import { Button, Image, Text } from '../atoms'
import { ROUTES, APP_NAME } from '../../constants'
import { authService } from '../../services/auth'

const Header = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const userNickname = user?.nickname || 'User'
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userNickname)}&background=6366f1&color=fff&size=40`

  const handleLogout = () => {
    authService.logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link 
            to={ROUTES.HOME} 
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {APP_NAME}
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to={ROUTES.HOME}>
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
            <Link to={ROUTES.ABOUT}>
              <Button variant="outline" size="sm">
                About
              </Button>
            </Link>
            
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                <Text size="base" weight="medium" className="text-gray-900 dark:text-white">
                  {userNickname}
                </Text>
                
                <Trophy 
                  className="w-5 h-5 text-yellow-500 dark:text-yellow-400" 
                  strokeWidth={2}
                />
                
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 dark:border-indigo-400">
                  <Image
                    src={userAvatar}
                    alt={`${userNickname} avatar`}
                    roundedFull
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
