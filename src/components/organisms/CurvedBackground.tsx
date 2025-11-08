interface CurvedBackgroundProps {
  flipped?: boolean
}

const CurvedBackground = ({ flipped = false }: CurvedBackgroundProps) => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none w-full min-h-screen">
      <svg
        className="absolute inset-0 w-full h-full min-h-screen"
        style={flipped ? { transform: 'scaleY(-1)' } : undefined}
        preserveAspectRatio="none"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="85%" stopColor="#f9a8d4" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        
        {/* Transparent left part */}
        <path
          d="M1000,0 C300,200 300,400 1000,540 C1400,650 1400,850 1000,1080 L0,1080 L0,0 Z"
          fill="transparent"
        />
        
        {/* Single vertical pink gradient curve - nejednaka S-krivulja */}
        <path
          d="M1000,0 C300,200 300,400 1000,540 C1400,650 1400,850 1000,1080 L1920,1080 L1920,0 Z"
          fill="url(#pinkGradient)"
        />
      </svg>
    </div>
  )
}

export default CurvedBackground

