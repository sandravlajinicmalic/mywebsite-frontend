import api from './api'
import { API_ENDPOINTS } from '../constants'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatResponse {
  response: string
  isAboutCats: boolean
  messageCode?: string // Optional code for frontend translation mapping
}

export const chatService = {
  async sendMessage(message: string, sessionId?: string, language?: string): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>(API_ENDPOINTS.CHAT_MESSAGE, {
        message,
        sessionId: sessionId || 'default',
        language: language || 'en'
      })
      return response.data
    } catch (error) {
      console.error('Chat service error:', error)
      throw error
    }
  },

  async clearHistory(sessionId?: string): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.CHAT_CLEAR, {
        sessionId: sessionId || 'default'
      })
    } catch (error) {
      console.error('Clear history error:', error)
      throw error
    }
  }
}

