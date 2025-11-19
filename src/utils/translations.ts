/**
 * Map backend error messages to translation keys
 * This function maps backend error messages to their corresponding translation keys
 */
export const mapBackendErrorToTranslationKey = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    // Auth errors
    'Email is required': 'api.auth.emailRequired',
    'Invalid email format': 'api.auth.invalidEmailFormat',
    'Nickname is required': 'api.auth.nicknameRequired',
    'Nickname can only contain letters, numbers, underscore (_) and dash (-)': 'api.auth.nicknameInvalid',
    'Validation failed': 'api.auth.validationFailed',
    'Email and nickname do not match': 'api.auth.emailNicknameMismatch',
    'This email is already registered with a different nickname': 'api.auth.emailRegisteredDifferentNickname',
    'This nickname is already registered with a different email': 'api.auth.nicknameRegisteredDifferentEmail',
    'Nickname does not match email': 'api.auth.nicknameDoesNotMatchEmail',
    'This nickname does not match the email address': 'api.auth.nicknameDoesNotMatchEmailAddress',
    'This nickname is already taken': 'api.auth.nicknameAlreadyTaken',
    'Token not found': 'api.auth.tokenNotFound',
    'User not found': 'api.auth.userNotFound',
    'Invalid token': 'api.auth.invalidToken',
    'An error occurred while checking your email. Please try again.': 'api.auth.errorCheckingEmail',
    'No account found with this email address': 'api.auth.noAccountFound',
    'We have sent your nickname to your email address': 'api.auth.nicknameSent',
    'User is not authenticated': 'api.auth.userNotAuthenticated',
    'User not authenticated': 'api.auth.userNotAuthenticated',
    'Account deleted successfully': 'api.auth.accountDeleted',
    'Failed to delete account': 'api.auth.failedToDeleteAccount',
    'Access token is required': 'api.auth.accessTokenRequired',
    'Invalid or expired token': 'api.auth.invalidOrExpiredToken',
    'Token has expired': 'api.auth.tokenExpired',
    
    // Contact errors
    'Name, email and message are required': 'api.contact.nameEmailMessageRequired',
    'Please remove special characters like quotes, semicolons, or SQL keywords.': 'api.contact.removeSpecialCharacters',
    'Please remove HTML tags and JavaScript code.': 'api.contact.removeHtmlTags',
    'Please use only standard text characters.': 'api.contact.useStandardText',
    'Message sent successfully!': 'api.contact.messageSent',
    
    // Chat errors
    'Message is required': 'api.chat.messageRequired',
    'Message must contain only text characters': 'api.chat.messageMustBeText',
    'Sorry, message must contain only text characters (letters, numbers, spaces and basic punctuation).': 'api.chat.messageTextOnly',
    'Sorry, I can only provide text responses about cats. I cannot generate code, images, files or anything that is not plain text. Ask me a question about cats!': 'api.chat.onlyTextResponses',
    'Ask me a question about cats, their behavior, health, grooming or anything related to cats.': 'api.chat.askAboutCats',
    'Sorry, AI service is not configured. Please add OPENAI_API_KEY to the .env file.': 'api.chat.aiNotConfigured',
    'Sorry, I could not generate a response. Please try again!': 'api.chat.couldNotGenerateResponse',
    'Sorry, I can only provide text responses about cats. Ask me a question about cats!': 'api.chat.onlyTextAboutCats',
    'Sorry, an error occurred while communicating with the AI service. Please try again in a few moments!': 'api.chat.errorCommunicating',
    'Error communicating with chatbot': 'api.chat.errorCommunicatingWithChatbot',
    'Sorry, an error occurred. Please try again!': 'api.chat.errorOccurred',
    'Conversation history cleared': 'api.chat.historyCleared',
    'Error clearing history': 'api.chat.errorClearingHistory',
    
    // Wheel errors
    'Reward is required': 'api.wheel.rewardRequired',
    'You must wait before the next spin': 'api.wheel.mustWait',
    
    // User errors
    'Failed to connect to Supabase. Please check your SUPABASE_URL and ensure the project is active.': 'api.user.supabaseConnectionFailed',
    'Cleanup skipped due to connection issue. Will retry when connection is restored.': 'api.user.cleanupSkipped',
    'Expired rewards cleaned up': 'api.user.expiredRewardsCleaned',
    
    // Cat errors
    'Cat state not found': 'api.cat.stateNotFound',
    'Failed to get cat status': 'api.cat.failedToGetStatus',
    'Cat state already exists': 'api.cat.stateAlreadyExists',
    'Failed to initialize cat state': 'api.cat.failedToInitialize',
    'Cat state initialized': 'api.cat.stateInitialized',
    'Cat is already sleeping': 'api.cat.alreadySleeping',
    'Someone else has already put the cat to sleep!': 'api.cat.someoneElsePutToSleep',
    'Error putting cat to sleep': 'api.cat.errorPuttingToSleep',
    
    // General errors
    'Database error': 'api.error.databaseError',
    'Internal server error': 'api.error.internalServerError'
  }
  
  return errorMap[errorMessage] || errorMessage
}

