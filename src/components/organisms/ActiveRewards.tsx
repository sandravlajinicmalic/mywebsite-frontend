import { useState, useEffect, useRef } from 'react'
import { userService } from '../../services'
import { authService } from '../../services/auth'
import { applyCustomCursor, removeCustomCursor, applyColorSwap, removeColorSwap } from '../../utils'
import YarnBall from './YarnBall'

// Helper function to check if reward is expired
const isRewardExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

const ActiveRewards = () => {
  const [activeRewards, setActiveRewards] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [previousYarnState, setPreviousYarnState] = useState<boolean>(false)
  const [previousCursorState, setPreviousCursorState] = useState<string | null>(null)
  const [previousColorState, setPreviousColorState] = useState<boolean>(false)
  const expirationTimersRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    const fetchRewards = async () => {
      const user = authService.getCurrentUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const rewards = await userService.getActiveRewards()
        
        // Force a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check for yarn reward changes
        const yarnReward = rewards.yarn
        const isYarnExpired = yarnReward?.expiresAt ? isRewardExpired(yarnReward.expiresAt) : true
        const currentYarnState = yarnReward && yarnReward.value && !isYarnExpired
        
        if (currentYarnState !== previousYarnState) {
          if (currentYarnState) {
            console.log('🪢 Yarn ball appeared!', { expiresAt: yarnReward.expiresAt })
          } else {
            console.log('🪢 Yarn ball disappeared (reward expired)')
          }
          setPreviousYarnState(currentYarnState)
        }

        // Check for cursor reward changes
        const cursorReward = rewards.cursor
        const isCursorExpired = cursorReward?.expiresAt ? isRewardExpired(cursorReward.expiresAt) : true
        const currentCursor = (cursorReward?.value?.cursor && !isCursorExpired) ? cursorReward.value.cursor : null
        
        if (currentCursor !== previousCursorState) {
          if (currentCursor) {
            console.log('🐾 Cursor changed to paw!', { cursor: currentCursor, expiresAt: cursorReward.expiresAt })
            applyCustomCursor(currentCursor)
          } else {
            console.log('🐾 Cursor reverted to default (reward expired)')
            removeCustomCursor()
          }
          setPreviousCursorState(currentCursor)
        }

        // Check for color reward changes
        const colorReward = rewards.color
        const isColorExpired = colorReward?.expiresAt ? isRewardExpired(colorReward.expiresAt) : true
        const currentColorState = colorReward && colorReward.value && colorReward.value.enabled && !isColorExpired
        
        if (currentColorState !== previousColorState) {
          if (currentColorState) {
            console.log('🎨 Color theme changed! Pink → Blue', { swap: colorReward.value.swap, expiresAt: colorReward.expiresAt })
            applyColorSwap()
          } else {
            console.log('🎨 Color theme reverted to default (reward expired)')
            removeColorSwap()
          }
          setPreviousColorState(currentColorState)
        }
        
        setActiveRewards(rewards)
        
        // Clear existing expiration timers
        expirationTimersRef.current.forEach(timer => clearTimeout(timer))
        expirationTimersRef.current = []
        
        // Set up timers to automatically remove effects when rewards expire
        // Timer for yarn reward
        if (yarnReward?.expiresAt && !isYarnExpired) {
          const expiresIn = new Date(yarnReward.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            const timer = setTimeout(() => {
              setPreviousYarnState(false)
              fetchRewards()
            }, expiresIn)
            expirationTimersRef.current.push(timer)
          }
        }
        
        // Timer for cursor reward
        if (cursorReward?.expiresAt && !isCursorExpired) {
          const expiresIn = new Date(cursorReward.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            const timer = setTimeout(() => {
              removeCustomCursor()
              setPreviousCursorState(null)
              fetchRewards()
            }, expiresIn)
            expirationTimersRef.current.push(timer)
          }
        }
        
        // Timer for color reward
        if (colorReward?.expiresAt && !isColorExpired) {
          const expiresIn = new Date(colorReward.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            const timer = setTimeout(() => {
              removeColorSwap()
              setPreviousColorState(false)
              fetchRewards()
            }, expiresIn)
            expirationTimersRef.current.push(timer)
          }
        }
      } catch (error) {
        console.error('Error fetching active rewards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRewards()

    // Refresh rewards every 30 seconds to check for expired rewards (more frequent check)
    const interval = setInterval(fetchRewards, 30000)
    
    // Also listen for custom event to refresh rewards immediately
    const handleRewardActivated = () => {
      setTimeout(fetchRewards, 500)
    }
    window.addEventListener('reward-activated', handleRewardActivated)

    return () => {
      clearInterval(interval)
      window.removeEventListener('reward-activated', handleRewardActivated)
      // Clear all expiration timers
      expirationTimersRef.current.forEach(timer => clearTimeout(timer))
      expirationTimersRef.current = []
      // Cleanup: revert cursor and color on unmount
      removeCustomCursor()
      removeColorSwap()
    }
  }, [previousYarnState, previousCursorState, previousColorState])

  if (isLoading) return null

  // Check if yarn reward is active and not expired
  const yarnReward = activeRewards.yarn
  const isYarnExpired = yarnReward?.expiresAt ? new Date(yarnReward.expiresAt) < new Date() : true
  const showYarn = yarnReward && yarnReward.value && !isYarnExpired

  return (
    <>
      {showYarn && <YarnBall />}
    </>
  )
}

export default ActiveRewards

