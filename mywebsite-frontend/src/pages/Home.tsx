import { Text } from '../components/atoms'
import { WebsocketCat, SmartCat, WheelOfFortuneCat } from '../components/organisms'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Text as="h1" size="5xl" weight="bold" className="mb-12 text-center text-gray-900 dark:text-white">
            Dobrodošli na moj website
          </Text>
          
          <div className="space-y-8">
            <WebsocketCat />
            <SmartCat />
            <WheelOfFortuneCat />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
