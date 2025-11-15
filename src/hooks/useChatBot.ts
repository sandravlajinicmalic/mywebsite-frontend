import { useState, useRef, useEffect } from 'react'
import { chatService, type ChatMessage } from '../services/chat'
import { useI18n } from '../contexts/i18n'
import { mapBackendErrorToTranslationKey } from '../utils'

/**
 * Map backend chat response messages to translation keys
 */
const mapBackendResponseToTranslationKey = (response: string): string => {
  // Use the same mapping function since chat responses use similar messages
  return mapBackendErrorToTranslationKey(response)
}

export const useChatBot = () => {
  const { t, language } = useI18n()
  const [messages, setMessages] = useState<ChatMessage[]>([])
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

  // Initialize welcome message after translations are loaded
  useEffect(() => {
    const welcomeText = t('chat.welcome')
    // Only set initial message if translation is loaded (not just the key)
    if (messages.length === 0 && welcomeText !== 'chat.welcome') {
      setMessages([
        {
          role: 'assistant',
          content: welcomeText,
          timestamp: new Date()
        }
      ])
    }
  }, [t, messages.length])

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
      const response = await chatService.sendMessage(userMessage.content, undefined, language)
      console.log('[CHATBOT] Received response:', response)
      
      // Map backend response messages to translations if needed
      let responseContent = response.response
      // Check if response is a known backend message that should be translated
      const responseTranslationKey = mapBackendResponseToTranslationKey(responseContent)
      if (responseTranslationKey && responseTranslationKey !== responseContent) {
        responseContent = t(responseTranslationKey)
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      }

      console.log('[CHATBOT] Adding assistant message to chat')
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('[CHATBOT] Chat error:', error)
      console.error('[CHATBOT] Error details:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: t('api.chat.errorOccurred'),
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
          content: t('chat.clearMessage'),
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

  return {
    messages,
    inputValue,
    isLoading,
    messagesContainerRef,
    handleSend,
    handleClear,
    handleKeyPress,
    handleInputChange,
  }
}

