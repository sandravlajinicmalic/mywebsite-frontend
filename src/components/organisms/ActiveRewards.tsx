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
  const previousYarnStateRef = useRef<boolean>(false)
  const previousCursorStateRef = useRef<string | null>(null)
  const previousColorStateRef = useRef<boolean>(false)
  const expirationTimersRef = useRef<NodeJS.Timeout[]>([])
  const optimisticColorApplyTimeRef = useRef<number | null>(null)
  const isFetchingRef = useRef<boolean>(false)
  const lastFetchTimeRef = useRef<number>(0)

  useEffect(() => {
    const fetchRewards = async () => {
      const user = authService.getCurrentUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        console.log('⏸️  ActiveRewards: Fetch already in progress, skipping...')
        return
      }
      
      // Throttle: don't fetch more than once per 5 seconds
      const now = Date.now()
      if (now - lastFetchTimeRef.current < 5000) {
        console.log('⏸️  ActiveRewards: Throttled: too soon since last fetch')
        return
      }
      
      isFetchingRef.current = true
      lastFetchTimeRef.current = now

      try {
        const rewards = await userService.getActiveRewards()
        
        // Check for yarn reward changes
        const yarnReward = rewards.yarn
        const isYarnExpired = yarnReward?.expiresAt ? isRewardExpired(yarnReward.expiresAt) : true
        const currentYarnState = yarnReward && yarnReward.value && !isYarnExpired
        
        if (currentYarnState !== previousYarnStateRef.current) {
          previousYarnStateRef.current = currentYarnState
        }

        // Check for cursor reward changes
        const cursorReward = rewards.cursor
        const isCursorExpired = cursorReward?.expiresAt ? isRewardExpired(cursorReward.expiresAt) : true
        const currentCursor = (cursorReward?.value?.cursor && !isCursorExpired) ? cursorReward.value.cursor : null
        
        if (currentCursor !== previousCursorStateRef.current) {
          if (currentCursor) {
            applyCustomCursor(currentCursor)
          } else {
            removeCustomCursor()
          }
          previousCursorStateRef.current = currentCursor
        }

        // Check for color reward changes
        const colorReward = rewards.color
        const isColorExpired = colorReward?.expiresAt ? isRewardExpired(colorReward.expiresAt) : true
        const currentColorState = colorReward && colorReward.value && colorReward.value.enabled && !isColorExpired
        
        if (currentColorState !== previousColorStateRef.current) {
          if (currentColorState) {
            applyColorSwap()
            // Clear optimistic time ref since reward is now confirmed
            optimisticColorApplyTimeRef.current = null
          } else {
            removeColorSwap()
            optimisticColorApplyTimeRef.current = null
          }
          previousColorStateRef.current = currentColorState
        } else if (currentColorState && optimisticColorApplyTimeRef.current) {
          // Reward is confirmed, clear optimistic time ref
          optimisticColorApplyTimeRef.current = null
        }
        
        setActiveRewards(rewards)
        
        // Send nickname reward update to Header component via custom event
        const nicknameRewardData = rewards.nickname
        const isNicknameExpired = nicknameRewardData?.expiresAt 
          ? new Date(nicknameRewardData.expiresAt) < new Date()
          : true
        
        const nicknameReward = (nicknameRewardData && nicknameRewardData.value && !isNicknameExpired) 
          ? nicknameRewardData.value 
          : null
        
        window.dispatchEvent(new CustomEvent('nickname-reward-updated', {
          detail: { nicknameReward }
        }))
        
        // Clear existing expiration timers
        expirationTimersRef.current.forEach(timer => clearTimeout(timer))
        expirationTimersRef.current = []
        
        // Set up timers to automatically remove effects when rewards expire
        // Timer for yarn reward
        if (yarnReward?.expiresAt && !isYarnExpired) {
          const expiresIn = new Date(yarnReward.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            const timer = setTimeout(() => {
              previousYarnStateRef.current = false
              fetchRewards()
            }, expiresIn)
            expirationTimersRef.current.push(timer)
          }
        }
        
        // Check if cursor reward expired (no timer needed, will be caught by frequent checks)
        if (!cursorReward || isCursorExpired) {
          // Reward expired or doesn't exist, but effect is still active
          if (previousCursorStateRef.current) {
            removeCustomCursor()
            previousCursorStateRef.current = null
          }
        }
        
        // Timer for color reward
        if (colorReward?.expiresAt && !isColorExpired) {
          const expiresIn = new Date(colorReward.expiresAt).getTime() - Date.now()
          if (expiresIn > 0) {
            const timer = setTimeout(() => {
              // Remove effect immediately when expired
              removeColorSwap()
              previousColorStateRef.current = false
              // Refetch to ensure state is synced
              fetchRewards()
            }, expiresIn)
            expirationTimersRef.current.push(timer)
          } else {
            // Already expired, remove immediately
            if (previousColorStateRef.current) {
              removeColorSwap()
              previousColorStateRef.current = false
            }
          }
        } else if (previousColorStateRef.current) {
          // Reward expired or doesn't exist, but effect is still active
          // Don't remove if we just optimistically applied it (within last 2 seconds)
          const timeSinceOptimistic = optimisticColorApplyTimeRef.current 
            ? Date.now() - optimisticColorApplyTimeRef.current 
            : Infinity
          
          if (timeSinceOptimistic > 2000) {
            // Only remove if it's been more than 2 seconds since optimistic apply
            // This prevents removing the effect if backend hasn't created the reward yet
            removeColorSwap()
            previousColorStateRef.current = false
            optimisticColorApplyTimeRef.current = null
          }
        }
      } catch (error) {
        // Error fetching active rewards - silently fail
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    }

    fetchRewards()

    // Refresh rewards every 30 seconds to check for expired rewards
    const interval = setInterval(fetchRewards, 30000)
    
    // Also listen for custom event to refresh rewards immediately
    const handleRewardActivated = (event: Event) => {
      // Get reward type from event detail if available, or apply optimistically
      const customEvent = event as CustomEvent
      const rewardType = customEvent.detail?.rewardType
      
      // Optimistically apply effects immediately for known reward types
      if (rewardType === 'Color Catastrophe') {
        // Apply color swap optimistically and update state
        if (!previousColorStateRef.current) {
          applyColorSwap()
          previousColorStateRef.current = true
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
  }, []) // Empty dependency array - only run once on mount

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

