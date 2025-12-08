interface CurvedBackgroundProps {
  flipped?: boolean
  inverted?: boolean
}

const CurvedBackground = ({ flipped = false, inverted = false }: CurvedBackgroundProps) => {
  const desktopLeftPath = "M1000,0 C-50,170 -150,350 1000,395 C2300,415 2500,410 1000,555 C450,650 380,790 1000,850 C1650,890 1750,990 1000,1070 C250,1080 200,1080 1000,1080 L0,1080 L0,0 Z"
  const desktopRightPath = "M1000,0 C-50,170 -150,350 1000,395 C2300,415 2500,410 1000,555 C450,650 380,790 1000,850 C1650,890 1750,990 1000,1070 C250,1080 200,1080 1000,1080 L1920,1080 L1920,0 Z"
  const tabletLeftPath = "M1000,0 C-200,220 -300,420 1000,450 C1800,460 2000,480 1000,555 C-1200,650 -1700,790 1000,850 C2000,890 2100,990 1000,1070 C250,1080 200,1080 1000,1080 L0,1080 L0,0 Z"
  const tabletRightPath = "M1000,0 C-200,220 -300,420 1000,450 C1800,460 2000,480 1000,555 C-1200,650 -1700,790 1000,850 C2000,890 2100,990 1000,1070 C250,1080 200,1080 1000,1080 L1920,1080 L1920,0 Z"

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
            <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="1" />
            <stop offset="50%" stopColor="rgb(244, 114, 182)" stopOpacity="1" />
            <stop offset="85%" stopColor="rgb(249, 168, 212)" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        
        <g className="hidden lg:block">
          <path
            d={desktopLeftPath}
            fill={inverted ? "url(#pinkGradient)" : "transparent"}
          />
          <path
            d={desktopRightPath}
            fill={inverted ? "#000000" : "url(#pinkGradient)"}
          />
        </g>
        
        <g className="block lg:hidden">
          <path
            d={tabletLeftPath}
            fill={inverted ? "url(#pinkGradient)" : "transparent"}
          />
          <path
            d={tabletRightPath}
            fill={inverted ? "#000000" : "url(#pinkGradient)"}
          />
        </g>
      </svg>
    </div>
  )
}

export default CurvedBackground

