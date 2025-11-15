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

