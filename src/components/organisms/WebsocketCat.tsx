import { useState, useEffect, useRef } from 'react'
import { Button, Image } from '../atoms'
import getSocket from '../../services/socket'
import { authService } from '../../services/auth'

type CatState = 'ziva' | 'mrtva' | 'igra_se' | 'dosadno' | 'angry'

interface LogEntry {
  id: string
  action: string
  user_name: string
  timestamp: string
}

const WebsocketCat = () => {
  const [catState, setCatState] = useState<CatState>('ziva')
  const [isResting, setIsResting] = useState(false)
  const [restEndTime, setRestEndTime] = useState<Date | null>(null)
  const [restedBy, setRestedBy] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [animationKey, setAnimationKey] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)
  const catAnimationRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef(getSocket())
  const previousStateRef = useRef<CatState>(catState)
  const currentUser = authService.getCurrentUser()

  // Map cat state to image
  const getCatImage = (state: CatState): string => {
    const imageMap: Record<CatState, string> = {
      ziva: '/images/heavy-metal.svg',
      mrtva: '/images/meditation.svg',
      igra_se: '/images/education.svg',
      dosadno: '/images/tired.svg',
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
    if (!isResting || !restEndTime) {
      setTimeRemaining('')
      return
    }

    const interval = setInterval(() => {
      const now = new Date()
      const diff = restEndTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining('')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isResting, restEndTime])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  // Handle REST state - cat stays visible at center during REST
  useEffect(() => {
    if (catAnimationRef.current) {
      if (isResting) {
        // REST is active - show cat at center, no animation
        catAnimationRef.current.style.animation = 'none'
        catAnimationRef.current.style.transform = 'translateX(0%)'
        catAnimationRef.current.style.visibility = 'visible'
      } else {
        // REST ended - hide cat
        catAnimationRef.current.style.animation = 'none'
        catAnimationRef.current.style.visibility = 'hidden'
      }
    }
  }, [isResting])

  // Restart animation when animationKey changes (only if not resting)
  useEffect(() => {
    if (catAnimationRef.current && animationKey > 0 && !isResting) {
      // Reset animation and position - start completely hidden on the right
      catAnimationRef.current.style.animation = 'none'
      catAnimationRef.current.style.transform = 'translateX(calc(100% + 20rem))'
      catAnimationRef.current.style.visibility = 'hidden'
      // Force reflow
      void catAnimationRef.current.offsetHeight
      
      // Hide cat after animation ends
      const handleAnimationEnd = () => {
        if (catAnimationRef.current && !isResting) {
          catAnimationRef.current.style.visibility = 'hidden'
        }
      }
      
      // Restart animation
      requestAnimationFrame(() => {
        if (catAnimationRef.current && !isResting) {
          catAnimationRef.current.style.visibility = 'visible'
          catAnimationRef.current.style.animation = 'catWalk 10s ease-in-out forwards'
          catAnimationRef.current.addEventListener('animationend', handleAnimationEnd, { once: true })
        }
      })
      
      return () => {
        if (catAnimationRef.current) {
          catAnimationRef.current.removeEventListener('animationend', handleAnimationEnd)
        }
      }
    }
  }, [animationKey, isResting])

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
      const previousState = previousStateRef.current
      setCatState(data.state)
      // Restart animation when state actually changes
      // Note: Animation will be blocked by isResting check in useEffect
      if (previousState !== data.state) {
        previousStateRef.current = data.state
        setAnimationKey(prev => prev + 1)
      }
    })

    // Listen for REST activation
    socket.on('cat-resting', (data: { restUntil: string; userName: string }) => {
      console.log('Cat resting:', data)
      setIsResting(true)
      setRestEndTime(new Date(data.restUntil))
      setRestedBy(data.userName)
    })

    // Listen for REST denial
    socket.on('rest-denied', (data: { message: string }) => {
      alert(data.message)
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
      socket.off('initial-logs')
      socket.off('new-log')
    }
  }, [])

  const handleReset = () => {
    if (!currentUser) {
      alert('Morate biti ulogovani da biste aktivirali REST')
      return
    }

    if (isResting) {
      alert('REST je već aktivan!')
      return
    }

    const socket = socketRef.current
    socket.emit('activate-rest', {
      userId: currentUser.id,
      userName: currentUser.nickname
    })
  }

  const getRestButtonText = (): string => {
    if (!isResting) {
      return 'REST (5 min)'
    }

    if (currentUser?.nickname === restedBy) {
      return `REST - Ti si aktivirao${timeRemaining ? ` (${timeRemaining})` : ''}`
    }

    return `REST - Aktivirao ${restedBy}${timeRemaining ? ` (${timeRemaining})` : ''}`
  }

  return (
    <section className="w-full bg-transparent py-6 px-8 md:px-12 lg:px-16 relative z-10">
      <div className="max-w-6xl mx-auto relative">
        {/* Mačka - pozicionirana apsolutno da može da se pomera preko terminala */}
        <div className="cat-animation-wrapper">
          <div 
            ref={catAnimationRef}
            className="w-full max-w-xs cat-animation-container"
          >
            <Image
              src={getCatImage(catState)}
              alt="Websocket Cat"
              className="w-full h-auto rounded-lg"
              rounded
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lijevi dio - Slika mačke i Reset dugme */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-xs" style={{ visibility: 'hidden' }}>
              {/* Placeholder za layout */}
            </div>
            <Button 
              onClick={handleReset} 
              variant="primary" 
              size="lg" 
              className="w-full max-w-xs"
              disabled={isResting}
            >
              {getRestButtonText()}
            </Button>
          </div>

          {/* Desni dio - Terminal */}
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
                      <span className="terminal-text">Čekam poruke...</span>
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
        .cat-animation-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .cat-animation-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 20rem;
          max-width: 20rem;
          z-index: 1;
          will-change: transform;
          visibility: hidden;
        }

        @keyframes catWalk {
          0% {
            transform: translateX(calc(100% + 20rem));
          }
          10% {
            transform: translateX(0%);
          }
          90% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(calc(-100% - 20rem));
          }
        }

        @media (max-width: 768px) {
          .cat-animation-container {
            width: 100%;
            max-width: 20rem;
          }
          
          @keyframes catWalk {
            0% {
              transform: translateX(calc(100vw + 10rem));
            }
            10% {
              transform: translateX(0%);
            }
            90% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(calc(-100% - 10rem));
            }
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
