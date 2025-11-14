// Utility funkcije
// Primjer: formatDate, debounce, validateEmail, itd.

const CURSOR_STYLE_ID = 'paw-cursor-style'
let currentCursorUrl: string | null = null
let cursorObserver: MutationObserver | null = null

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
 * Set up MutationObserver to apply cursor to new elements
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
    })
  })
  
  // Start observing
  cursorObserver.observe(document.body, {
    childList: true,
    subtree: true
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
  
  console.log('✅ Fallback cursor applied')
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
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    // Remove existing style if any
    const existingStyle = document.getElementById(COLOR_STYLE_ID)
    if (existingStyle) {
      existingStyle.remove()
    }
    
    // Apply CSS filter to swap pink to blue
    const style = document.createElement('style')
    style.id = COLOR_STYLE_ID
    style.textContent = `
      html, body {
        filter: hue-rotate(180deg) saturate(1.2) !important;
      }
      /* Override specific pink colors to blue */
      [class*="brand-pink"], [class*="pink-"] {
        filter: hue-rotate(180deg) !important;
      }
    `
    document.head.appendChild(style)
    
    // Also apply directly to html and body elements for immediate effect
    if (document.documentElement) {
      document.documentElement.style.filter = 'hue-rotate(180deg) saturate(1.2)'
    }
    if (document.body) {
      document.body.style.filter = 'hue-rotate(180deg) saturate(1.2)'
    }
    
    // Disconnect observer if it exists
    if (colorSwapObserver) {
      colorSwapObserver.disconnect()
      colorSwapObserver = null
    }
  })
}

/**
 * Remove color theme swap
 */
export const removeColorSwap = (): void => {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    const existingStyle = document.getElementById(COLOR_STYLE_ID)
    if (existingStyle) {
      existingStyle.remove()
    }
    
    // Remove filter from html and body elements
    if (document.documentElement) {
      document.documentElement.style.filter = ''
    }
    if (document.body) {
      document.body.style.filter = ''
    }
    
    // Disconnect observer if it exists
    if (colorSwapObserver) {
      colorSwapObserver.disconnect()
      colorSwapObserver = null
    }
  })
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

