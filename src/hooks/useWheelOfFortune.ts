import { useState, useRef, useEffect } from 'react'
import { wheelService } from '../services/wheel'
import { authService } from '../services/auth'
import { useI18n } from '../contexts/i18n'
import { STORAGE_KEYS } from '../constants'
import { WHEEL_CONFIG } from '../config/wheel'

export interface ConfettiPiece {
  id: number
  color: string
  left: number
  delay: number
  duration: number
  horizontal: number
  vertical: number
}

export const useWheelOfFortune = () => {
  const { t } = useI18n()
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [winningItem, setWinningItem] = useState<string | null>(null)
  const [canSpin, setCanSpin] = useState(true)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const wheelRef = useRef<HTMLDivElement>(null)
  const lastSpinTimeRef = useRef<number | null>(null)

  // Check initial cooldown status on mount (only once, no periodic calls)
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      setCanSpin(false)
      return
    }

    // Get last spin time from localStorage if available
    const storedLastSpin = localStorage.getItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME)
    if (storedLastSpin) {
      const lastSpinTime = parseInt(storedLastSpin, 10)
      const now = Date.now()
      const timeSinceLastSpin = now - lastSpinTime

      if (timeSinceLastSpin < WHEEL_CONFIG.COOLDOWN_MS) {
        lastSpinTimeRef.current = lastSpinTime
        const remainingMs = WHEEL_CONFIG.COOLDOWN_MS - timeSinceLastSpin
        const remainingSeconds = Math.ceil(remainingMs / 1000)
        setCooldownSeconds(remainingSeconds)
        setCanSpin(false)
      } else {
        // Cooldown expired, clear storage
        localStorage.removeItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME)
        lastSpinTimeRef.current = null
        setCooldownSeconds(0)
        setCanSpin(true)
      }
    }
  }, [])

  // Update cooldown timer every second (only local, no API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSpinTimeRef.current) {
        const now = Date.now()
        const timeSinceLastSpin = now - lastSpinTimeRef.current
        const remainingMs = WHEEL_CONFIG.COOLDOWN_MS - timeSinceLastSpin

        if (remainingMs > 0) {
          const remainingSeconds = Math.ceil(remainingMs / 1000)
          setCooldownSeconds(remainingSeconds)
          setCanSpin(false)
        } else {
          setCooldownSeconds(0)
          setCanSpin(true)
          lastSpinTimeRef.current = null
          localStorage.removeItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Clear confetti when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setConfetti([])
    }
  }, [isModalOpen])

  const spinWheel = async () => {
    if (isSpinning || !canSpin) return

    const user = authService.getCurrentUser()
    if (!user) {
      alert(t('wheel.mustBeLoggedIn'))
      return
    }

    setIsSpinning(true)
    setCanSpin(false)
    
    const spins = Math.floor(Math.random() * 5) + 3
    const segmentAngle = 360 / WHEEL_CONFIG.ITEMS.length
    const winningIndex = Math.floor(Math.random() * WHEEL_CONFIG.ITEMS.length)
    const segmentCenterAngle = -90 + (winningIndex * segmentAngle) + (segmentAngle / 2)
    const currentRotationNormalized = ((rotation % 360) + 360) % 360
    const segmentCenterAtZero = ((segmentCenterAngle + 90) % 360 + 360) % 360
    const currentPosition = (segmentCenterAtZero + currentRotationNormalized) % 360
    const angleToRotate = (360 - currentPosition) % 360
    const finalRotation = spins * 360 + angleToRotate
    const totalRotationAfter = rotation + finalRotation
    
    setRotation(prev => prev + finalRotation)
    
    setTimeout(async () => {
      setIsSpinning(false)
      
      const normalizedRotation = ((totalRotationAfter % 360) + 360) % 360
      const positionAtTop = (360 - normalizedRotation) % 360
      const adjustedPosition = (positionAtTop - 22.5 + 360) % 360
      const actualWinningIndex = Math.round(adjustedPosition / segmentAngle) % WHEEL_CONFIG.ITEMS.length
      const actualWinningItem = WHEEL_CONFIG.ITEMS[actualWinningIndex]
      
      setWinningItem(actualWinningItem)
      
      // Save spin to backend - this is the only API call
      try {
        const response = await wheelService.spin(actualWinningItem)
        // Use canSpin and cooldownSeconds from response
        // If "Spin Again, Brave Soul", canSpin will be true and cooldownSeconds will be 0
        if (response.canSpin) {
          // No cooldown - user can spin again immediately
          setCanSpin(true)
          setCooldownSeconds(0)
          lastSpinTimeRef.current = null
          localStorage.removeItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME)
        } else {
          // Normal cooldown applies
          const spinTime = Date.now()
          lastSpinTimeRef.current = spinTime
          localStorage.setItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME, spinTime.toString())
          setCooldownSeconds(response.cooldownSeconds || 60) // Use from response or default to 1 minute
          setCanSpin(false)
        }
        
        // Mark if reward requires refresh (will be handled when modal closes)
        const rewardsRequiringRefresh = ['Paw-some Cursor', 'Color Catastrophe', 'Chase the Yarn!']
        if (rewardsRequiringRefresh.includes(actualWinningItem)) {
          sessionStorage.setItem('shouldRefreshOnModalClose', 'true')
        }
      } catch (error: any) {
        console.error('Error saving spin:', error)
        // If error is cooldown, extract cooldown seconds and set timer
        if (error.cooldownSeconds) {
          const remainingMs = error.cooldownSeconds * 1000
          const spinTime = Date.now() - (WHEEL_CONFIG.COOLDOWN_MS - remainingMs)
          lastSpinTimeRef.current = spinTime
          localStorage.setItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME, spinTime.toString())
          setCooldownSeconds(error.cooldownSeconds)
        } else if (error.response?.data?.cooldownSeconds) {
          const remainingMs = error.response.data.cooldownSeconds * 1000
          const spinTime = Date.now() - (WHEEL_CONFIG.COOLDOWN_MS - remainingMs)
          lastSpinTimeRef.current = spinTime
          localStorage.setItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME, spinTime.toString())
          setCooldownSeconds(error.response.data.cooldownSeconds)
        } else {
          // Default to 1 minute on error
          const spinTime = Date.now()
          lastSpinTimeRef.current = spinTime
          localStorage.setItem(STORAGE_KEYS.WHEEL_LAST_SPIN_TIME, spinTime.toString())
          setCooldownSeconds(60)
        }
        setCanSpin(false)
      }
      
      setTimeout(() => {
        // Save scroll position BEFORE opening modal (for rewards that need refresh)
        const rewardsRequiringRefresh = ['Paw-some Cursor', 'Color Catastrophe', 'Chase the Yarn!']
        if (rewardsRequiringRefresh.includes(actualWinningItem)) {
          const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
          sessionStorage.setItem('scrollPosition', scrollY.toString())
          sessionStorage.setItem('scrollPath', window.location.pathname)
        }
        
        setIsModalOpen(true)
        // Create confetti explosion when modal opens
        const confettiCount = 50
        const newConfetti = Array.from({ length: confettiCount }, (_, i) => {
          // Random angle for explosion in all directions (0 to 360 degrees)
          const angle = (Math.PI * 2 * i) / confettiCount + Math.random() * 0.5
          // Distance for explosion (100-200px)
          const distance = 100 + Math.random() * 100
          return {
            id: i,
            color: WHEEL_CONFIG.COLORS[Math.floor(Math.random() * WHEEL_CONFIG.COLORS.length)],
            left: 50, // Start from center (50%)
            delay: Math.random() * 0.2, // Shorter delay for explosion effect
            duration: 3 + Math.random() * 2, // 3-5 seconds (slower)
            horizontal: Math.cos(angle) * distance, // X direction based on angle
            vertical: Math.sin(angle) * distance // Y direction based on angle
          }
        })
        setConfetti(newConfetti)
        
        // Clear confetti after animation
        setTimeout(() => {
          setConfetti([])
        }, 6000)
      }, 1000)
    }, 4000)
  }

  return {
    rotation,
    isSpinning,
    isModalOpen,
    setIsModalOpen,
    winningItem,
    canSpin,
    cooldownSeconds,
    confetti,
    wheelRef,
    spinWheel,
  }
}

