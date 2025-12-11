// Wheel configuration and rendering utilities

// ============================================================================
// WHEEL CONFIGURATION
// ============================================================================

export const WHEEL_CONFIG = {
  ITEMS: [
    'New Me, Who Dis?',
    'Fancy Schmancy Nickname',
    'Chase the Yarn!',
    'Paw-some Cursor',
    'Royal Meowjesty',
    'Color Catastrophe',
    'Spin Again, Brave Soul',
    'Total Cat-astrophe'
  ],
  COOLDOWN_MS: 30 * 1000, // 30 seconds
  COLORS: [
    '#F76C9B', // wheel-pink
    '#6EC1E4', // wheel-blue
    '#63D9A0', // wheel-green
    '#F8D44C', // wheel-yellow
    '#FFA85C', // wheel-orange
    '#B488E4', // wheel-purple
    '#5ED3C3', // wheel-teal
    '#F7A7A3'  // wheel-coral
  ],
  // Weights for each prize (higher = more likely to win)
  // Special prizes get 3x weight, others get 1x weight
  PRIZE_WEIGHTS: {
    'New Me, Who Dis?': 1,
    'Fancy Schmancy Nickname': 1,
    'Chase the Yarn!': 1, // More likely
    'Paw-some Cursor': 11, // More likely
    'Royal Meowjesty': 1,
    'Color Catastrophe': 1, // More likely
    'Spin Again, Brave Soul': 1,
    'Total Cat-astrophe': 1
  },
} as const

// ============================================================================
// WHEEL RENDERING CONFIGURATION
// ============================================================================

export const WHEEL_RENDERING_CONFIG = {
  SIZE: 500,
  VIEWBOX_PADDING: 30,
  CENTER_RADIUS: 20,
  TEXT_RADIUS_FACTOR: 0.60,
  SEGMENT_ARC_LENGTH_FACTOR: 0.80,
  CHARS_PER_PIXEL: 9,
  NUM_POINTS_PER_SEGMENT: 12,
  BEYOND_BOUNDARY_STEP: 0.1,
} as const

// ============================================================================
// WHEEL RENDERING UTILITIES
// ============================================================================

export interface WheelDimensions {
  size: number
  centerX: number
  centerY: number
  baseRadius: number
}

/**
 * Get wheel dimensions based on size
 */
export const getWheelDimensions = (size: number = WHEEL_RENDERING_CONFIG.SIZE): WheelDimensions => {
  return {
    size,
    centerX: size / 2,
    centerY: size / 2,
    baseRadius: size / 2 - 10,
  }
}

/**
 * Function that generates irregular radius like a potato
 * Using multiple sine functions for 5 curves and more irregularities
 */
export const getPotatoRadius = (angle: number, baseRadius: number): number => {
  // 5 curves on full circle = frequency 5
  const variation1 = Math.sin(angle * 5) * 12
  // Additional variations for more irregularities with reduced amplitude
  const variation2 = Math.cos(angle * 2.5) * 5
  const variation3 = Math.sin(angle * 7.5 + Math.PI / 3) * 3
  return baseRadius + variation1 + variation2 + variation3
}

/**
 * Calculate segment angle in degrees
 */
export const getSegmentAngle = (): number => {
  return 360 / WHEEL_CONFIG.ITEMS.length
}

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

/**
 * Calculate start and end angles for a segment
 */
export const getSegmentAngles = (index: number): { startAngle: number; endAngle: number } => {
  const segmentAngle = getSegmentAngle()
  const startAngle = degToRad(index * segmentAngle - 90)
  const endAngle = degToRad((index + 1) * segmentAngle - 90)
  return { startAngle, endAngle }
}

/**
 * Generate points along an arc for smooth irregular shape
 */
export const generateArcPoints = (
  startAngle: number,
  endAngle: number,
  centerX: number,
  centerY: number,
  baseRadius: number,
  numPoints: number = WHEEL_RENDERING_CONFIG.NUM_POINTS_PER_SEGMENT
): Array<{ x: number; y: number }> => {
  const points: Array<{ x: number; y: number }> = []
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / numPoints)
    const r = getPotatoRadius(angle, baseRadius)
    points.push({
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    })
  }
  
  return points
}

/**
 * Generate a point slightly beyond the boundary for better continuity
 */
export const getBeyondBoundaryPoint = (
  endAngle: number,
  centerX: number,
  centerY: number,
  baseRadius: number,
  step: number = WHEEL_RENDERING_CONFIG.BEYOND_BOUNDARY_STEP
): { x: number; y: number } => {
  const smallStep = step
  const beyondEndAngle = endAngle + smallStep
  const beyondEndR = getPotatoRadius(beyondEndAngle, baseRadius)
  return {
    x: centerX + beyondEndR * Math.cos(beyondEndAngle),
    y: centerY + beyondEndR * Math.sin(beyondEndAngle)
  }
}

/**
 * Generate SVG path data for a wheel segment using cubic bezier curves
 */
export const generateSegmentPath = (
  points: Array<{ x: number; y: number }>,
  beyondEndPoint: { x: number; y: number },
  centerX: number,
  centerY: number
): string => {
  let pathData = `M ${centerX} ${centerY} L ${points[0].x} ${points[0].y} `
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const isLastPoint = i === points.length - 1
    
    if (isLastPoint) {
      // Last point of segment - use additional point beyond boundary for smooth connection
      const cp1X = prev.x + (curr.x - prev.x) * 0.4
      const cp1Y = prev.y + (curr.y - prev.y) * 0.4
      // Control point that leads towards point beyond boundary for smoother transition
      const cp2X = curr.x + (beyondEndPoint.x - curr.x) * 0.3
      const cp2Y = curr.y + (beyondEndPoint.y - curr.y) * 0.3
      pathData += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${curr.x} ${curr.y} `
    } else {
      // Middle points - use cubic bezier curves for smoothness
      const next = points[i + 1]
      const cp1X = prev.x + (curr.x - prev.x) * 0.5
      const cp1Y = prev.y + (curr.y - prev.y) * 0.5
      const cp2X = curr.x + (next.x - curr.x) * 0.5
      const cp2Y = curr.y + (next.y - curr.y) * 0.5
      pathData += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${curr.x} ${curr.y} `
    }
  }
  
  pathData += 'Z'
  return pathData
}

/**
 * Calculate text position and rotation for a segment
 */
export const getTextPosition = (
  index: number,
  centerX: number,
  centerY: number,
  baseRadius: number
): { x: number; y: number; rotation: number } => {
  const segmentAngle = getSegmentAngle()
  const textAngle = degToRad(index * segmentAngle + segmentAngle / 2 - 90)
  const textRadius = getPotatoRadius(textAngle, baseRadius) * WHEEL_RENDERING_CONFIG.TEXT_RADIUS_FACTOR
  const textX = centerX + textRadius * Math.cos(textAngle)
  const textY = centerY + textRadius * Math.sin(textAngle)
  const textRotation = index * segmentAngle + segmentAngle / 2 + 90
  
  return { x: textX, y: textY, rotation: textRotation }
}

/**
 * Split text into lines that fit the segment width (max 2 lines)
 */
export const formatTextForSegment = (
  text: string,
  textAngle: number,
  baseRadius: number,
  segmentAngle: number
): string[] => {
  const segmentArcLength = (getPotatoRadius(textAngle, baseRadius) * degToRad(segmentAngle)) * WHEEL_RENDERING_CONFIG.SEGMENT_ARC_LENGTH_FACTOR
  const maxCharsPerLine = Math.floor(segmentArcLength / WHEEL_RENDERING_CONFIG.CHARS_PER_PIXEL)
  
  const words = text.split(' ')
  const lines: string[] = []
  
  // If text has more than 2 words or is longer than threshold, split into 2 lines
  const shouldSplit = words.length > 2 || text.length > maxCharsPerLine
  
  if (!shouldSplit) {
    // Short text - use one line
    lines.push(text)
  } else {
    // Split into 2 lines - find the best split point
    const totalLength = text.length
    const targetSplit = Math.floor(totalLength / 2)
    
    // Find the space closest to the middle
    let bestSplitIndex = -1
    let bestDistance = Infinity
    
    for (let i = 0; i < words.length - 1; i++) {
      const line1Length = words.slice(0, i + 1).join(' ').length
      const distance = Math.abs(line1Length - targetSplit)
      if (distance < bestDistance) {
        bestDistance = distance
        bestSplitIndex = i
      }
    }
    
    if (bestSplitIndex >= 0 && bestSplitIndex < words.length - 1) {
      lines.push(words.slice(0, bestSplitIndex + 1).join(' '))
      lines.push(words.slice(bestSplitIndex + 1).join(' '))
    } else {
      // Fallback: split in the middle of word count
      const midPoint = Math.max(1, Math.floor(words.length / 2))
      lines.push(words.slice(0, midPoint).join(' '))
      lines.push(words.slice(midPoint).join(' '))
    }
  }
  
  return lines
}

/**
 * Get weighted random prize index based on PRIZE_WEIGHTS
 * Prizes with higher weights are more likely to be selected
 */
export const getWeightedRandomPrizeIndex = (): number => {
  const items = WHEEL_CONFIG.ITEMS
  const weights = WHEEL_CONFIG.PRIZE_WEIGHTS
  
  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + weights[item as keyof typeof weights], 0)
  
  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight
  
  // Find which prize this random number falls into
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const weight = weights[item as keyof typeof weights]
    random -= weight
    
    if (random <= 0) {
      return i
    }
  }
  
  // Fallback to last item (should never reach here)
  return items.length - 1
}

/**
 * Get prize description for a winning item
 * @param item - The prize item name
 * @param t - Optional translation function. If provided, will return translated description
 */
export const getPrizeDescription = (item: string | null, t?: (key: string) => string): string => {
  if (!item) return ''
  
  // Translation function should always be provided
  if (t) {
    const prizeKeyMap: Record<string, string> = {
      'New Me, Who Dis?': 'wheel.prizeDescriptions.newMeWhoDis',
      'Fancy Schmancy Nickname': 'wheel.prizeDescriptions.fancySchmancyNickname',
      'Chase the Yarn!': 'wheel.prizeDescriptions.chaseTheYarn',
      'Paw-some Cursor': 'wheel.prizeDescriptions.pawSomeCursor',
      'Royal Meowjesty': 'wheel.prizeDescriptions.royalMeowjesty',
      'Color Catastrophe': 'wheel.prizeDescriptions.colorCatastrophe',
      'Spin Again, Brave Soul': 'wheel.prizeDescriptions.spinAgainBraveSoul',
      'Total Cat-astrophe': 'wheel.prizeDescriptions.totalCatastrophe'
    }
    
    const translationKey = prizeKeyMap[item]
    if (translationKey) {
      const translated = t(translationKey)
      // If translation returns the key itself, it means translation is missing
      // Return the item name as fallback
      return translated !== translationKey ? translated : item
    }
  }
  
  // Fallback: return item name if translation is not available
  return item
}

/**
 * Get translated prize name
 * @param item - The prize item name
 * @param t - Translation function
 */
export const getTranslatedPrizeName = (item: string, t: (key: string) => string): string => {
  const prizeKeyMap: Record<string, string> = {
    'New Me, Who Dis?': 'wheel.prizes.newMeWhoDis',
    'Fancy Schmancy Nickname': 'wheel.prizes.fancySchmancyNickname',
    'Chase the Yarn!': 'wheel.prizes.chaseTheYarn',
    'Paw-some Cursor': 'wheel.prizes.pawSomeCursor',
    'Royal Meowjesty': 'wheel.prizes.royalMeowjesty',
    'Color Catastrophe': 'wheel.prizes.colorCatastrophe',
    'Spin Again, Brave Soul': 'wheel.prizes.spinAgainBraveSoul',
    'Total Cat-astrophe': 'wheel.prizes.totalCatastrophe'
  }
  
  const translationKey = prizeKeyMap[item]
  if (translationKey) {
    return t(translationKey)
  }
  
  return item
}


