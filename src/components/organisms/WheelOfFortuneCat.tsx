import { useState, useRef, useEffect } from 'react'
import { Text, Image } from '../atoms'
import { Button } from '../atoms'
import { Trophy } from 'lucide-react'
import Modal from '../molecules/Modal'
import { wheelService } from '../../services'
import { authService } from '../../services'
import { useI18n } from '../../contexts/i18n'

const WHEEL_ITEMS = [
  'NewIcon',
  'fancy nickname',
  'klupko',
  'cursor',
  'titula',
  'tema',
  'zavrti ponovo',
  'totalni promasaj'
]

const WheelOfFortuneCat = () => {
  const { t } = useI18n()
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [winningItem, setWinningItem] = useState<string | null>(null)
  const [trophyAnimated, setTrophyAnimated] = useState(false)
  const [canSpin, setCanSpin] = useState(true)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
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
      
      setTrophyAnimated(false)
      setTimeout(() => {
        setIsModalOpen(true)
        setTimeout(() => setTrophyAnimated(true), 100)
      }, 1000)
    }, 4000)
  }

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ]

  const wheelSize = 500
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
  const baseRadius = wheelSize / 2 - 10
  
  // Funkcija koja generiše nepravilan radijus poput krompira
  // Koristimo više sinusnih funkcija za 5 krivulja i više nejednakosti
  const getPotatoRadius = (angle: number): number => {
    // 5 krivulja na cijeli krug = frekvencija 5
    const variation1 = Math.sin(angle * 5) * 12
    // Dodatne varijacije za više nejednakosti sa smanjenom amplitudom
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
                  
                  // Generišemo tačke duž luka za glatki nepravilan oblik
                  // Više tačaka za glatkije povezivanje i 5 krivulja
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
                  
                  // Dodatna tačka malo izvan granice za bolji kontinuitet
                  const smallStep = (endAngle - startAngle) * 0.1
                  const beyondEndAngle = endAngle + smallStep
                  const beyondEndR = getPotatoRadius(beyondEndAngle)
                  const beyondEndPoint = {
                    x: centerX + beyondEndR * Math.cos(beyondEndAngle),
                    y: centerY + beyondEndR * Math.sin(beyondEndAngle)
                  }
                  
                  // Kreiranje path-a sa glatkim kubičnim bezier krivuljama da izbjegnemo "odječene" talase
                  // Koristimo glatke krivulje i na granicama za kontinuitet između segmenata
                  let pathData = `M ${centerX} ${centerY} L ${points[0].x} ${points[0].y} `
                  
                  for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1]
                    const curr = points[i]
                    const isLastPoint = i === points.length - 1
                    
                    if (isLastPoint) {
                      // Poslednja tačka segmenta - koristimo dodatnu tačku izvan granice za glatko povezivanje
                      const cp1X = prev.x + (curr.x - prev.x) * 0.4
                      const cp1Y = prev.y + (curr.y - prev.y) * 0.4
                      // Kontrolna tačka koja vodi prema tački izvan granice za glatkiji prelaz
                      const cp2X = curr.x + (beyondEndPoint.x - curr.x) * 0.3
                      const cp2Y = curr.y + (beyondEndPoint.y - curr.y) * 0.3
                      pathData += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${curr.x} ${curr.y} `
                    } else {
                      // Srednje tačke - koristimo kubične bezier krivulje za glatkost
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
                  const textRadius = getPotatoRadius(textAngle) * 0.65
                  const textX = centerX + textRadius * Math.cos(textAngle)
                  const textY = centerY + textRadius * Math.sin(textAngle)
                  const textRotation = index * segmentAngle + segmentAngle / 2 + 90
                  
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
                          dominantBaseline="middle"
                          className="fill-white font-bold pointer-events-none select-none"
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.split(' ').map((word, i) => (
                            <tspan
                              key={i}
                              x="0"
                              dy={i === 0 ? '-0.3em' : '1em'}
                              textAnchor="middle"
                            >
                              {word}
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

          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Spin the Cat Wheel of Fortune and discover your destiny!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md">
              Spin the wheel, meow for luck, and see what fate (or your cat) has in store!
              Remember: nine lives, but only one spin! Prizes may vary depending on the cat’s mood. (Good luck with that.)
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-6">
            <Trophy 
              className={`w-20 h-20 text-yellow-500 dark:text-yellow-400 transition-all duration-500 hover:scale-110 ${
                trophyAnimated 
                  ? 'scale-100 rotate-0 opacity-100' 
                  : 'scale-0 rotate-180 opacity-0'
              }`}
              strokeWidth={2}
            />
          </div>
          <Text 
            as="h3" 
            size="2xl" 
            weight="bold" 
            className="mb-4 text-center text-gray-900 dark:text-white"
          >
            Rezultat
          </Text>
          <Text 
            size="xl" 
            weight="semibold" 
            className="text-center text-indigo-600 dark:text-indigo-400 mb-6"
          >
            {winningItem}
          </Text>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="primary"
            size="md"
          >
            Zatvori
          </Button>
        </div>
      </Modal>
    </section>
  )
}

export default WheelOfFortuneCat

