import { Button, Input, Text, Image } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import { useChatBot } from '../../hooks'

const ChatBot = () => {
  const { t } = useI18n()
  const {
    messages,
    inputValue,
    isLoading,
    messagesContainerRef,
    handleSend,
    handleClear,
    handleKeyPress,
    handleInputChange,
  } = useChatBot()

  return (
    <div className="w-full mx-auto relative flex flex-col items-center">
      {/* Input section */}
      <div className="pb-12 w-full">
        <div className="flex gap-2 max-w-2xl mx-auto w-full">
          <Input
            type="text"
            placeholder={t('chat.placeholder')}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
            variant="white"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="md"
          >
            {isLoading ? t('chat.sending') : t('chat.send')}
          </Button>
        </div>
      </div>

      {/* Layout with messages */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full px-4">
        {/* Messages section on the left */}
        <div className="w-full lg:w-2/5 max-w-lg bg-transparent rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-visible flex flex-col relative">
          {/* Arrow pointing down - visible on tablet and smaller screens (< 1024px) */}
          <div 
            className="arrow-down-light absolute left-1/2 -translate-x-1/2 -bottom-6 z-10"
            style={{
              width: 0,
              height: 0,
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderTop: '24px solid rgb(255, 255, 255)',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
          <div 
            className="arrow-down-dark absolute left-1/2 -translate-x-1/2 -bottom-6 z-10"
            style={{
              width: 0,
              height: 0,
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderTop: '24px solid rgb(31, 41, 55)',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
          {/* Arrow from message bubble to cat - visible only on desktop (≥ 1024px) */}
          <div 
            className="arrow-right-light absolute right-0 bottom-4 translate-x-full z-10"
            style={{
              width: 0,
              height: 0,
              borderTop: '24px solid transparent',
              borderBottom: '24px solid transparent',
              borderLeft: '24px solid rgb(255, 255, 255)',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))',
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent'
            }}
          />
          <div 
            className="arrow-right-dark absolute right-0 bottom-4 translate-x-full z-10"
            style={{
              width: 0,
              height: 0,
              borderTop: '24px solid transparent',
              borderBottom: '24px solid transparent',
              borderLeft: '24px solid rgb(31, 41, 55)',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
          {/* Message bubbles */}
          <div ref={messagesContainerRef} className="h-[400px] md:h-[450px] lg:h-[400px] overflow-y-auto overflow-x-hidden pl-4 pr-1 pt-4 pb-0 bg-transparent custom-scrollbar flex flex-col" style={{ scrollbarGutter: 'stable' }}>
            <div className="flex-1 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[95%] rounded-3xl px-5 py-3 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-[#06B6D4] text-white rounded-tl-sm shadow-[0_4px_6px_-1px_rgba(6,182,212,0.3),0_2px_4px_-1px_rgba(6,182,212,0.2),0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-tl-3xl rounded-bl-3xl rounded-br-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    <Text size="sm" className="whitespace-pre-wrap">
                      {message.content}
                    </Text>
                    {message.timestamp && (
                      <Text size="xs" className={`mt-1 ${message.role === 'user' ? 'text-cyan-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString('sr-RS', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl px-5 py-3 shadow-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Clear button at the bottom - fixed within scroll container */}
            <div className="sticky bottom-0 pt-4 pb-4 flex justify-end z-10 mt-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleClear}
                className="bg-black hover:bg-gray-800 text-white border-2 border-brand-pink shadow-lg"
              >
                {t('chat.clear')}
              </Button>
            </div>
          </div>
        </div>

        {/* Cat image on the right */}
        <div className="flex-shrink-0 ml-12 lg:ml-0 mt-8 lg:mt-40 flex justify-center">
          <Image
            src="/images/question.svg"
            alt={t('chat.catAlt')}
            className="w-40 h-40 md:w-56 md:h-56 lg:w-80 lg:h-80"
            objectFit="contain"
          />
        </div>
      </div>
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
        
        /* Arrow pointing down - visible on tablet and smaller screens (< 1024px) */
        .arrow-down-light {
          display: block;
        }
        .arrow-down-dark {
          display: none;
        }
        @media (min-width: 1024px) {
          .arrow-down-light,
          .arrow-down-dark {
            display: none !important;
          }
        }
        @media (prefers-color-scheme: dark) {
          .arrow-down-light {
            display: none;
          }
          .arrow-down-dark {
            display: block;
          }
          @media (min-width: 1024px) {
            .arrow-down-dark {
              display: none !important;
            }
          }
        }
        
        /* Arrow pointing right - visible only on desktop (≥ 1024px) */
        .arrow-right-light {
          display: none;
        }
        .arrow-right-dark {
          display: none;
        }
        @media (min-width: 1024px) {
          .arrow-right-light {
            display: block;
          }
        }
        @media (min-width: 1024px) and (prefers-color-scheme: dark) {
          .arrow-right-light {
            display: none;
          }
          .arrow-right-dark {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}

export default ChatBot

