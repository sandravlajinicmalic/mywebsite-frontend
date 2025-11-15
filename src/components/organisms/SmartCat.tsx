import ChatBot from './ChatBot'
import { useI18n } from '../../contexts/i18n'

const SmartCat = () => {
  const { t } = useI18n()
  return (
    <section className="w-full bg-transparent pt-24 pb-6 px-8 md:px-12 lg:px-16 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h2 className="text-5xl font-bold text-black mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(0, 0, 0, 0.2)', lineHeight: '1.3' }}>
          {t('smartCat.title')}
          </h2>
          <p className="text-xl text-black max-w-lg drop-shadow-sm">
          {t('smartCat.subtitle')}
          </p>
        </div>
        <ChatBot />
      </div>
    </section>
  )
}

export default SmartCat

