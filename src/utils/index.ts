// Utility funkcije
// Primjer: formatDate, debounce, validateEmail, itd.

const CURSOR_STYLE_ID = 'paw-cursor-style'
let currentCursorUrl: string | null = null
let cursorObserver: MutationObserver | null = null
let navigationListener: (() => void) | null = null
let originalPushState: typeof history.pushState | null = null
let originalReplaceState: typeof history.replaceState | null = null
let isHistoryIntercepted = false

/**
 * Apply cursor to a specific element
 */
const applyCursorToElement = (element: HTMLElement, cursorUrl: string): void => {
  if (element.style) {
    element.style.cursor = `url('${cursorUrl}') 16 16, auto`
  }
}

/**
 * Apply cursor to all elements in the document
 */
const applyCursorToAllElements = (cursorUrl: string): void => {
  const allElements = document.querySelectorAll('*')
  allElements.forEach(el => {
    applyCursorToElement(el as HTMLElement, cursorUrl)
  })
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
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          applyCursorToElement(element, currentCursorUrl!)
          // Also apply to all children
          const children = element.querySelectorAll('*')
          children.forEach(child => {
            applyCursorToElement(child as HTMLElement, currentCursorUrl!)
          })
        }
      })
      
      // Handle attribute changes (style, class changes that might affect cursor)
      if (mutation.type === 'attributes') {
        const target = mutation.target as HTMLElement
        if (target && target.style) {
          // Reapply cursor if style or class was changed
          applyCursorToElement(target, currentCursorUrl!)
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
          button, a, [role="button"], input, textarea, select, label {
            cursor: url('${resizedDataUrl}') 16 16, pointer !important;
          }
          /* Ensure cursor applies to all elements including dropdowns, modals, etc. */
          div, span, p, h1, h2, h3, h4, h5, h6, li, ul, ol, nav, header, footer, main, section, article, aside {
            cursor: url('${resizedDataUrl}') 16 16, auto !important;
          }
          /* Override any inline cursor styles */
          [style*="cursor"] {
            cursor: url('${resizedDataUrl}') 16 16, auto !important;
          }
          /* Override Tailwind cursor classes - must come after general rules */
          .cursor-pointer, .cursor-pointer:hover, .cursor-pointer:focus,
          .cursor-auto, .cursor-auto:hover, .cursor-auto:focus,
          .cursor-default, .cursor-default:hover, .cursor-default:focus {
            cursor: url('${resizedDataUrl}') 16 16, pointer !important;
          }
          /* Ensure cursor persists on all hover and focus states */
          a:hover, a:focus, a:active,
          button:hover, button:focus, button:active,
          [role="button"]:hover, [role="button"]:focus, [role="button"]:active,
          input:hover, input:focus,
          textarea:hover, textarea:focus,
          select:hover, select:focus,
          label:hover, label:focus {
            cursor: url('${resizedDataUrl}') 16 16, pointer !important;
          }
          /* Catch-all for any hover state */
          *:hover {
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
        setTimeout(() => {
          applyCursorToAllElements(resizedDataUrl)
        }, 100)
        
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
    button, a, [role="button"], input, textarea, select, label {
      cursor: url('${cursorUrl}') 16 16, pointer !important;
    }
    /* Ensure cursor applies to all elements including dropdowns, modals, etc. */
    div, span, p, h1, h2, h3, h4, h5, h6, li, ul, ol, nav, header, footer, main, section, article, aside {
      cursor: url('${cursorUrl}') 16 16, auto !important;
    }
    /* Override any inline cursor styles */
    [style*="cursor"] {
      cursor: url('${cursorUrl}') 16 16, auto !important;
    }
    /* Override Tailwind cursor classes - must come after general rules */
    .cursor-pointer, .cursor-pointer:hover, .cursor-pointer:focus,
    .cursor-auto, .cursor-auto:hover, .cursor-auto:focus,
    .cursor-default, .cursor-default:hover, .cursor-default:focus {
      cursor: url('${cursorUrl}') 16 16, pointer !important;
    }
    /* Ensure cursor persists on all hover and focus states */
    a:hover, a:focus, a:active,
    button:hover, button:focus, button:active,
    [role="button"]:hover, [role="button"]:focus, [role="button"]:active,
    input:hover, input:focus,
    textarea:hover, textarea:focus,
    select:hover, select:focus,
    label:hover, label:focus {
      cursor: url('${cursorUrl}') 16 16, pointer !important;
    }
    /* Catch-all for any hover state */
    *:hover {
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
  setTimeout(() => {
    applyCursorToAllElements(cursorUrl)
  }, 100)
  
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
    
    // Reapply cursor after a short delay to allow DOM to update
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
    }, 100)
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
      setTimeout(() => navigationListener?.(), 50)
    }
    
    history.replaceState = function(...args) {
      originalReplaceState!.apply(history, args)
      setTimeout(() => navigationListener?.(), 50)
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

