import api from './api'
import { API_ENDPOINTS } from '../constants'

export interface ActiveReward {
  value: any
  expiresAt: string | null
  createdAt: string | null
}

export interface ActiveRewardsResponse {
  success: boolean
  rewards: Record<string, ActiveReward>
}

export interface ActiveAvatarResponse {
  success: boolean
  avatar: string
  isTemporary: boolean
  expiresAt: string | null
  originalAvatar: string
}

// User service
export const userService = {
  /**
   * Get all active rewards for current user
   */
  async getActiveRewards(): Promise<Record<string, ActiveReward>> {
    try {
      const response = await api.get<ActiveRewardsResponse>(API_ENDPOINTS.USER_ACTIVE_REWARDS)
      return response.data.rewards
    } catch (error) {
      console.error('Error fetching active rewards:', error)
      return {}
    }
  },

  /**
   * Get active avatar for current user
   */
  async getActiveAvatar(): Promise<ActiveAvatarResponse> {
    try {
      const response = await api.get<ActiveAvatarResponse>(API_ENDPOINTS.USER_ACTIVE_AVATAR)
      return response.data
    } catch (error) {
      console.error('Error fetching active avatar:', error)
      // Return default avatar on error
      return {
        success: false,
        avatar: '/images/user-profile-icons/cat1.svg',
        isTemporary: false,
        expiresAt: null,
        originalAvatar: '/images/user-profile-icons/cat1.svg'
      }
    }
  },

}

