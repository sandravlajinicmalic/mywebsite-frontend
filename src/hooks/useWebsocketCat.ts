import { useState, useEffect, useRef } from 'react'
import getSocket from '../services/socket'
import { authService } from '../services/auth'
import { useI18n } from '../contexts/i18n'
import { SOCKET_EVENTS } from '../constants'
import { extractErrorCode } from '../utils'

export type CatState = 'playing' | 'zen' | 'sleeping' | 'happy' | 'tired' | 'angry' | 'wake'

export interface LogEntry {
  id: string
  action: string
  user_name: string
  timestamp: string
}

export const useWebsocketCat = () => {
  const { t } = useI18n()
  const [catState, setCatState] = useState<CatState>('playing')
  const [isSleeping, setIsSleeping] = useState(false)
  const [sleepEndTime, setSleepEndTime] = useState<Date | null>(null)
  const [sleptBy, setSleptBy] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showOldImage, setShowOldImage] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [displayedState, setDisplayedState] = useState<CatState>('playing')
  const terminalRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef(getSocket())
  const currentUser = authService.getCurrentUser()

  // Map cat state to image
  const getCatImage = (state: CatState): string => {
    const imageMap: Record<CatState, string> = {
        playing: '/images/heavy-metal.svg',
        zen: '/images/meditation.svg',
        sleeping: '/images/sleeping.svg',
        happy: '/images/education.svg',
        tired: '/images/tired.svg',
        angry: '/images/angry.svg',
        wake: '/images/wake.svg'
    }
    return imageMap[state] || '/images/heavy-metal.svg'
  }

  // Format time for terminal
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  // Countdown timer
  useEffect(() => {
    if (!isSleeping || !sleepEndTime) {
      setTimeRemaining('')
      return
    }

    const interval = setInterval(() => {
      const now = new Date()
      const diff = sleepEndTime.getTime() - now.getTime()

      if (diff <= 0) {
        // Sleep period ended - show "Need more rest" and wait for backend event
        // Don't reset sleepEndTime here - cat-rest-ended handler will do that
        setTimeRemaining(t('cat.sleep.needMoreRest'))
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSleeping, sleepEndTime, t])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  // Trigger animation when cat state changes
  useEffect(() => {
    // Skip animation on initial mount
    if (animationKey === 0) {
      setDisplayedState(catState)
      setAnimationKey(1)
      return
    }

    // Only animate if state actually changed
    if (catState === displayedState) {
      return
    }

    // Start animation for all state changes (including 'wake')
    setIsAnimating(true)
    setShowOldImage(true)
    
    // Hide old image after 700ms (gives time for smooth exit)
    const hideOldTimer = setTimeout(() => {
      setShowOldImage(false)
    }, 700)
    
    // Animation duration: 1.5s
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setDisplayedState(catState)
      setAnimationKey(prev => prev + 1)
    }, 1500)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideOldTimer)
    }
  }, [catState, displayedState, animationKey])

  // Socket.io setup
  useEffect(() => {
    const socket = socketRef.current

    // Connection events
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      // Request current state and logs after connection
      socket.emit(SOCKET_EVENTS.GET_CURRENT_STATE)
      socket.emit(SOCKET_EVENTS.GET_LOGS, { limit: 50 })
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      // Handle disconnect if needed
    })

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, () => {
      // Handle connection error if needed
    })
    
    // If not connected, try to connect manually
    if (!socket.connected) {
      socket.connect()
    }

    // Listen for cat state changes
    socket.on(SOCKET_EVENTS.CAT_STATE_CHANGED, (data: { state: CatState }) => {
      setCatState(data.state)
      
      // Reset isSleeping when state changes to something other than 'sleeping' or 'wake'
      // This ensures button stays disabled during wake transition
      if (data.state !== 'sleeping' && data.state !== 'wake') {
        setIsSleeping(false)
      }
    })

    // Listen for Sleep activation
    socket.on(SOCKET_EVENTS.CAT_RESTING, (data: { restUntil: string; userName: string }) => {
      setIsSleeping(true)
      setSleepEndTime(new Date(data.restUntil))
      setSleptBy(data.userName)
    })

    // Listen for Sleep denial
    socket.on(SOCKET_EVENTS.REST_DENIED, (data: { errorCode?: string; message?: string }) => {
      const translationKey = extractErrorCode(data)
      alert(t(translationKey))
    })

    // Listen for Sleep period ending
    socket.on(SOCKET_EVENTS.CAT_REST_ENDED, () => {
      // Don't reset isSleeping here - wait for cat-state-changed event
      // We'll reset it when state changes to something other than 'wake' or 'sleeping'
      setSleepEndTime(null)
      setSleptBy(null)
      setTimeRemaining('')
      // Don't set state here - wait for cat-state-changed event
      // It will first be 'wake', then normal state after 10 seconds
    })

    // Listen for initial logs
    socket.on(SOCKET_EVENTS.INITIAL_LOGS, (data: LogEntry[]) => {
      if (data && Array.isArray(data)) {
        setLogs(data.reverse()) // Reverse to show oldest first
      } else {
        setLogs([])
      }
    })

    // Listen for new logs
    socket.on(SOCKET_EVENTS.NEW_LOG, (log: LogEntry) => {
      if (log && log.id && log.action) {
        setLogs(prev => [...prev, log])
      }
    })

    // If already connected, request immediately
    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.GET_CURRENT_STATE)
      socket.emit(SOCKET_EVENTS.GET_LOGS, { limit: 50 })
    } else {
      // Wait a bit and try again if connection happens
      const checkConnection = setInterval(() => {
        if (socket.connected) {
          socket.emit(SOCKET_EVENTS.GET_CURRENT_STATE)
          socket.emit(SOCKET_EVENTS.GET_LOGS, { limit: 50 })
          clearInterval(checkConnection)
        }
      }, 1000)
      
      // Clear interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkConnection)
      }, 10000)
    }

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT)
      socket.off(SOCKET_EVENTS.DISCONNECT)
      socket.off(SOCKET_EVENTS.CONNECT_ERROR)
      socket.off(SOCKET_EVENTS.CAT_STATE_CHANGED)
      socket.off(SOCKET_EVENTS.CAT_RESTING)
      socket.off(SOCKET_EVENTS.REST_DENIED)
      socket.off(SOCKET_EVENTS.CAT_REST_ENDED)
      socket.off(SOCKET_EVENTS.INITIAL_LOGS)
      socket.off(SOCKET_EVENTS.NEW_LOG)
    }
  }, [])

  const handleReset = () => {
    if (!currentUser) {
      alert(t('cat.sleep.mustBeLoggedIn'))
      return
    }

    if (isSleeping) {
      alert(t('cat.sleep.alreadyActive'))
      return
    }

    const socket = socketRef.current
    socket.emit(SOCKET_EVENTS.ACTIVATE_REST, {
      userId: currentUser.id,
      userName: currentUser.nickname
    })
  }

  const getSleepButtonText = (): string => {
    if (catState === 'wake') {
      return t('cat.sleep.wakingUp')
    }

    if (!isSleeping) {
      return t('cat.sleep.putToSleep')
    }

    // If timeRemaining is "Need more rest", show it differently
    if (timeRemaining === t('cat.sleep.needMoreRest')) {
      return `${t('cat.sleep.sleeping')} - ${timeRemaining}`
    }

    return `${t('cat.sleep.sleeping')}${timeRemaining ? ` (${timeRemaining})` : ''}`
  }

  return {
    catState,
    isSleeping,
    logs,
    timeRemaining,
    isAnimating,
    showOldImage,
    animationKey,
    displayedState,
    terminalRef,
    getCatImage,
    formatTime,
    handleReset,
    getSleepButtonText,
  }
}

