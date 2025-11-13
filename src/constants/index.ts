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

// Wheel configuration
export const WHEEL_CONFIG = {
  ITEMS: [
    'New Me, Who Dis?',
    'Fancy Schmancy Nickname',
    'Chase the Yarn!',
    'Paw-some Cursor',
    'Royal Meowjesty',
    'Color Catastrophe',
    'Spin Again, Brave Soul',
    'Total Cat-astrophe'
  ],
  COOLDOWN_MS: 2 * 60 * 1000, // 2 minutes
  COLORS: [
    '#F76C9B', // wheel-pink
    '#6EC1E4', // wheel-blue
    '#63D9A0', // wheel-green
    '#F8D44C', // wheel-yellow
    '#FFA85C', // wheel-orange
    '#B488E4', // wheel-purple
    '#5ED3C3', // wheel-teal
    '#F7A7A3'  // wheel-coral
  ],
  PRIZE_DESCRIPTIONS: {
    'New Me, Who Dis?': 'Your old icon is gone. A new identity has appeared. Embrace the chaos, mystery, and possibly worse hair.',
    'Fancy Schmancy Nickname': 'Your nickname just got a glow-up. Prepare to outshine everyone — it\'s giving ✨main character energy✨.',
    'Chase the Yarn!': 'A wild yarn ball appears! Push it, chase it, or let it roll into existential questions about your life choices.',
    'Paw-some Cursor': 'Your cursor is now a cat paw. Warning: excessive cuteness may decrease productivity by 73%.',
    'Royal Meowjesty': 'You\'ve been knighted by the Cat Kingdom. Please use your power responsibly… or dramatically.',
    'Color Catastrophe': 'Everything pink is now blue, everything blue is now pink. It\'s fashion. It\'s chaos. It\'s art.',
    'Spin Again, Brave Soul': 'Fortune says: "Not today." But you get another chance — because persistence (and a bit of luck) never hurt anyone.',
    'Total Cat-astrophe': 'Congratulations! You\'ve achieved absolutely nothing. That\'s still a kind of win, right? 😹'
  },
} as const

