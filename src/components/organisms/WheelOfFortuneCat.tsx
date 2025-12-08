import { Text, Image } from '../atoms'
import { Button } from '../atoms'
import Modal from '../molecules/Modal'
import { useWheelOfFortune } from '../../hooks'
import { useI18n } from '../../contexts/i18n'
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
  getTranslatedPrizeName,
} from '../../config/wheel'

const WheelOfFortuneCat = () => {
  const { t } = useI18n()
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
    <section className="w-full bg-transparent py-6 lg:py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto pt-6 lg:pt-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-12 mb-8">
          <div className="relative flex flex-col items-center order-2 lg:order-1">
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-10 wheel-pointer"
            >
              <Image
                src="/images/finnish.svg"
                alt={t('wheel.alt.pointer')}
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-lg"
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
                className="wheel-svg drop-shadow-2xl w-full max-w-[320px] md:max-w-[400px] lg:drop-shadow-2xl lg:w-auto lg:max-w-none lg:h-auto"
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
                  const translatedItem = getTranslatedPrizeName(item, t)
                  const lines = formatTextForSegment(translatedItem, textAngle, baseRadius, segmentAngle)
                  
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
            <div className="flex justify-center mt-8 lg:mt-8 wheel-button-container">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || !canSpin}
                variant="primary"
                size="lg"
                className="min-w-[200px]"
              >
                {isSpinning 
                  ? t('wheel.spinning')
                  : !canSpin 
                    ? t('wheel.wait').replace('{seconds}', cooldownSeconds.toString())
                    : t('wheel.spin')}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center self-center order-1 lg:order-2 lg:-mt-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black mb-2 lg:mb-4 px-4 lg:px-0" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(0, 0, 0, 0.2)', lineHeight: '1.3' }}>
            {t('wheel.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-black max-w-md drop-shadow-sm pt-2 lg:pt-4 leading-relaxed px-4 lg:px-0">
              {t('wheel.description')}
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          // No refresh needed - ActiveRewards component will automatically refetch
          // rewards when 'reward-activated' event is dispatched (handled in useWheelOfFortune)
        }}
        title={
          <Text as="h3" size="2xl" weight="bold" className="text-white">
            {t('wheel.modal.title')}
          </Text>
        }
        footer={
          <Text size="sm" weight="normal" className="text-white text-center italic">
            {t('wheel.modal.footer')}
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
                  "{winningItem ? getTranslatedPrizeName(winningItem, t) : ''}"
                </Text>
              </div>
              <Text 
                size="lg" 
                weight="normal" 
                className="text-center text-white mb-6 max-w-md leading-relaxed"
              >
                {getPrizeDescription(winningItem, t)}
              </Text>
            </>
          )}
        </div>
      </Modal>
      <style>{`
        .wheel-pointer {
          top: -50px;
        }
        
        /* Mobile ekrani (< 768px) */
        @media (max-width: 767px) {
          .wheel-pointer {
            top: -50px !important;
          }
          .wheel-svg {
            max-width: 300px !important;
            width: 100% !important;
            height: auto !important;
          }
          .wheel-button-container {
            margin-top: 0.75rem !important;
          }
        }
        
        /* Tablet ekrani (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .wheel-pointer {
            top: -10px !important;
          }
          .wheel-svg {
            max-width: 400px !important;
          }
          .wheel-button-container {
            margin-top: 0rem !important;
          }
        }
        
        /* Desktop ekrani (≥ 1024px) */
        @media (min-width: 1024px) {
          .wheel-pointer {
            top: -80px !important;
          }
          .wheel-svg {
            width: ${wheelSize}px !important;
            height: ${wheelSize}px !important;
            max-width: none !important;
          }
        }
        
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

