import api from './api'

export interface ContactRequest {
  name: string
  email: string
  message: string
  subject?: string
}

export interface ContactResponse {
  success: boolean
  message: string
  data?: unknown
}

export const contactService = {
  /**
   * Send contact message
   */
  async sendMessage(data: ContactRequest): Promise<ContactResponse> {
    try {
      const response = await api.post<ContactResponse>('/contact/submit', data)
      return response.data
    } catch (error: unknown) {
      // Extract error message from response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const errorMessage = axiosError.response?.data?.error || 'An error occurred while sending message'
        throw new Error(errorMessage)
      }
      throw new Error('An error occurred while sending message. Please try again.')
    }
  },
}

