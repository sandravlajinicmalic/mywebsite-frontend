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
  const optimisticColorApplyTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const fetchRewards = async () => {
      const user = authService.getCurrentUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const rewards = await userService.getActiveRewards()
        
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
            // Clear optimistic time ref since reward is now confirmed
            optimisticColorApplyTimeRef.current = null
          } else {
            console.log('🎨 Color theme reverted to default (reward expired)')
            removeColorSwap()
            optimisticColorApplyTimeRef.current = null
          }
          setPreviousColorState(currentColorState)
        } else if (currentColorState && optimisticColorApplyTimeRef.current) {
          // Reward is confirmed, clear optimistic time ref
          optimisticColorApplyTimeRef.current = null
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
        
        // Check if cursor reward expired (no timer needed, will be caught by frequent checks)
        if (!cursorReward || isCursorExpired) {
          // Reward expired or doesn't exist, but effect is still active
          if (previousCursorState) {
            removeCustomCursor()
            setPreviousCursorState(null)
          }
        }
        
        // Timer for color reward
        if (colorReward?.expiresAt && !isColorExpired) {
          const expiresIn = new Date(colorReward.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            const timer = setTimeout(() => {
              // Remove effect immediately when expired
              removeColorSwap()
              setPreviousColorState(false)
              // Refetch to ensure state is synced
              fetchRewards()
            }, expiresIn)
            expirationTimersRef.current.push(timer)
          } else {
            // Already expired, remove immediately
            if (previousColorState) {
              removeColorSwap()
              setPreviousColorState(false)
            }
          }
        } else if (previousColorState) {
          // Reward expired or doesn't exist, but effect is still active
          // Don't remove if we just optimistically applied it (within last 2 seconds)
          const timeSinceOptimistic = optimisticColorApplyTimeRef.current 
            ? Date.now() - optimisticColorApplyTimeRef.current 
            : Infinity
          
          if (timeSinceOptimistic > 2000) {
            // Only remove if it's been more than 2 seconds since optimistic apply
            // This prevents removing the effect if backend hasn't created the reward yet
            removeColorSwap()
            setPreviousColorState(false)
            optimisticColorApplyTimeRef.current = null
          }
        }
      } catch (error) {
        console.error('Error fetching active rewards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRewards()

    // Refresh rewards every 5 seconds to check for expired rewards (more frequent check for accurate expiration)
    const interval = setInterval(fetchRewards, 5000)
    
    // Also listen for custom event to refresh rewards immediately
    const handleRewardActivated = (event: Event) => {
      // Get reward type from event detail if available, or apply optimistically
      const customEvent = event as CustomEvent
      const rewardType = customEvent.detail?.rewardType
      
      // Optimistically apply effects immediately for known reward types
      if (rewardType === 'Color Catastrophe') {
        // Apply color swap optimistically and update state
        if (!previousColorState) {
          applyColorSwap()
          setPreviousColorState(true)
          optimisticColorApplyTimeRef.current = Date.now()
        }
      }
      if (rewardType === 'Paw-some Cursor') {
        // Cursor will be applied after fetchRewards confirms
      }
      if (rewardType === 'Chase the Yarn!') {
        // Yarn will be applied after fetchRewards confirms
      }
      
      // Fetch after a short delay to allow backend to create the reward
      // This ensures the reward exists when we fetch
      setTimeout(() => {
        fetchRewards()
      }, 200)
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

