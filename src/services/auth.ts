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
      // Extract error message from response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const errorMessage = axiosError.response?.data?.error || 'An error occurred during login'
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
}

