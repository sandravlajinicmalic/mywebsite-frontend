import { useState, useRef, useEffect } from 'react'
import { Image } from '../atoms'

const YarnBall = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 })
  const [rotation, setRotation] = useState(0)
  const yarnRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastPositionRef = useRef({ x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      if (!yarnRef.current || !mousePositionRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const rect = yarnRef.current.getBoundingClientRect()
      const yarnCenterX = rect.left + rect.width / 2
      const yarnCenterY = rect.top + rect.height / 2
      
      // Calculate distance from cursor to yarn center
      const dx = mousePositionRef.current.x - yarnCenterX
      const dy = mousePositionRef.current.y - yarnCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Activation distance - yarn starts running when cursor is within 150px
      const activationDistance = 150
      
      if (distance < activationDistance && distance > 0) {
        // Calculate escape direction (opposite to cursor)
        const escapeDistance = activationDistance - distance
        const escapeSpeed = (escapeDistance / activationDistance) * 10 // Max 10px per frame
        
        // Normalize direction vector
        const angle = Math.atan2(dy, dx)
        const escapeX = -Math.cos(angle) * escapeSpeed
        const escapeY = -Math.sin(angle) * escapeSpeed
        
        setPosition(prev => {
          const newX = prev.x + escapeX
          const newY = prev.y + escapeY
          
          // Keep yarn within viewport bounds
          const maxX = window.innerWidth - 100 // yarn width
          const maxY = window.innerHeight - 100 // yarn height
          
          const finalX = Math.max(0, Math.min(newX, maxX))
          const finalY = Math.max(0, Math.min(newY, maxY))
          
          // Calculate rotation based on movement direction and speed
          const moveX = finalX - lastPositionRef.current.x
          const moveY = finalY - lastPositionRef.current.y
          const moveDistance = Math.sqrt(moveX * moveX + moveY * moveY)
          
          if (moveDistance > 0) {
            // Rotate yarn ball based on movement speed
            // Multiply by speed to make it rotate faster when moving faster
            const rotationSpeed = moveDistance * 2 // Adjust multiplier for rotation speed
            setRotation(prevRotation => {
              // Rotate in the direction of movement
              const newRotation = prevRotation + rotationSpeed
              return newRotation % 360
            })
          }
          
          lastPositionRef.current = { x: finalX, y: finalY }
          
          return {
            x: finalX,
            y: finalY
          }
        })
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={yarnRef}
      className="fixed z-50 select-none pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Image
        src="/images/yarn5.svg"
        alt="Yarn ball"
        className="w-24 h-24 drop-shadow-2xl transition-all"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.1s linear'
        }}
      />
    </div>
  )
}

export default YarnBall

