import { Button, Image } from '../atoms'
import { useI18n } from '../../contexts/i18n'
import { useWebsocketCat } from '../../hooks'

const WebsocketCat = () => {
  const { t } = useI18n()
  const {
    catState,
    isSleeping,
    logs,
    isAnimating,
    showOldImage,
    animationKey,
    displayedState,
    terminalRef,
    getCatImage,
    formatTime,
    handleReset,
    getSleepButtonText,
  } = useWebsocketCat()

  return (
    <section className="w-full bg-transparent pt-16 pb-6 px-8 md:px-12 lg:px-16 relative z-10">
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
                  alt={t('cat.websocketAlt')}
                  className="w-full h-auto rounded-lg cat-image cat-exiting"
                  rounded
                />
              )}
              {/* New image - entering */}
              <Image
                key={`new-${animationKey}`}
                src={getCatImage(isAnimating ? catState : displayedState)}
                alt={t('cat.websocketAlt')}
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
