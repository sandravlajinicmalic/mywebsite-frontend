import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { API_URL, STORAGE_KEYS } from '../constants'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 (Unauthorized) - token expired or invalid
    // Also handle 403 (Forbidden) for backward compatibility
    if (error.response?.status === 401 || error.response?.status === 403) {
      const errorData = error.response?.data as { errorCode?: string } | undefined
      const errorCode = errorData?.errorCode
      
      // Check if it's a token-related error
      if (
        errorCode === 'auth.tokenExpired' ||
        errorCode === 'auth.invalidToken' ||
        errorCode === 'auth.invalidOrExpiredToken' ||
        errorCode === 'auth.accessTokenRequired'
      ) {
        // Clear storage and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        // Use window.location.href for reliable redirect outside React context
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api

