// Konstante i konfiguracije
// Primjer: API_URL, ROUTES, THEME_COLORS, itd.

export const ROUTES = {
  LOGIN: '/',
  HOME: '/home',
  ABOUT: '/about',
  FORGOT_NICKNAME: '/forgot-nickname',
} as const

export const APP_NAME = 'My Website' as const

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  WHEEL_LAST_SPIN_TIME: 'wheel_last_spin_time',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Chat endpoints
  CHAT_MESSAGE: '/chat/message',
  CHAT_CLEAR: '/chat/clear',
  
  // Wheel endpoints
  WHEEL_SPIN: '/wheel/spin',
  WHEEL_CAN_SPIN: '/wheel/can-spin',
  WHEEL_HISTORY: '/wheel/history',
} as const

// Socket.io events
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Cat state events
  GET_CURRENT_STATE: 'get-current-state',
  CAT_STATE_CHANGED: 'cat-state-changed',
  
  // Rest/Sleep events
  ACTIVATE_REST: 'activate-rest',
  CAT_RESTING: 'cat-resting',
  REST_DENIED: 'rest-denied',
  CAT_REST_ENDED: 'cat-rest-ended',
  
  // Log events
  GET_LOGS: 'get-logs',
  INITIAL_LOGS: 'initial-logs',
  NEW_LOG: 'new-log',
} as const

