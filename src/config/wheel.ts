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
  COOLDOWN_MS: 2 * 60 * 1000, // 2 minutes
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
  PRIZE_DESCRIPTIONS: {
    'New Me, Who Dis?': 'Your old icon is gone. A new identity has appeared. Embrace the chaos, mystery, and possibly worse hair.',
    'Fancy Schmancy Nickname': 'Your nickname just got a glow-up. Prepare to outshine everyone — it\'s giving ✨main character energy✨.',
    'Chase the Yarn!': 'A wild yarn ball appears! Push it, chase it, or let it roll into existential questions about your life choices.',
    'Paw-some Cursor': 'Your cursor is now a cat paw. Warning: excessive cuteness may decrease productivity by 73%.',
    'Royal Meowjesty': 'You\'ve been knighted by the Cat Kingdom. Please use your power responsibly… or dramatically.',
    'Color Catastrophe': 'Everything pink is now blue, everything blue is now pink. It\'s fashion. It\'s chaos. It\'s art.',
    'Spin Again, Brave Soul': 'Fortune says: "Not today." But you get another chance — because persistence (and a bit of luck) never hurt anyone.',
    'Total Cat-astrophe': 'Congratulations! You\'ve achieved absolutely nothing. That\'s still a kind of win, right? 😹'
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
 * Get prize description for a winning item
 */
export const getPrizeDescription = (item: string | null): string => {
  if (!item) return ''
  
  if (item in WHEEL_CONFIG.PRIZE_DESCRIPTIONS) {
    return WHEEL_CONFIG.PRIZE_DESCRIPTIONS[item as keyof typeof WHEEL_CONFIG.PRIZE_DESCRIPTIONS]
  }
  
  return item
}

