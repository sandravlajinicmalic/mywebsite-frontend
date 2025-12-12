import api from './api'
import { extractErrorCode } from '../utils'

export interface ContactRequest {
  name: string
  email: string
  message: string
  subject?: string
}

export interface ContactResponse {
  success: boolean
  message?: string
  messageCode?: string
  data?: unknown
}

export interface ContactError {
  errorCode?: string
  error?: string
  field?: string
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
      // Extract error message and field from response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: ContactError } }
        const errorData = axiosError.response?.data
        if (errorData) {
          const errorCode = extractErrorCode(errorData)
          const customError = new Error(errorCode) as Error & { field?: string }
          customError.field = errorData.field
          throw customError
        }
        throw new Error('contact.error.failed')
      }
      throw new Error('An error occurred while sending message. Please try again.')
    }
  },
}

