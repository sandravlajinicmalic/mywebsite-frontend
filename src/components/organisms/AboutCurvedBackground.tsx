interface AboutCurvedBackgroundProps {
  flipped?: boolean
  inverted?: boolean
}

const AboutCurvedBackground = ({ flipped = false, inverted = false }: AboutCurvedBackgroundProps) => {
  // Desktop verzije
  const desktopLeftPath = "M1000,0 C700,75 600,135 1000,170 C1780,259 2000,358 1000,401 C-100,426 -200,588 1000,643 C3400,738 3400,833 1000,930 C280,970 220,1055 1000,1080 L0,1080 L0,0 Z"
  const desktopRightPath = "M1000,0 C700,75 600,135 1000,170 C1780,259 2000,358 1000,401 C-100,426 -200,588 1000,643 C3400,738 3400,833 1000,930 C280,970 220,1055 1000,1080 L1920,1080 L1920,0 Z"
  
  // Tablet verzije - prva krivulja više u lijevo, podignuta gore, veća amplituda, početak pomeren u lijevo, donji deo pomeren gore; druga krivulja više u desno, povećana amplituda (kao D), pomereno dole, gornji deo spušten malo dole, pomereno još u desno; treća krivulja smanjena, pomereno dole, pomereno još u lijevo, ublažen prelaz sa plavom; četvrta krivulja ublažen prelaz sa zelenom; peta krivulja pomereno skroz u lijevo, još malo u lijevo
  const tabletLeftPath = "M300,0 C-300,80 -500,150 1000,170 C2600,240 2900,320 1400,450 C1000,470 -100,600 900,680 C1800,710 2800,800 1000,930 C-400,970 -500,1055 1000,1080 L0,1080 L0,0 Z"
  const tabletRightPath = "M300,0 C-300,80 -500,150 1000,170 C2600,240 2900,320 1400,450 C1000,470 -100,600 900,680 C1800,710 2800,800 1000,930 C-400,970 -500,1055 1000,1080 L1920,1080 L1920,0 Z"

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
        
        {/* Desktop verzije */}
        <g className="hidden lg:block">
          {/* Left part - pink when inverted, transparent otherwise */}
          <path
            d={desktopLeftPath}
            fill={inverted ? "url(#pinkGradient)" : "transparent"}
          />
          
          {/* Right part - black when inverted, pink otherwise */}
          <path
            d={desktopRightPath}
            fill={inverted ? "#000000" : "url(#pinkGradient)"}
          />
        </g>
        
        {/* Tablet verzije */}
        <g className="block lg:hidden">
          {/* Left part - pink when inverted, transparent otherwise */}
          <path
            d={tabletLeftPath}
            fill={inverted ? "url(#pinkGradient)" : "transparent"}
          />
          
          {/* Right part - black when inverted, pink otherwise */}
          <path
            d={tabletRightPath}
            fill={inverted ? "#000000" : "url(#pinkGradient)"}
          />
        </g>
      </svg>
    </div>
  )
}

export default AboutCurvedBackground

