
import ChatBot from './ChatBot'

const SmartCat = () => {
  return (
    <section className="w-full bg-transparent pt-16 pb-6 px-8 md:px-12 lg:px-16 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          The AI Cat That Knows Everything
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md">
          Except How to Share the Keyboard Ask me anything. I'll answer… unless it's about dogs.
          </p>
        </div>
        <ChatBot />
      </div>
    </section>
  )
}

export default SmartCat

