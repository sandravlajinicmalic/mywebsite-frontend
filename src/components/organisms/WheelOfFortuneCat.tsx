import { Text, Image } from '../atoms'
import { Button } from '../atoms'
import Modal from '../molecules/Modal'
import { useWheelOfFortune } from '../../hooks'
import {
  WHEEL_CONFIG,
  WHEEL_RENDERING_CONFIG,
  getWheelDimensions,
  getSegmentAngle,
  getSegmentAngles,
  degToRad,
  generateArcPoints,
  getBeyondBoundaryPoint,
  generateSegmentPath,
  getTextPosition,
  formatTextForSegment,
  getPrizeDescription,
} from '../../config/wheel'

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
  const dimensions = getWheelDimensions(WHEEL_RENDERING_CONFIG.SIZE)
  const { size: wheelSize, centerX, centerY, baseRadius } = dimensions

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
                viewBox={`-${WHEEL_RENDERING_CONFIG.VIEWBOX_PADDING} -${WHEEL_RENDERING_CONFIG.VIEWBOX_PADDING} ${wheelSize + WHEEL_RENDERING_CONFIG.VIEWBOX_PADDING * 2} ${wheelSize + WHEEL_RENDERING_CONFIG.VIEWBOX_PADDING * 2}`}
                className="drop-shadow-2xl"
              >
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {WHEEL_CONFIG.ITEMS.map((item, index) => {
                  const { startAngle, endAngle } = getSegmentAngles(index)
                  const points = generateArcPoints(startAngle, endAngle, centerX, centerY, baseRadius)
                  const beyondEndPoint = getBeyondBoundaryPoint(endAngle, centerX, centerY, baseRadius)
                  const pathData = generateSegmentPath(points, beyondEndPoint, centerX, centerY)
                  
                  const segmentAngle = getSegmentAngle()
                  const textAngle = degToRad(index * segmentAngle + segmentAngle / 2 - 90)
                  const { x: textX, y: textY, rotation: textRotation } = getTextPosition(index, centerX, centerY, baseRadius)
                  const lines = formatTextForSegment(item, textAngle, baseRadius, segmentAngle)
                  
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
                  r={WHEEL_RENDERING_CONFIG.CENTER_RADIUS}
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
                {getPrizeDescription(winningItem)}
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

