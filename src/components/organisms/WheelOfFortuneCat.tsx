import { Text, Image } from '../atoms'
import { Button } from '../atoms'
import Modal from '../molecules/Modal'
import { useWheelOfFortune } from '../../hooks'
import { WHEEL_CONFIG } from '../../constants'

const WheelOfFortuneCat = () => {
  const {
    rotation,
    isSpinning,
    isModalOpen,
    setIsModalOpen,
    winningItem,
    canSpin,
    cooldownSeconds,
    confetti,
    wheelRef,
    spinWheel,
  } = useWheelOfFortune()

  const colors = WHEEL_CONFIG.COLORS

  const wheelSize = 500
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
  const baseRadius = wheelSize / 2 - 10
  
  // Function that generates irregular radius like a potato
  // Using multiple sine functions for 5 curves and more irregularities
  const getPotatoRadius = (angle: number): number => {
    // 5 curves on full circle = frequency 5
    const variation1 = Math.sin(angle * 5) * 12
    // Additional variations for more irregularities with reduced amplitude
    const variation2 = Math.cos(angle * 2.5) * 5
    const variation3 = Math.sin(angle * 7.5 + Math.PI / 3) * 3
    return baseRadius + variation1 + variation2 + variation3
  }

  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto pt-12">
        <div className="flex flex-row items-center justify-center gap-12 mb-8">
          <div className="relative flex flex-col items-center">
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-10"
              style={{ top: '-80px' }}
            >
              <Image
                src="/images/finnish.svg"
                alt="Pointer"
                className="w-40 h-40 drop-shadow-lg"
              />
            </div>
            <div
              ref={wheelRef}
              className="relative transition-transform duration-[4000ms]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
              }}
            >
              <svg
                width={wheelSize}
                height={wheelSize}
                viewBox={`-30 -30 ${wheelSize + 60} ${wheelSize + 60}`}
                className="drop-shadow-2xl"
              >
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {WHEEL_CONFIG.ITEMS.map((item, index) => {
                  const segmentAngle = 360 / WHEEL_CONFIG.ITEMS.length
                  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
                  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
                  
                  // Generate points along the arc for smooth irregular shape
                  // More points for smoother connection and 5 curves
                  const numPoints = 12
                  const points: Array<{x: number, y: number}> = []
                  
                  for (let i = 0; i <= numPoints; i++) {
                    const angle = startAngle + (endAngle - startAngle) * (i / numPoints)
                    const r = getPotatoRadius(angle)
                    points.push({
                      x: centerX + r * Math.cos(angle),
                      y: centerY + r * Math.sin(angle)
                    })
                  }
                  
                  // Additional point slightly beyond boundary for better continuity
                  const smallStep = (endAngle - startAngle) * 0.1
                  const beyondEndAngle = endAngle + smallStep
                  const beyondEndR = getPotatoRadius(beyondEndAngle)
                  const beyondEndPoint = {
                    x: centerX + beyondEndR * Math.cos(beyondEndAngle),
                    y: centerY + beyondEndR * Math.sin(beyondEndAngle)
                  }
                  
                  // Creating path with smooth cubic bezier curves to avoid "choppy" waves
                  // Using smooth curves also at boundaries for continuity between segments
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
                  
                  const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180)
                  const textRadius = getPotatoRadius(textAngle) * 0.60
                  const textX = centerX + textRadius * Math.cos(textAngle)
                  const textY = centerY + textRadius * Math.sin(textAngle)
                  const textRotation = index * segmentAngle + segmentAngle / 2 + 90
                  
                  // Calculate approximate text width based on segment angle
                  const segmentArcLength = (getPotatoRadius(textAngle) * segmentAngle * Math.PI / 180) * 0.80
                  // Calculate max characters per line - make it smaller to force line breaks
                  const maxCharsPerLine = Math.floor(segmentArcLength / 9)
                  
                  // Split text into lines that fit the segment width (max 2 lines)
                  const words = item.split(' ')
                  const lines: string[] = []
                  
                  // If text has more than 2 words or is longer than threshold, split into 2 lines
                  const shouldSplit = words.length > 2 || item.length > maxCharsPerLine
                  
                  if (!shouldSplit) {
                    // Short text - use one line
                    lines.push(item)
                  } else {
                    // Split into 2 lines - find the best split point
                    const totalLength = item.length
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
                  
                  return (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={colors[index]}
                      />
                      <g transform={`translate(${textX}, ${textY}) rotate(${textRotation})`}>
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-white font-bold pointer-events-none select-none"
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            letterSpacing: '0.2px',
                          }}
                        >
                          {lines.map((line, i) => (
                            <tspan
                              key={i}
                              x="0"
                              dy={i === 0 ? '0' : '1em'}
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </g>
                    </g>
                  )
                })}
                
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="20"
                  fill="#fff"
                  stroke="#4B5563"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
              </svg>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || !canSpin}
                variant="primary"
                size="lg"
                className="min-w-[200px]"
              >
                {isSpinning 
                  ? 'Vrti se...' 
                  : !canSpin 
                    ? `Sačekaj ${cooldownSeconds}s` 
                    : 'Zavrti'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center self-center -mt-16">
            <h2 className="text-5xl font-bold text-black mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(0, 0, 0, 0.2)', lineHeight: '1.3' }}>
            Spin the Cat Wheel of Fortune and discover your destiny!
            </h2>
            <p className="text-xl text-black max-w-md drop-shadow-sm pt-4 leading-relaxed">
              Spin the wheel, meow for luck, and see what fate (or your cat) has in store!
              Remember: nine lives, but only one spin! Prizes may vary depending on the cat's mood. (Good luck with that.)
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Text as="h3" size="2xl" weight="bold" className="text-white">
            Behold! The Wheel Has Spoken!
          </Text>
        }
        footer={
          <Text size="sm" weight="normal" className="text-white text-center italic">
            Don't blame the wheel. Blame the cat that coded it.
          </Text>
        }
        size="md"
      >
        <div className="flex flex-col items-center justify-center py-6 px-4 relative overflow-hidden">
          {winningItem && (
            <>
              <div className="relative w-full flex justify-center mb-8">
                {confetti.map((conf) => (
                  <div
                    key={conf.id}
                    className="confetti-piece"
                    style={{
                      position: 'absolute',
                      left: `${conf.left}%`,
                      top: '50%',
                      width: '10px',
                      height: '10px',
                      backgroundColor: conf.color,
                      borderRadius: '50%',
                      animationDelay: `${conf.delay}s`,
                      animationDuration: `${conf.duration}s`,
                      '--horizontal': `${conf.horizontal}px`,
                      '--vertical': `${conf.vertical}px`,
                      pointerEvents: 'none',
                      zIndex: 10,
                      transform: 'translate(-50%, -50%)'
                    } as React.CSSProperties}
                  />
                ))}
                <Text 
                  as="h3" 
                  size="2xl" 
                  weight="bold" 
                  className="text-center text-white relative z-20 pb-2"
                >
                  "{winningItem}"
                </Text>
              </div>
              <Text 
                size="lg" 
                weight="normal" 
                className="text-center text-white mb-6 max-w-md leading-relaxed"
              >
                {(winningItem && winningItem in WHEEL_CONFIG.PRIZE_DESCRIPTIONS 
                  ? WHEEL_CONFIG.PRIZE_DESCRIPTIONS[winningItem as keyof typeof WHEEL_CONFIG.PRIZE_DESCRIPTIONS]
                  : winningItem) || winningItem}
              </Text>
            </>
          )}
        </div>
      </Modal>
      <style>{`
        @keyframes confettiExplosion {
          0% {
            transform: translate(-50%, -50%) translateX(0) translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateX(var(--horizontal, 0px)) translateY(var(--vertical, 0px)) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
        .confetti-piece {
          animation: confettiExplosion ease-out forwards;
        }
      `}</style>
    </section>
  )
}

export default WheelOfFortuneCat

