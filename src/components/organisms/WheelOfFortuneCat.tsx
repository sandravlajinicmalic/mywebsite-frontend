import { useState, useRef } from 'react'
import { Text, Image } from '../atoms'
import { Button } from '../atoms'
import { Trophy } from 'lucide-react'
import Modal from '../molecules/Modal'

const WHEEL_ITEMS = [
  '1 NewIcon',
  '2 fancy nickname',
  '3 klupko',
  '4 cursor',
  '5 titula',
  '6 tema',
  '7 zavrti ponovo',
  '8 totalno promasaj'
]

const WheelOfFortuneCat = () => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [winningItem, setWinningItem] = useState<string | null>(null)
  const [trophyAnimated, setTrophyAnimated] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    
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
    
    setTimeout(() => {
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

  const wheelSize = 400
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
  const radius = wheelSize / 2 - 10

  return (
    <section className="w-full bg-transparent py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto pt-12">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-8">
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
                viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                className="drop-shadow-2xl"
              >
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {WHEEL_ITEMS.map((item, index) => {
                  const segmentAngle = 360 / WHEEL_ITEMS.length
                  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
                  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
                  
                  const x1 = centerX + radius * Math.cos(startAngle)
                  const y1 = centerY + radius * Math.sin(startAngle)
                  const x2 = centerX + radius * Math.cos(endAngle)
                  const y2 = centerY + radius * Math.sin(endAngle)
                  
                  const largeArcFlag = segmentAngle > 180 ? 1 : 0
                  
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ')
                  
                  const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180)
                  const textRadius = radius * 0.65
                  const textX = centerX + textRadius * Math.cos(textAngle)
                  const textY = centerY + textRadius * Math.sin(textAngle)
                  const textRotation = index * segmentAngle + segmentAngle / 2
                  
                  return (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={colors[index]}
                        stroke="#fff"
                        strokeWidth="2"
                        filter="url(#shadow)"
                      />
                      <g transform={`translate(${textX}, ${textY}) rotate(${textRotation})`}>
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-bold pointer-events-none select-none"
                          style={{
                            fontSize: '13px',
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
          </div>

          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            variant="primary"
            size="lg"
            className="min-w-[200px]"
          >
            {isSpinning ? 'Vrti se...' : 'Zavrti'}
          </Button>
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

