import { useState, useRef, useEffect } from 'react'
import { Text, Image } from '../atoms'
import { Button } from '../atoms'
import Modal from '../molecules/Modal'
import { wheelService } from '../../services'
import { authService } from '../../services'
import { useI18n } from '../../contexts/i18n'

const WHEEL_ITEMS = [
  'New Me, Who Dis?',
  'Fancy Schmancy Nickname',
  'Chase the Yarn!',
  'Paw-some Cursor',
  'Royal Meowjesty',
  'Color Catastrophe',
  'Spin Again, Brave Soul',
  'Total Cat-astrophe'
]

const PRIZE_DESCRIPTIONS: Record<string, string> = {
  'New Me, Who Dis?': 'Your old icon is gone. A new identity has appeared. Embrace the chaos, mystery, and possibly worse hair.',
  'Fancy Schmancy Nickname': 'Your nickname just got a glow-up. Prepare to outshine everyone — it\'s giving ✨main character energy✨.',
  'Chase the Yarn!': 'A wild yarn ball appears! Push it, chase it, or let it roll into existential questions about your life choices.',
  'Paw-some Cursor': 'Your cursor is now a cat paw. Warning: excessive cuteness may decrease productivity by 73%.',
  'Royal Meowjesty': 'You\'ve been knighted by the Cat Kingdom. Please use your power responsibly… or dramatically.',
  'Color Catastrophe': 'Everything pink is now blue, everything blue is now pink. It\'s fashion. It\'s chaos. It\'s art.',
  'Spin Again, Brave Soul': 'Fortune says: "Not today." But you get another chance — because persistence (and a bit of luck) never hurt anyone.',
  'Total Cat-astrophe': 'Congratulations! You\'ve achieved absolutely nothing. That\'s still a kind of win, right? 😹'
}

const WheelOfFortuneCat = () => {
  const { t } = useI18n()
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [winningItem, setWinningItem] = useState<string | null>(null)
  const [canSpin, setCanSpin] = useState(true)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; left: number; delay: number; duration: number; horizontal: number; vertical: number }>>([])
  const wheelRef = useRef<HTMLDivElement>(null)
  const lastSpinTimeRef = useRef<number | null>(null)

  // Check initial cooldown status on mount (only once, no periodic calls)
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      setCanSpin(false)
      return
    }

    // Get last spin time from localStorage if available
    const storedLastSpin = localStorage.getItem('wheel_last_spin_time')
    if (storedLastSpin) {
      const lastSpinTime = parseInt(storedLastSpin, 10)
      const now = Date.now()
      const timeSinceLastSpin = now - lastSpinTime
      const cooldownMs = 2 * 60 * 1000 // 2 minutes

      if (timeSinceLastSpin < cooldownMs) {
        lastSpinTimeRef.current = lastSpinTime
        const remainingMs = cooldownMs - timeSinceLastSpin
        const remainingSeconds = Math.ceil(remainingMs / 1000)
        setCooldownSeconds(remainingSeconds)
        setCanSpin(false)
      } else {
        // Cooldown expired, clear storage
        localStorage.removeItem('wheel_last_spin_time')
        lastSpinTimeRef.current = null
        setCooldownSeconds(0)
        setCanSpin(true)
      }
    }
  }, [])

  // Update cooldown timer every second (only local, no API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSpinTimeRef.current) {
        const now = Date.now()
        const timeSinceLastSpin = now - lastSpinTimeRef.current
        const cooldownMs = 2 * 60 * 1000 // 2 minutes
        const remainingMs = cooldownMs - timeSinceLastSpin

        if (remainingMs > 0) {
          const remainingSeconds = Math.ceil(remainingMs / 1000)
          setCooldownSeconds(remainingSeconds)
          setCanSpin(false)
        } else {
          setCooldownSeconds(0)
          setCanSpin(true)
          lastSpinTimeRef.current = null
          localStorage.removeItem('wheel_last_spin_time')
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Clear confetti when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setConfetti([])
    }
  }, [isModalOpen])

  const spinWheel = async () => {
    if (isSpinning || !canSpin) return

    const user = authService.getCurrentUser()
    if (!user) {
      alert(t('wheel.mustBeLoggedIn'))
      return
    }

    setIsSpinning(true)
    setCanSpin(false)
    
    const spins = Math.floor(Math.random() * 5) + 3
    const segmentAngle = 360 / WHEEL_ITEMS.length
    const winningIndex = Math.floor(Math.random() * WHEEL_ITEMS.length)
    const segmentCenterAngle = -90 + (winningIndex * segmentAngle) + (segmentAngle / 2)
    const currentRotationNormalized = ((rotation % 360) + 360) % 360
    const segmentCenterAtZero = ((segmentCenterAngle + 90) % 360 + 360) % 360
    const currentPosition = (segmentCenterAtZero + currentRotationNormalized) % 360
    const angleToRotate = (360 - currentPosition) % 360
    const finalRotation = spins * 360 + angleToRotate
    const totalRotationAfter = rotation + finalRotation
    
    setRotation(prev => prev + finalRotation)
    
    setTimeout(async () => {
      setIsSpinning(false)
      
      const normalizedRotation = ((totalRotationAfter % 360) + 360) % 360
      const positionAtTop = (360 - normalizedRotation) % 360
      const adjustedPosition = (positionAtTop - 22.5 + 360) % 360
      const actualWinningIndex = Math.round(adjustedPosition / segmentAngle) % WHEEL_ITEMS.length
      const actualWinningItem = WHEEL_ITEMS[actualWinningIndex]
      
      console.log('Izabrano polje:', winningIndex, WHEEL_ITEMS[winningIndex])
      console.log('Stvarno polje na vrhu:', actualWinningIndex, actualWinningItem)
      console.log('Ukupna rotacija:', totalRotationAfter, 'normalizovano:', normalizedRotation)
      console.log('Pozicija na vrhu:', positionAtTop, 'prilagođeno:', adjustedPosition)
      
      setWinningItem(actualWinningItem)
      
      // Save spin to backend - this is the only API call
      try {
        await wheelService.spin(actualWinningItem)
        // Set cooldown locally after successful spin
        const spinTime = Date.now()
        lastSpinTimeRef.current = spinTime
        localStorage.setItem('wheel_last_spin_time', spinTime.toString())
        setCooldownSeconds(120) // 2 minutes
        setCanSpin(false)
      } catch (error: any) {
        console.error('Error saving spin:', error)
        // If error is cooldown, extract cooldown seconds and set timer
        if (error.cooldownSeconds) {
          const remainingMs = error.cooldownSeconds * 1000
          const spinTime = Date.now() - (2 * 60 * 1000 - remainingMs)
          lastSpinTimeRef.current = spinTime
          localStorage.setItem('wheel_last_spin_time', spinTime.toString())
          setCooldownSeconds(error.cooldownSeconds)
        } else if (error.response?.data?.cooldownSeconds) {
          const remainingMs = error.response.data.cooldownSeconds * 1000
          const spinTime = Date.now() - (2 * 60 * 1000 - remainingMs)
          lastSpinTimeRef.current = spinTime
          localStorage.setItem('wheel_last_spin_time', spinTime.toString())
          setCooldownSeconds(error.response.data.cooldownSeconds)
        } else {
          // Default to 2 minutes on error
          const spinTime = Date.now()
          lastSpinTimeRef.current = spinTime
          localStorage.setItem('wheel_last_spin_time', spinTime.toString())
          setCooldownSeconds(120)
        }
        setCanSpin(false)
      }
      
      setTimeout(() => {
        setIsModalOpen(true)
        // Create confetti explosion when modal opens
        const confettiCount = 50
        const newConfetti = Array.from({ length: confettiCount }, (_, i) => {
          // Random angle for explosion in all directions (0 to 360 degrees)
          const angle = (Math.PI * 2 * i) / confettiCount + Math.random() * 0.5
          // Distance for explosion (100-200px)
          const distance = 100 + Math.random() * 100
          return {
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            left: 50, // Start from center (50%)
            delay: Math.random() * 0.2, // Shorter delay for explosion effect
            duration: 3 + Math.random() * 2, // 3-5 seconds (slower)
            horizontal: Math.cos(angle) * distance, // X direction based on angle
            vertical: Math.sin(angle) * distance // Y direction based on angle
          }
        })
        setConfetti(newConfetti)
        
        // Clear confetti after animation
        setTimeout(() => {
          setConfetti([])
        }, 6000)
      }, 1000)
    }, 4000)
  }

  const colors = [
    '#F76C9B', // wheel-pink – lively pink – playful and energetic (for "New Me, Who Dis?")
    '#6EC1E4', // wheel-blue – bright pastel blue – cheerful, eye-catching
    '#63D9A0', // wheel-green – minty green – fresh, optimistic
    '#F8D44C', // wheel-yellow – warm yellow – bright and positive
    '#FFA85C', // wheel-orange – peachy orange – fun and inviting
    '#B488E4', // wheel-purple – light purple – elegant, royal tone
    '#5ED3C3', // wheel-teal – aqua teal – calm but vivid
    '#F7A7A3'  // wheel-coral – soft coral red – warm and expressive
  ]

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
                
                {WHEEL_ITEMS.map((item, index) => {
                  const segmentAngle = 360 / WHEEL_ITEMS.length
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
                {PRIZE_DESCRIPTIONS[winningItem] || winningItem}
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

