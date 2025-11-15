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
    'Nickname already exists': 'api.auth.nicknameAlreadyExists',
    'This nickname is already taken': 'api.auth.nicknameAlreadyTaken',
    'Email already exists': 'api.auth.emailAlreadyExists',
    'This email is already taken': 'api.auth.emailAlreadyTaken',
    'Token not found': 'api.auth.tokenNotFound',
    'User not found': 'api.auth.userNotFound',
    'Invalid token': 'api.auth.invalidToken',
    'An error occurred while checking your email. Please try again.': 'api.auth.errorCheckingEmail',
    'No account found with this email address': 'api.auth.noAccountFound',
    'We have sent your nickname to your email address': 'api.auth.nicknameSent',
    'User is not authenticated': 'api.auth.userNotAuthenticated',
    'Account deleted successfully': 'api.auth.accountDeleted',
    'Access token is required': 'api.auth.accessTokenRequired',
    'Invalid or expired token': 'api.auth.invalidOrExpiredToken',
    'Token has expired': 'api.auth.tokenExpired',
    'Failed to delete account': 'api.auth.userNotAuthenticated',
    
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

const CURSOR_STYLE_ID = 'paw-cursor-style'
let currentCursorUrl: string | null = null
let cursorObserver: MutationObserver | null = null
let navigationListener: (() => void) | null = null
let originalPushState: typeof history.pushState | null = null
let originalReplaceState: typeof history.replaceState | null = null
let isHistoryIntercepted = false

/**
 * Apply cursor to all elements in the document
 * Note: We rely on CSS stylesheet for cursor styling, but we can force a reflow
 * to ensure styles are applied correctly
 */
const applyCursorToAllElements = (cursorUrl: string): void => {
  // Force a reflow to ensure CSS styles are applied
  // This helps when elements are added dynamically
  void document.body.offsetHeight
  
  // Reapply cursor style to body and html to ensure it's active
  if (document.body) {
    document.body.style.cursor = `url('${cursorUrl}') 16 16, auto`
  }
  if (document.documentElement) {
    document.documentElement.style.cursor = `url('${cursorUrl}') 16 16, auto`
  }
}

/**
 * Set up MutationObserver to apply cursor to new elements and watch for attribute changes
 */
const setupCursorObserver = (): void => {
  // Remove existing observer if any
  if (cursorObserver) {
    cursorObserver.disconnect()
  }
  
  // Create new observer
  cursorObserver = new MutationObserver((mutations) => {
    if (!currentCursorUrl) return
    
      mutations.forEach((mutation) => {
      // Handle new nodes being added (e.g., during navigation)
      // CSS stylesheet should handle cursor automatically, but we ensure it's applied
      if (mutation.addedNodes.length > 0) {
        // Force a reflow to ensure CSS is applied to new elements
        void document.body.offsetHeight
      }
      
      // Handle attribute changes (style, class changes that might affect cursor)
      if (mutation.type === 'attributes') {
        const target = mutation.target as HTMLElement
        // If style attribute was changed, we might need to reapply cursor
        // But CSS should handle it, so we just ensure the style tag is still there
        if (target && mutation.attributeName === 'style') {
          // Force a reflow to ensure CSS takes precedence
          void target.offsetHeight
        }
      }
    })
  })
  
  // Start observing - watch for new nodes AND attribute changes
  cursorObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'] // Watch for style and class changes
  })
}

/**
 * Apply custom cursor from image URL
 */
export const applyCustomCursor = async (cursorUrl: string): Promise<void> => {
  currentCursorUrl = cursorUrl
  // Remove existing style if any
  const existingStyle = document.getElementById(CURSOR_STYLE_ID)
  if (existingStyle) {
    existingStyle.remove()
  }

  try {
    // Fetch PNG and convert to data URL
    const response = await fetch(cursorUrl)
    
    if (!response.ok) {
      console.error('❌ Failed to fetch cursor image:', response.status, response.statusText)
      applyCursorFallback(cursorUrl)
      return
    }
    
    const blob = await response.blob()
    
    if (blob.size === 0) {
      console.error('❌ Cursor blob is empty')
      applyCursorFallback(cursorUrl)
      return
    }
    
    const reader = new FileReader()
    
    reader.onloadend = async () => {
      const dataUrl = reader.result as string
      
      if (!dataUrl || dataUrl.length === 0) {
        console.error('❌ Data URL is empty')
        applyCursorFallback(cursorUrl)
        return
      }
      
      // Resize image to 32x32 for cursor (cursors must be small)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          console.error('❌ Could not get canvas context')
          applyCursorFallback(cursorUrl)
          return
        }
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, 32, 32)
        
        // Convert to data URL
        const resizedDataUrl = canvas.toDataURL('image/png')
        
        // Apply custom cursor using resized data URL
        // Hotspot at center (16, 16) for 32x32 image
        const style = document.createElement('style')
        style.id = CURSOR_STYLE_ID
        style.textContent = `
          html, body, * {
            cursor: url('${resizedDataUrl}') 16 16, auto !important;
          }
          /* Links and interactive elements - must be very specific with maximum specificity */
          a, a *, a:hover, a:focus, a:active, a:visited, a:hover *, a:focus *, a:active *, a:visited *,
          button, button *, button:hover, button:focus, button:active, button:hover *, button:focus *, button:active *,
          [role="button"], [role="button"] *, [role="button"]:hover, [role="button"]:focus, [role="button"]:active,
          [role="button"]:hover *, [role="button"]:focus *, [role="button"]:active *,
          input, input:hover, input:focus,
          textarea, textarea:hover, textarea:focus,
          select, select:hover, select:focus,
          label, label:hover, label:focus,
          .cursor-pointer, .cursor-pointer *, .cursor-pointer:hover, .cursor-pointer:focus,
          .cursor-pointer:hover *, .cursor-pointer:focus * {
            cursor: url('${resizedDataUrl}') 16 16, pointer !important;
          }
          /* Extra specific selectors for links to ensure they always show pointer cursor */
          html body a, html body a:hover, html body a:focus, html body a:active, html body a:visited,
          html body a *, html body a:hover *, html body a:focus *, html body a:active *, html body a:visited * {
            cursor: url('${resizedDataUrl}') 16 16, pointer !important;
          }
          /* Ensure cursor applies to all elements including dropdowns, modals, etc. */
          div, span, p, h1, h2, h3, h4, h5, h6, li, ul, ol, nav, header, footer, main, section, article, aside {
            cursor: url('${resizedDataUrl}') 16 16, auto !important;
          }
          /* Override any inline cursor styles - but preserve pointer for links */
          [style*="cursor"]:not(a):not(button):not([role="button"]) {
            cursor: url('${resizedDataUrl}') 16 16, auto !important;
          }
          /* Override Tailwind cursor classes - must come after general rules */
          .cursor-auto, .cursor-auto:hover, .cursor-auto:focus,
          .cursor-default, .cursor-default:hover, .cursor-default:focus {
            cursor: url('${resizedDataUrl}') 16 16, auto !important;
          }
        `
        document.head.appendChild(style)
        
        // Also set on body and html directly as fallback
        document.body.style.cursor = `url('${resizedDataUrl}') 16 16, auto`
        document.documentElement.style.cursor = `url('${resizedDataUrl}') 16 16, auto`
        
        // Update current cursor URL to data URL
        currentCursorUrl = resizedDataUrl
        
        // Force cursor update on all existing elements
        // Use multiple timeouts to ensure it's applied correctly
        setTimeout(() => {
          applyCursorToAllElements(resizedDataUrl)
        }, 100)
        
        // Second application to ensure it's applied after any async operations
        setTimeout(() => {
          applyCursorToAllElements(resizedDataUrl)
        }, 300)
        
        // Set up observer for new elements
        setupCursorObserver()
        
        // Set up navigation listener to reapply cursor after route changes
        setupNavigationListener(resizedDataUrl)
        
        console.log('✅ Cursor applied successfully with resized image')
      }
      
      img.onerror = () => {
        console.error('❌ Error loading image for resizing')
        applyCursorFallback(cursorUrl)
      }
      
      img.src = dataUrl
    }
    
    reader.onerror = () => {
      console.error('❌ Error reading PNG file')
      applyCursorFallback(cursorUrl)
    }
    
    reader.readAsDataURL(blob)
  } catch (error) {
    console.error('❌ Error loading PNG cursor:', error)
    applyCursorFallback(cursorUrl)
  }
}

/**
 * Fallback method to apply cursor using direct path
 */
const applyCursorFallback = (cursorUrl: string): void => {
  console.log('🔄 Using fallback method with direct path:', cursorUrl)
  
  // Remove existing style if any
  const existingStyle = document.getElementById(CURSOR_STYLE_ID)
  if (existingStyle) {
    existingStyle.remove()
  }
  
  // Apply custom cursor using direct path
  const style = document.createElement('style')
  style.id = CURSOR_STYLE_ID
  style.textContent = `
    html, body, * {
      cursor: url('${cursorUrl}') 16 16, auto !important;
    }
    /* Links and interactive elements - must be very specific with maximum specificity */
    a, a *, a:hover, a:focus, a:active, a:visited, a:hover *, a:focus *, a:active *, a:visited *,
    button, button *, button:hover, button:focus, button:active, button:hover *, button:focus *, button:active *,
    [role="button"], [role="button"] *, [role="button"]:hover, [role="button"]:focus, [role="button"]:active,
    [role="button"]:hover *, [role="button"]:focus *, [role="button"]:active *,
    input, input:hover, input:focus,
    textarea, textarea:hover, textarea:focus,
    select, select:hover, select:focus,
    label, label:hover, label:focus,
    .cursor-pointer, .cursor-pointer *, .cursor-pointer:hover, .cursor-pointer:focus,
    .cursor-pointer:hover *, .cursor-pointer:focus * {
      cursor: url('${cursorUrl}') 16 16, pointer !important;
    }
    /* Extra specific selectors for links to ensure they always show pointer cursor */
    html body a, html body a:hover, html body a:focus, html body a:active, html body a:visited,
    html body a *, html body a:hover *, html body a:focus *, html body a:active *, html body a:visited * {
      cursor: url('${cursorUrl}') 16 16, pointer !important;
    }
    /* Ensure cursor applies to all elements including dropdowns, modals, etc. */
    div, span, p, h1, h2, h3, h4, h5, h6, li, ul, ol, nav, header, footer, main, section, article, aside {
      cursor: url('${cursorUrl}') 16 16, auto !important;
    }
    /* Override any inline cursor styles - but preserve pointer for links */
    [style*="cursor"]:not(a):not(button):not([role="button"]) {
      cursor: url('${cursorUrl}') 16 16, auto !important;
    }
    /* Override Tailwind cursor classes - must come after general rules */
    .cursor-auto, .cursor-auto:hover, .cursor-auto:focus,
    .cursor-default, .cursor-default:hover, .cursor-default:focus {
      cursor: url('${cursorUrl}') 16 16, auto !important;
    }
  `
  document.head.appendChild(style)
  
  // Also set on body and html directly as fallback
  document.body.style.cursor = `url('${cursorUrl}') 16 16, auto`
  document.documentElement.style.cursor = `url('${cursorUrl}') 16 16, auto`
  
  // Update current cursor URL
  currentCursorUrl = cursorUrl
  
  // Force cursor update on all existing elements
  // Use multiple timeouts to ensure it's applied correctly
  setTimeout(() => {
    applyCursorToAllElements(cursorUrl)
  }, 100)
  
  // Second application to ensure it's applied after any async operations
  setTimeout(() => {
    applyCursorToAllElements(cursorUrl)
  }, 300)
  
  // Set up observer for new elements
  setupCursorObserver()
  
  // Set up navigation listener to reapply cursor after route changes
  setupNavigationListener(cursorUrl)
  
  console.log('✅ Fallback cursor applied')
}

/**
 * Set up navigation listener to reapply cursor after React Router navigation
 */
const setupNavigationListener = (cursorUrl: string): void => {
  // Remove existing listener if any
  if (navigationListener) {
    window.removeEventListener('popstate', navigationListener)
    navigationListener = null
  }
  
  // Create navigation handler
  navigationListener = () => {
    if (!currentCursorUrl) return
    
    // Reapply cursor after a delay to allow DOM to update
    // Use multiple timeouts to ensure it's applied even if React Router takes longer
    setTimeout(() => {
      if (currentCursorUrl) {
        applyCursorToAllElements(cursorUrl)
        // Also reapply to body and html
        if (document.body) {
          document.body.style.cursor = `url('${cursorUrl}') 16 16, auto`
        }
        if (document.documentElement) {
          document.documentElement.style.cursor = `url('${cursorUrl}') 16 16, auto`
        }
      }
    }, 150)
    
    // Second application after longer delay to catch any late DOM updates
    setTimeout(() => {
      if (currentCursorUrl) {
        applyCursorToAllElements(cursorUrl)
      }
    }, 500)
  }
  
  // Listen for browser navigation (back/forward)
  window.addEventListener('popstate', navigationListener)
  
  // Also listen for React Router navigation by intercepting pushState/replaceState
  // Only intercept once to avoid multiple wrappers
  if (!isHistoryIntercepted) {
    originalPushState = history.pushState.bind(history)
    originalReplaceState = history.replaceState.bind(history)
    
    history.pushState = function(...args) {
      originalPushState!.apply(history, args)
      setTimeout(() => navigationListener?.(), 100)
    }
    
    history.replaceState = function(...args) {
      originalReplaceState!.apply(history, args)
      setTimeout(() => navigationListener?.(), 100)
    }
    
    isHistoryIntercepted = true
  }
}

/**
 * Remove custom cursor and revert to default
 */
export const removeCustomCursor = (): void => {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    currentCursorUrl = null
    
    // Disconnect observer
    if (cursorObserver) {
      cursorObserver.disconnect()
      cursorObserver = null
    }
    
    // Remove navigation listener
    if (navigationListener) {
      window.removeEventListener('popstate', navigationListener)
      navigationListener = null
    }
    
    // Restore original history methods if they were intercepted
    if (isHistoryIntercepted && originalPushState && originalReplaceState) {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      originalPushState = null
      originalReplaceState = null
      isHistoryIntercepted = false
    }
    
    const existingStyle = document.getElementById(CURSOR_STYLE_ID)
    if (existingStyle) {
      existingStyle.remove()
    }
    
    // Also reset body and html cursor
    if (document.body) {
      document.body.style.cursor = ''
    }
    if (document.documentElement) {
      document.documentElement.style.cursor = ''
    }
    
    // Reset all elements
    const allElements = document.querySelectorAll('*')
    allElements.forEach(el => {
      (el as HTMLElement).style.cursor = ''
    })
  })
}

const COLOR_STYLE_ID = 'color-catastrophe-style'
let colorSwapObserver: MutationObserver | null = null

/**
 * Apply color theme swap (pink to blue, blue to pink)
 * Uses global hue-rotate filter to swap all colors
 */
export const applyColorSwap = (): void => {
  // Remove existing style if any
  const existingStyle = document.getElementById(COLOR_STYLE_ID)
  if (existingStyle) {
    existingStyle.remove()
  }
  
  // Apply CSS filter to swap pink to blue
  // Apply to html element but use isolation to prevent affecting fixed positioned elements
  const style = document.createElement('style')
  style.id = COLOR_STYLE_ID
  style.textContent = `
    html {
      filter: hue-rotate(180deg) saturate(1.2) !important;
    }
    /* Exclude fixed positioned elements (like modals) from filter to prevent layout shifts */
    /* Target modal by data attribute for precise selection */
    [data-modal="true"] {
      filter: none !important;
      isolation: isolate;
      transform: translateZ(0);
    }
  `
  document.head.appendChild(style)
  
  // Apply directly to html element for immediate effect (synchronous, no requestAnimationFrame)
  if (document.documentElement) {
    document.documentElement.style.setProperty('filter', 'hue-rotate(180deg) saturate(1.2)', 'important')
  }
  
  // Force a reflow to ensure the style is applied immediately
  void document.documentElement.offsetHeight
  
  // Disconnect observer if it exists
  if (colorSwapObserver) {
    colorSwapObserver.disconnect()
    colorSwapObserver = null
  }
}

/**
 * Remove color theme swap
 */
export const removeColorSwap = (): void => {
  const existingStyle = document.getElementById(COLOR_STYLE_ID)
  if (existingStyle) {
    existingStyle.remove()
  }
  
  // Remove filter from html element (synchronous, no requestAnimationFrame)
  if (document.documentElement) {
    document.documentElement.style.filter = ''
    document.documentElement.style.removeProperty('filter')
  }
  
  // Force a reflow to ensure the style is removed immediately
  void document.documentElement.offsetHeight
  
  // Disconnect observer if it exists
  if (colorSwapObserver) {
    colorSwapObserver.disconnect()
    colorSwapObserver = null
  }
}

/**
 * Get user's default avatar based on userId/nickname (same logic as backend)
 */
export const getUserDefaultAvatar = (userId: string | undefined, nickname: string): string => {
  const identifier = userId || nickname || 'default'
  
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Get absolute value and map to 1-10 range
  const catNumber = (Math.abs(hash) % 10) + 1
  return `/images/user-profile-icons/cat${catNumber}.svg`
}

