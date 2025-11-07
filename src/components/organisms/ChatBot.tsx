import { useState, useRef, useEffect } from 'react'
import { Button, Input, Text, Image } from '../atoms'
import { chatService, type ChatMessage } from '../../services/chat'

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Zdravo! 😸 Ja sam AI chatbot koji razgovara samo o mačkama!',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    console.log('[CHATBOT] Send button clicked', { inputValue, isLoading })
    
    if (!inputValue.trim() || isLoading) {
      console.log('[CHATBOT] Cannot send - empty input or already loading')
      return
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    console.log('[CHATBOT] Sending message:', userMessage.content)

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      console.log('[CHATBOT] Calling chatService.sendMessage...')
      const response = await chatService.sendMessage(userMessage.content)
      console.log('[CHATBOT] Received response:', response)
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      }

      console.log('[CHATBOT] Adding assistant message to chat')
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('[CHATBOT] Chat error:', error)
      console.error('[CHATBOT] Error details:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Izvinjavam se, došlo je do greške. Pokušaj ponovo! 😸',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      console.log('[CHATBOT] Request completed, loading set to false')
    }
  }

  const handleClear = async () => {
    try {
      await chatService.clearHistory()
      setMessages([
        {
          role: 'assistant',
          content: 'Postavi mi bilo koje pitanje o mačkama, njihovom ponašanju, zdravlju, negi ili bilo čemu što se tiče mačaka.',
          timestamp: new Date()
        }
      ])
    } catch (error) {
      console.error('Clear history error:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only text characters: letters, numbers, spaces, and basic punctuation
    const textOnly = e.target.value.replace(/[^\p{L}\p{N}\s.,!?;:'"()-]/gu, '')
    setInputValue(textOnly)
  }

  return (
    <div className="w-full mx-auto relative flex flex-col items-center">
      {/* Input sekcija */}
      <div className="pb-12 w-full">
        <div className="flex gap-2 max-w-2xl mx-auto w-full">
          <Input
            type="text"
            placeholder="Postavi pitanje o mačkama..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="md"
          >
            {isLoading ? 'Šalje...' : 'Pošalji'}
          </Button>
        </div>
      </div>

      {/* Layout sa messages */}
      <div className="flex gap-8 items-start justify-center w-full">
        {/* Messages sekcija sa lijeve strane */}
        <div className="w-2/5 max-w-lg bg-transparent rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-visible flex flex-col relative">
          {/* Strelica oblačića prema mački */}
          <div 
            className="absolute right-0 bottom-4 translate-x-full z-10"
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
            className="absolute right-0 bottom-4 translate-x-full z-10 hidden dark:block"
            style={{
              width: 0,
              height: 0,
              borderTop: '24px solid transparent',
              borderBottom: '24px solid transparent',
              borderLeft: '24px solid rgb(31, 41, 55)',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
          {/* Messages oblačići */}
          <div ref={messagesContainerRef} className="h-[400px] overflow-y-auto overflow-x-hidden pl-4 pr-1 pt-4 pb-0 bg-transparent custom-scrollbar flex flex-col" style={{ scrollbarGutter: 'stable' }}>
            <div className="flex-1 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[95%] rounded-3xl px-5 py-3 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tl-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-tl-3xl rounded-bl-3xl rounded-br-sm'
                    }`}
                    style={{
                      boxShadow: message.role === 'user' 
                        ? '0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -1px rgba(79, 70, 229, 0.2)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <Text size="sm" className="whitespace-pre-wrap">
                      {message.content}
                    </Text>
                    {message.timestamp && (
                      <Text size="xs" className={`mt-1 ${message.role === 'user' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
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
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl px-5 py-3 shadow-lg"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
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
            {/* Dugme Obriši na dnu - fiksirano unutar scroll kontejnera */}
            <div className="sticky bottom-0 pt-4 pb-4 flex justify-end z-10 mt-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleClear}
                className="bg-black hover:bg-gray-800 text-white border-2 border-pink-500 shadow-lg"
              >
                Obriši
              </Button>
            </div>
          </div>
        </div>

        {/* Slika mačke sa desne strane */}
        <div className="flex-shrink-0 ml-8 mt-40">
          <Image
            src="/images/question.svg"
            alt="Mačka"
            className="w-80 h-80"
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
      `}</style>
    </div>
  )
}

export default ChatBot

