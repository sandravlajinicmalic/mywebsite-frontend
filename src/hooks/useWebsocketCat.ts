import { useState, useEffect, useRef } from 'react'
import getSocket from '../services/socket'
import { authService } from '../services/auth'
import { useI18n } from '../contexts/i18n'
import { SOCKET_EVENTS } from '../constants'
import { mapBackendErrorToTranslationKey } from '../utils'

export type CatState = 'playing' | 'zen' | 'sleeping' | 'happy' | 'tired' | 'angry'

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
        angry: '/images/angry.svg'
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
        // Sleep period ended - reset state
        setIsSleeping(false)
        setSleepEndTime(null)
        setSleptBy(null)
        setTimeRemaining('')
        // Explicitly set cat state to playing when sleep ends (fallback if backend event doesn't arrive)
        setCatState('playing')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSleeping, sleepEndTime])

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

    // Start animation
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
      console.log('Connected to WebSocket server')
      // Request current state and logs after connection
      socket.emit(SOCKET_EVENTS.GET_CURRENT_STATE)
      socket.emit(SOCKET_EVENTS.GET_LOGS, { limit: 50 })
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Disconnected from WebSocket server')
    })

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Listen for cat state changes
    socket.on(SOCKET_EVENTS.CAT_STATE_CHANGED, (data: { state: CatState }) => {
      console.log('Cat state changed:', data.state)
      setCatState(data.state)
    })

    // Listen for Sleep activation
    socket.on(SOCKET_EVENTS.CAT_RESTING, (data: { restUntil: string; userName: string }) => {
      console.log('Cat sleeping:', data)
      setIsSleeping(true)
      setSleepEndTime(new Date(data.restUntil))
      setSleptBy(data.userName)
    })

    // Listen for Sleep denial
    socket.on(SOCKET_EVENTS.REST_DENIED, (data: { message: string }) => {
      const translationKey = mapBackendErrorToTranslationKey(data.message)
      alert(t(translationKey))
    })

    // Listen for Sleep period ending
    socket.on(SOCKET_EVENTS.CAT_REST_ENDED, () => {
      console.log('Cat sleep period ended')
      setIsSleeping(false)
      setSleepEndTime(null)
      setSleptBy(null)
      setTimeRemaining('')
      // Explicitly set cat state to playing when sleep ends
      setCatState('playing')
    })

    // Listen for initial logs
    socket.on(SOCKET_EVENTS.INITIAL_LOGS, (data: LogEntry[]) => {
      console.log('Received initial logs:', data.length)
      setLogs(data.reverse()) // Reverse to show oldest first
    })

    // Listen for new logs
    socket.on(SOCKET_EVENTS.NEW_LOG, (log: LogEntry) => {
      console.log('New log received:', log)
      setLogs(prev => [...prev, log])
    })

    // If already connected, request immediately
    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.GET_CURRENT_STATE)
      socket.emit(SOCKET_EVENTS.GET_LOGS, { limit: 50 })
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
    if (!isSleeping) {
      return t('cat.sleep.putToSleep')
    }

    if (currentUser?.nickname === sleptBy) {
      return `${t('cat.sleep.sleeping')}${timeRemaining ? ` (${timeRemaining})` : ''}`
    }

    return `${t('cat.sleep.activatedBy')} ${sleptBy}${timeRemaining ? ` (${timeRemaining})` : ''}`
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

