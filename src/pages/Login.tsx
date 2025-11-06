import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Text } from '../components/atoms'
import { ROUTES } from '../constants'

const Login = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Za sada samo prebacuje na Home stranicu
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <Text as="h1" size="4xl" weight="bold" className="mb-2 text-center text-gray-900 dark:text-white">
            Dobrodošli
          </Text>
          <Text size="base" color="muted" className="mb-8 text-center">
            Unesite vaše podatke da biste nastavili
          </Text>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Nickname"
              placeholder="Unesite vaš nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email adresa"
              placeholder="Unesite vašu email adresu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full"
            >
              Next
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

