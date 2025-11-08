import api from './api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatResponse {
  response: string
  isAboutCats: boolean
}

export const chatService = {
  async sendMessage(message: string, sessionId?: string, language?: string): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/chat/message', {
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
      await api.post('/chat/clear', {
        sessionId: sessionId || 'default'
      })
    } catch (error) {
      console.error('Clear history error:', error)
      throw error
    }
  }
}

