import { useState, useEffect, useRef } from 'react'
import { Button, Image } from '../atoms'
import getSocket from '../../services/socket'
import { authService } from '../../services/auth'

type CatState = 'playing' | 'zen' | 'sleeping' | 'happy' | 'tired' | 'angry'

interface LogEntry {
  id: string
  action: string
  user_name: string
  timestamp: string
}

const WebsocketCat = () => {
  const [catState, setCatState] = useState<CatState>('playing')
  const [isSleeping, setIsSleeping] = useState(false)
  const [sleepEndTime, setSleepEndTime] = useState<Date | null>(null)
  const [sleptBy, setSleptBy] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showOldImage, setShowOldImage] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [displayedState, setDisplayedState] = useState<CatState>('playing')
  const terminalRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef(getSocket())
  const currentUser = authService.getCurrentUser()

  // Map cat state to image
  const getCatImage = (state: CatState): string => {
    const imageMap: Record<CatState, string> = {
        playing: '/images/heavy-metal.svg',
        zen: '/images/meditation.svg',
        sleeping: '/images/sleeping.svg',
        happy: '/images/education.svg',
        tired: '/images/tired.svg',
        angry: '/images/angry.svg'
    }
    return imageMap[state] || '/images/heavy-metal.svg'
  }

  // Format time for terminal
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  // Countdown timer
  useEffect(() => {
    if (!isSleeping || !sleepEndTime) {
      setTimeRemaining('')
      return
    }

    const interval = setInterval(() => {
      const now = new Date()
      const diff = sleepEndTime.getTime() - now.getTime()

      if (diff <= 0) {
        // Sleep period ended - reset state
        setIsSleeping(false)
        setSleepEndTime(null)
        setSleptBy(null)
        setTimeRemaining('')
        // Explicitly set cat state to playing when sleep ends (fallback if backend event doesn't arrive)
        setCatState('playing')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSleeping, sleepEndTime])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  // Trigger animation when cat state changes
  useEffect(() => {
    // Skip animation on initial mount
    if (animationKey === 0) {
      setDisplayedState(catState)
      setAnimationKey(1)
      return
    }

    // Only animate if state actually changed
    if (catState === displayedState) {
      return
    }

    // Start animation
    setIsAnimating(true)
    setShowOldImage(true)
    
    // Hide old image after 700ms (gives time for smooth exit)
    const hideOldTimer = setTimeout(() => {
      setShowOldImage(false)
    }, 700)
    
    // Animation duration: 1.5s
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setDisplayedState(catState)
      setAnimationKey(prev => prev + 1)
    }, 1500)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideOldTimer)
    }
  }, [catState, displayedState, animationKey])

  // Socket.io setup
  useEffect(() => {
    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      // Request current state and logs after connection
      socket.emit('get-current-state')
      socket.emit('get-logs', { limit: 50 })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Listen for cat state changes
    socket.on('cat-state-changed', (data: { state: CatState }) => {
      console.log('Cat state changed:', data.state)
      setCatState(data.state)
    })

    // Listen for Sleep activation
    socket.on('cat-resting', (data: { restUntil: string; userName: string }) => {
      console.log('Cat sleeping:', data)
      setIsSleeping(true)
      setSleepEndTime(new Date(data.restUntil))
      setSleptBy(data.userName)
    })

    // Listen for Sleep denial
    socket.on('rest-denied', (data: { message: string }) => {
      alert(data.message)
    })

    // Listen for Sleep period ending
    socket.on('cat-rest-ended', () => {
      console.log('Cat sleep period ended')
      setIsSleeping(false)
      setSleepEndTime(null)
      setSleptBy(null)
      setTimeRemaining('')
      // Explicitly set cat state to playing when sleep ends
      setCatState('playing')
    })

    // Listen for initial logs
    socket.on('initial-logs', (data: LogEntry[]) => {
      console.log('Received initial logs:', data.length)
      setLogs(data.reverse()) // Reverse to show oldest first
    })

    // Listen for new logs
    socket.on('new-log', (log: LogEntry) => {
      console.log('New log received:', log)
      setLogs(prev => [...prev, log])
    })

    // If already connected, request immediately
    if (socket.connected) {
      socket.emit('get-current-state')
      socket.emit('get-logs', { limit: 50 })
    }

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('cat-state-changed')
      socket.off('cat-resting')
      socket.off('rest-denied')
      socket.off('cat-rest-ended')
      socket.off('initial-logs')
      socket.off('new-log')
    }
  }, [])

  const handleReset = () => {
    if (!currentUser) {
      alert('You must be logged in to activate Sleep')
      return
    }

    if (isSleeping) {
      alert('Sleep is already active!')
      return
    }

    const socket = socketRef.current
    socket.emit('activate-rest', {
      userId: currentUser.id,
      userName: currentUser.nickname
    })
  }

  const getSleepButtonText = (): string => {
    if (!isSleeping) {
      return 'Put cat to sleep (1 min)'
    }

    if (currentUser?.nickname === sleptBy) {
      return `Sleeping ${timeRemaining ? ` (${timeRemaining})` : ''}`
    }

    return `Sleep - Activated by ${sleptBy}${timeRemaining ? ` (${timeRemaining})` : ''}`
  }

  return (
    <section className="w-full bg-transparent py-6 px-8 md:px-12 lg:px-16 relative z-10">
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Cat image and Sleep button */}
          <div className="flex flex-col items-center relative" style={{ minHeight: '400px', justifyContent: 'space-between' }}>
            {/* Container for animation - fixed height */}
            <div className="w-full max-w-xs relative cat-container">
              {/* Old image - exiting */}
              {showOldImage && (
                <Image
                  key={`old-${animationKey}`}
                  src={getCatImage(displayedState)}
                  alt="Websocket Cat"
                  className="w-full h-auto rounded-lg cat-image cat-exiting"
                  rounded
                />
              )}
              {/* New image - entering */}
              <Image
                key={`new-${animationKey}`}
                src={getCatImage(isAnimating ? catState : displayedState)}
                alt="Websocket Cat"
                className={`w-full h-auto rounded-lg cat-image ${isAnimating ? 'cat-entering animating' : 'cat-entering'}`}
                rounded
              />
            </div>
            {/* Button at bottom, aligned with terminal */}
            <Button 
              onClick={handleReset} 
              variant="primary" 
              size="lg" 
              className="w-full max-w-xs"
              disabled={isSleeping}
            >
              {getSleepButtonText()}
            </Button>
          </div>

          {/* Right side - Terminal */}
          <div className="w-full">
            <div className="terminal-container">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="terminal-button terminal-button-close"></span>
                  <span className="terminal-button terminal-button-minimize"></span>
                  <span className="terminal-button terminal-button-maximize"></span>
                </div>
                <div className="terminal-title">websocket-terminal</div>
              </div>
              <div className="terminal-body" ref={terminalRef}>
                <div className="terminal-content">
                  {logs.length === 0 ? (
                    <div className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span className="terminal-text">Waiting for messages...</span>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="terminal-line">
                        <span className="terminal-prompt">[{formatTime(log.timestamp)}]</span>
                        <span className="terminal-text">{log.action}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        section {
          overflow-x: hidden;
        }

        .cat-container {
          height: 300px;
          position: relative;
        }

        .cat-image {
          width: 100%;
          height: auto;
        }

        .cat-exiting {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          max-width: 20rem;
          will-change: transform;
          animation: catExit 0.7s ease-in forwards;
        }

        .cat-entering {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          max-width: 20rem;
        }

        .cat-entering.animating {
          will-change: transform;
          animation: catEnter 1.5s ease-out forwards;
        }

        @keyframes catExit {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-100vw - 2rem), 0, 0);
          }
        }

        @keyframes catEnter {
          0% {
            transform: translate3d(calc(100% + 30vw), 0, 0);
          }
          60% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .terminal-container {
          background: #1e1e1e;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          height: 400px;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }

        .terminal-header {
          background: #2d2d2d;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #3d3d3d;
        }

        .terminal-buttons {
          display: flex;
          gap: 6px;
        }

        .terminal-button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .terminal-button-close {
          background: #ff5f56;
        }

        .terminal-button-minimize {
          background: #ffbd2e;
        }

        .terminal-button-maximize {
          background: #27c93f;
        }

        .terminal-title {
          color: #b3b3b3;
          font-size: 13px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        }

        .terminal-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #1e1e1e;
        }

        .terminal-content {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .terminal-line {
          margin-bottom: 4px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .terminal-prompt {
          color: #4ec9b0;
          font-weight: 600;
        }

        .terminal-text {
          color: #d4d4d4;
        }

        .terminal-body::-webkit-scrollbar {
          width: 8px;
        }

        .terminal-body::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .terminal-body::-webkit-scrollbar-thumb {
          background: #3d3d3d;
          border-radius: 4px;
        }

        .terminal-body::-webkit-scrollbar-thumb:hover {
          background: #4d4d4d;
        }
      `}</style>
    </section>
  )
}

export default WebsocketCat
