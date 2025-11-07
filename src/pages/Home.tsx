import { WebsocketCat, SmartCat, WheelOfFortuneCat } from '../components/organisms'

const Home = () => {
  
  return (
    <div className="min-h-screen relative">
      <div className="w-full relative z-10">
        <WebsocketCat />
        <SmartCat />
        <WheelOfFortuneCat />
      </div>
    </div>
  )
}

export default Home
