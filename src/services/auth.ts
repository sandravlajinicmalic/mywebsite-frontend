import api from './api'
import { STORAGE_KEYS } from '../constants'

export interface User {
  id: string
  email: string
  nickname: string
}

export interface LoginResponse {
  success: boolean
  user: User
  token: string
}

export interface VerifyResponse {
  success: boolean
  user: User
}

export interface LoginRequest {
  email: string
  nickname: string
}

export interface ValidationErrors {
  email?: string
  nickname?: string
}

export interface LoginError extends Error {
  errors?: ValidationErrors
}

// Auth service
export const authService = {
  /**
   * Login or register user
   */
  async login(email: string, nickname: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        nickname,
      })
      
      if (response.data.success && response.data.token) {
        // Store token and user in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error: unknown) {
      // Extract error message and validation errors from response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { 
              error?: string
              errors?: ValidationErrors
            } 
          } 
        }
        const errorData = axiosError.response?.data
        const validationErrors = errorData?.errors
        
        // If there are specific field errors, throw error with errors object
        if (validationErrors) {
          const loginError = new Error(errorData?.error || 'Validation failed') as LoginError
          loginError.errors = validationErrors
          throw loginError
        }
        
        const errorMessage = errorData?.error || 'An error occurred during login'
        throw new Error(errorMessage)
      }
      throw new Error('An error occurred during login. Please try again.')
    }
  },

  /**
   * Verify token and get user data
   */
  async verifyToken(): Promise<VerifyResponse | null> {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      if (!token) {
        return null
      }

      const response = await api.get<VerifyResponse>('/auth/verify')
      return response.data
    } catch (error) {
      // Token invalid or expired
      this.logout()
      return null
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) {
      return null
    }
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  },

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  /**
   * Logout user - clear storage
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    try {
      await api.delete('/auth/delete')
      
      // Clear storage after successful deletion
      this.logout()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { 
              error?: string
            } 
          } 
        }
        const errorMessage = axiosError.response?.data?.error || 'Failed to delete account'
        throw new Error(errorMessage)
      }
      throw new Error('Failed to delete account. Please try again.')
    }
  },

  /**
   * Request nickname reminder via email
   */
  async forgotNickname(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/forgot-nickname', {
        email,
      })
      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number
            data?: { 
              error?: string
              message?: string
            } 
          } 
        }
        const errorData = axiosError.response?.data
        const errorMessage = errorData?.error || errorData?.message || 'Failed to send nickname reminder'
        throw new Error(errorMessage)
      }
      throw new Error('Failed to send nickname reminder. Please try again.')
    }
  },
}

