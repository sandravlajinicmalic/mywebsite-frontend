// Konstante i konfiguracije
// Primjer: API_URL, ROUTES, THEME_COLORS, itd.

export const ROUTES = {
  LOGIN: '/',
  HOME: '/home',
  ABOUT: '/about',
} as const

export const APP_NAME = 'My Website' as const

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const

