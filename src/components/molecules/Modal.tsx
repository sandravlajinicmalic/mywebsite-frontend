import { ReactNode, useEffect, useState, useRef } from 'react'
import { Text } from '../atoms'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string | ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  disableBodyScroll?: boolean
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  showCloseButton = true,
  disableBodyScroll = false
}: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const scrollYRef = useRef<number>(0)

  // Close modal on ESC key and prevent scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const preventScroll = (e: Event) => {
      e.preventDefault()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      
      // Save scroll position
      scrollYRef.current = window.scrollY
      
      // Block scroll on html and body
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.position = 'fixed'
      document.documentElement.style.width = '100%'
      document.documentElement.style.top = `-${scrollYRef.current}px`
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      
      // Prevent scroll event directly
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
      
      // Start animation after short delay
      setTimeout(() => setIsAnimating(true), 10)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('wheel', preventScroll)
        document.removeEventListener('touchmove', preventScroll)
        
        // Restore scroll position
        document.documentElement.style.overflow = ''
        document.documentElement.style.position = ''
        document.documentElement.style.width = ''
        document.documentElement.style.top = ''
        
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        
        window.scrollTo(0, scrollYRef.current)
      }
    } else {
      setIsAnimating(false)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0'
        }`}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-black rounded-lg w-full ${sizes[size]} max-h-[90vh] flex flex-col transition-all duration-300 shadow-[0_0_15px_rgba(244,114,182,0.3),0_0_30px_rgba(244,114,182,0.2)] ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-[rgba(244,114,182,0.5)]">
            {title && (
              typeof title === 'string' ? (
                <Text as="h3" size="2xl" weight="bold" className="text-white">
                  {title}
                </Text>
              ) : (
                <div className="text-white">
                  {title}
                </div>
              )
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-white hover:text-brand-pink-light transition-colors"
                aria-label="Zatvori modal"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`${disableBodyScroll ? '' : 'p-6'} flex-1 ${disableBodyScroll ? '' : 'overflow-y-auto'}`} style={{ scrollbarGutter: 'stable' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-center p-6 border-t border-[rgba(244,114,182,0.5)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal

