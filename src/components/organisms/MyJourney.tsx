import { Text } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import { useRef, useEffect, useState, useCallback } from 'react'

interface ScratchCardProps {
  image: string
  children: React.ReactNode
}

const ScratchCard = ({ image, children }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isRevealedRef = useRef(false)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Fill canvas with white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw inner border - card edge effect (10px inset)
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.5)'
    ctx.lineWidth = 2
    const radius = 8
    const x = 10
    const y = 10
    const width = canvas.width - 20
    const height = canvas.height - 20
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.stroke()
    
    // Draw image in center
    const img = new Image()
    img.src = image
    img.onload = () => {
      const imgSize = 220
      const x = (canvas.width - imgSize) / 2
      const y = (canvas.height - imgSize) / 2 - 30
      ctx.drawImage(img, x, y, imgSize, imgSize)
      
      // Draw "SCRATCH FOR MORE" text below the image in two lines
      ctx.fillStyle = 'rgb(236, 72, 153)'
      ctx.font = '600 32px "Barlow Semi Condensed", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const lineHeight = 40
      const textY = y + imgSize + 60
      ctx.fillText('SCRATCH FOR', canvas.width / 2, textY)
      ctx.fillText('MORE', canvas.width / 2, textY + lineHeight)
    }
  }, [image])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Initial draw
    drawCanvas()

    // ResizeObserver to track container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (!isRevealedRef.current) {
        drawCanvas()
      }
    })

    resizeObserver.observe(container)

    const scratch = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      
      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      // Update cursor position for visual indicator
      setCursorPos({ x, y })

      if (isRevealedRef.current) return

      // Use destination-out to "erase" (scratch off) the overlay
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, Math.PI * 2) // 60px diameter = 30px radius
      ctx.fill()

      // Check if enough is scratched (reveal all if > 50% scratched)
      if (!isRevealedRef.current) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        let transparentPixels = 0
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0) transparentPixels++
        }
        const scratchedPercent = (transparentPixels / (pixels.length / 4)) * 100
        
        if (scratchedPercent > 50) {
          isRevealedRef.current = true
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      scratch(e)
    }

    const handleMouseLeave = () => {
      setCursorPos(null)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      scratch(e)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('touchmove', handleTouchMove)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [image, drawCanvas])

  return (
    <div 
      ref={containerRef}
      className="relative w-[320px] h-[520px] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-300"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(244, 114, 182, 0.2)',
        transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateY(-2deg) rotateX(2deg) translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(244, 114, 182, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(244, 114, 182, 0.2)'
      }}
    >
      {/* Content - tekst ispod */}
      <div className="w-full h-full bg-black border-2 border-[rgba(244,114,182,0.5)] rounded-lg p-6 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.3)] select-none">
        {children}
      </div>
      
      {/* Scratch overlay - canvas sa slikom */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto rounded-lg"
        style={{ touchAction: 'none' }}
      />
      
      {/* Cursor indicator - roze krug koji prikazuje radius gumice */}
      {cursorPos && (
        <div
          className="absolute pointer-events-none border-2 border-pink-500 rounded-full"
          style={{
            left: `${cursorPos.x - 30}px`,
            top: `${cursorPos.y - 30}px`,
            width: '60px',
            height: '60px',
            borderColor: 'rgb(236, 72, 153)',
            zIndex: 10
          }}
        />
      )}
    </div>
  )
}

const MyJourney = () => {
  const { t } = useI18n()
  
  const careerPath = [
    {
      company: t('aboutMe.career.mania.company'),
      location: t('aboutMe.career.mania.location'),
      role: t('aboutMe.career.mania.role'),
      description: t('aboutMe.career.mania.description'),
      image: '/images/playing-card-1.png'
    },
    {
      company: t('aboutMe.career.bondex.company'),
      location: t('aboutMe.career.bondex.location'),
      role: t('aboutMe.career.bondex.role'),
      description: t('aboutMe.career.bondex.description'),
      image: '/images/playing-card-2.png'
    },
    {
      company: t('aboutMe.career.endava.company'),
      location: t('aboutMe.career.endava.location'),
      role: t('aboutMe.career.endava.role'),
      description: t('aboutMe.career.endava.description'),
      image: '/images/playing-card-3.png'
    }
  ]

  return (
    <div>
      <Text as="h1" size="4xl" weight="bold" className="mb-8 text-gray-900 dark:text-white" style={{ textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), 0 0 8px rgba(236, 72, 153, 0.5)' }}>
        {t('aboutMe.career.title')}
      </Text>
      <div className="py-32">
        <div className="flex flex-row gap-16 justify-center items-center">
          <ScratchCard image={careerPath[0].image}>
            <div className="mb-2 flex flex-col">
              <Text size="2xl" weight="semibold" className="!text-white uppercase mb-3">
                {careerPath[0].company}
              </Text>
              <Text size="lg" className="!text-white">
                {careerPath[0].location}
              </Text>
            </div>
            <Text size="xl" weight="semibold" className="!text-white mb-3">
              {careerPath[0].role}
            </Text>
            <Text size="lg" className="!text-white whitespace-pre-line">
              {careerPath[0].description}
            </Text>
          </ScratchCard>

          <ScratchCard image={careerPath[1].image}>
            <div className="mb-2 flex flex-col">
              <Text size="2xl" weight="semibold" className="!text-white uppercase mb-3">
                {careerPath[1].company}
              </Text>
              <Text size="lg" className="!text-white">
                {careerPath[1].location}
              </Text>
            </div>
            <Text size="xl" weight="semibold" className="!text-white mb-3">
              {careerPath[1].role}
            </Text>
            <Text size="lg" className="!text-white whitespace-pre-line">
              {careerPath[1].description}
            </Text>
          </ScratchCard>

          <ScratchCard image={careerPath[2].image}>
            <div className="mb-2 flex flex-col">
              <Text size="2xl" weight="semibold" className="!text-white uppercase mb-3">
                {careerPath[2].company}
              </Text>
              <Text size="lg" className="!text-white">
                {careerPath[2].location}
              </Text>
            </div>
            <Text size="xl" weight="semibold" className="!text-white mb-3">
              {careerPath[2].role}
            </Text>
            <Text size="lg" className="!text-white whitespace-pre-line">
              {careerPath[2].description}
            </Text>
          </ScratchCard>
        </div>
      </div>
    </div>
  )
}

export default MyJourney

