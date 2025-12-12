/**
 * Extract error code from backend response
 * Returns errorCode if present, otherwise maps error message to translation key
 */
export const extractErrorCode = (errorData: { errorCode?: string; error?: string } | string | undefined): string => {
  if (!errorData) return 'error.internalServerError'
  
  // If it's already a string (legacy support)
  if (typeof errorData === 'string') {
    // Check if it's already a translation key (starts with api.)
    if (errorData.startsWith('api.')) {
      return errorData
    }
    return mapBackendErrorToTranslationKey(errorData)
  }
  
  // If errorCode is present, use it directly
  if (errorData.errorCode) {
    return `api.${errorData.errorCode}`
  }
  
  // Fallback to mapping error message
  if (errorData.error) {
    // Check if it's already a translation key
    if (errorData.error.startsWith('api.')) {
      return errorData.error
    }
    return mapBackendErrorToTranslationKey(errorData.error)
  }
  
  return 'error.internalServerError'
}

/**
 * Map backend error messages to translation keys (legacy fallback only)
 * @deprecated Use extractErrorCode instead. This is kept only for legacy support.
 */
const mapBackendErrorToTranslationKey = (errorMessage: string): string => {
  // Minimal fallback mapping for legacy error messages
  // Most errors now use errorCode system, so this is rarely used
  const errorMap: Record<string, string> = {
    // Common legacy error messages (kept as fallback)
    'User is not authenticated': 'api.auth.userNotAuthenticated',
    'User not authenticated': 'api.auth.userNotAuthenticated',
    'Internal server error': 'api.error.internalServerError',
    'Database error': 'api.error.databaseError'
  }
  
  // If message is already a translation key, return it
  if (errorMessage.startsWith('api.')) {
    return errorMessage
  }
  
  return errorMap[errorMessage] || errorMessage
}

