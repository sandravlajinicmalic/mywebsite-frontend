import api from './api'

export interface WheelSpin {
  id: string
  reward: string
  created_at: string
}

export interface SpinResponse {
  success: boolean
  spin: WheelSpin
  canSpin: boolean
  cooldownSeconds: number
}

export interface CanSpinResponse {
  canSpin: boolean
  cooldownSeconds: number
}

export interface HistoryResponse {
  success: boolean
  spins: WheelSpin[]
}

// Wheel service
export const wheelService = {
  /**
   * Spin the wheel and save the reward
   */
  async spin(reward: string): Promise<SpinResponse> {
    try {
      const response = await api.post<SpinResponse>('/wheel/spin', {
        reward,
      })
      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; cooldownSeconds?: number } } }
        const errorMessage = axiosError.response?.data?.error || 'Došlo je do greške prilikom spina'
        const cooldownSeconds = axiosError.response?.data?.cooldownSeconds || 0
        // Create error with cooldownSeconds attached
        const customError: any = new Error(errorMessage)
        customError.response = axiosError.response
        customError.cooldownSeconds = cooldownSeconds
        throw customError
      }
      throw new Error('Došlo je do greške prilikom spina. Pokušajte ponovo.')
    }
  },

  /**
   * Check if user can spin (cooldown status)
   */
  async canSpin(): Promise<CanSpinResponse> {
    try {
      const response = await api.get<CanSpinResponse>('/wheel/can-spin')
      return response.data
    } catch (error) {
      // If error, assume user can't spin
      return { canSpin: false, cooldownSeconds: 120 }
    }
  },

  /**
   * Get spin history for current user
   */
  async getHistory(): Promise<WheelSpin[]> {
    try {
      const response = await api.get<HistoryResponse>('/wheel/history')
      return response.data.spins
    } catch (error) {
      console.error('Error fetching wheel history:', error)
      return []
    }
  },
}

