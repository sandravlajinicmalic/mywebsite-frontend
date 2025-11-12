interface AboutCurvedBackgroundProps {
  flipped?: boolean
  inverted?: boolean
}

const AboutCurvedBackground = ({ flipped = false, inverted = false }: AboutCurvedBackgroundProps) => {
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
        
        {/* Left part - pink when inverted, transparent otherwise */}
        {/* 
          ANALIZA KRIVULJE - PODEŠENO:
          [1] Prva krivulja: y 0→170, ide levo (170px) - BLAGO POMERENO GORE
             Kontrolne: (700,75) (600,135) → Završava: (1000,170)
          [2] Druga krivulja: y 170→401, ide desno (231px) - BLAGO SMANJENA NA RAČUN 3, BLAGO POMERENO GORE
             Kontrolne: (1780,259) (2000,358) → Završava: (1000,401)
          [3] Treća krivulja: y 401→643, ide levo (242px) - BLAGO SMANJENA NA RAČUN 4, SMANJENA ODOZGORE
             Kontrolne: (-100,426) (-200,588) → Završava: (1000,643)
          [4] Četvrta krivulja: y 643→930, ide desno (287px) - BLAGO POVEĆANA NA RAČUN 3
             Kontrolne: (3400,738) (3400,833) → Završava: (1000,930)
          [5] Peta krivulja: y 930→1080, ide levo (150px) - BLAGO POMERENO GORE
             Kontrolne: (280,970) (220,1055) → Završava: (1000,1080)
          [6] Završna linija: od (1000,1080) do (0,1080)
        */}
        <path
          d="M1000,0 C700,75 600,135 1000,170 C1780,259 2000,358 1000,401 C-100,426 -200,588 1000,643 C3400,738 3400,833 1000,930 C280,970 220,1055 1000,1080 L0,1080 L0,0 Z"
          fill={inverted ? "url(#pinkGradient)" : "transparent"}
        />
        
        {/* Right part - black when inverted, pink otherwise */}
        {/* 
          ANALIZA KRIVULJE - PODEŠENO:
          [1] Prva krivulja: y 0→170, ide levo (170px) - BLAGO POMERENO GORE
             Kontrolne: (700,75) (600,135) → Završava: (1000,170)
          [2] Druga krivulja: y 170→401, ide desno (231px) - BLAGO SMANJENA NA RAČUN 3, BLAGO POMERENO GORE
             Kontrolne: (1780,259) (2000,358) → Završava: (1000,401)
          [3] Treća krivulja: y 401→643, ide levo (242px) - BLAGO SMANJENA NA RAČUN 4, SMANJENA ODOZGORE
             Kontrolne: (-100,426) (-200,588) → Završava: (1000,643)
          [4] Četvrta krivulja: y 643→930, ide desno (287px) - BLAGO POVEĆANA NA RAČUN 3
             Kontrolne: (3400,738) (3400,833) → Završava: (1000,930)
          [5] Peta krivulja: y 930→1080, ide levo (150px) - BLAGO POMERENO GORE
             Kontrolne: (280,970) (220,1055) → Završava: (1000,1080)
          [6] Završna linija: od (1000,1080) do (1920,1080)
        */}
        <path
          d="M1000,0 C700,75 600,135 1000,170 C1780,259 2000,358 1000,401 C-100,426 -200,588 1000,643 C3400,738 3400,833 1000,930 C280,970 220,1055 1000,1080 L1920,1080 L1920,0 Z"
          fill={inverted ? "#000000" : "url(#pinkGradient)"}
        />
      </svg>
    </div>
  )
}

export default AboutCurvedBackground

