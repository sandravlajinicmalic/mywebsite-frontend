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
            <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="85%" stopColor="#f9a8d4" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        
        {/* Left part - pink when inverted, transparent otherwise */}
        {/* 
          ANALIZA KRIVULJE - OZNAČENI DELOVI (SVE JEDNAKE VISINE - 180px):
          [1] Prva krivulja: y 0→180, ide levo (180px) - UJEDNAČEN PRELAZ
             Kontrolne: (700,80) (600,140) → Završava: (1000,180)
          [2] Druga krivulja: y 180→415, ide desno (235px) - POVEĆANA NA RAČUN 3 (POLA), POMERENA U DESNO (JOŠ), PORAVNAT PRELAZ SA 3
             Kontrolne: (1700,265) (1800,325) → Završava: (1000,415)
          [3] Treća krivulja: y 415→650, ide levo (235px) - POVEĆANA AMPLITUDA (OBRNUTO D), PORAVNAT PRELAZ SA 2
             Kontrolne: (-100,460) (-200,590) → Završava: (1000,650)
          [4] Četvrta krivulja: y 650→910, ide desno (260px) - POVEĆANA NA RAČUN 5, ZAOBLJENA, UJEDNAČEN PRELAZ SA 5
             Kontrolne: (3400,745) (3400,838) → Završava: (1000,910)
          [5] Peta krivulja: y 910→1080, ide levo (170px) - SMANJENA NA RAČUN 4, UJEDNAČEN PRELAZ SA 4
             Kontrolne: (300,952) (250,1040) → Završava: (1000,1080)
          [6] Završna linija: od (1000,1080) do (0,1080)
        */}
        <path
          d="M1000,0 C700,80 600,140 1000,180 C1700,265 1800,325 1000,415 C-100,460 -200,590 1000,650 C3400,745 3400,838 1000,910 C300,952 250,1040 1000,1080 L0,1080 L0,0 Z"
          fill={inverted ? "url(#pinkGradient)" : "transparent"}
        />
        
        {/* Right part - black when inverted, pink otherwise */}
        {/* 
          ANALIZA KRIVULJE - OZNAČENI DELOVI (SVE JEDNAKE VISINE - 180px):
          [1] Prva krivulja: y 0→180, ide levo (180px) - UJEDNAČEN PRELAZ
             Kontrolne: (700,80) (600,140) → Završava: (1000,180)
          [2] Druga krivulja: y 180→415, ide desno (235px) - POVEĆANA NA RAČUN 3 (POLA), POMERENA U DESNO (JOŠ), PORAVNAT PRELAZ SA 3
             Kontrolne: (1700,265) (1800,325) → Završava: (1000,415)
          [3] Treća krivulja: y 415→650, ide levo (235px) - POVEĆANA AMPLITUDA (OBRNUTO D), PORAVNAT PRELAZ SA 2
             Kontrolne: (-100,460) (-200,590) → Završava: (1000,650)
          [4] Četvrta krivulja: y 650→910, ide desno (260px) - POVEĆANA NA RAČUN 5, ZAOBLJENA, UJEDNAČEN PRELAZ SA 5
             Kontrolne: (3400,745) (3400,838) → Završava: (1000,910)
          [5] Peta krivulja: y 910→1080, ide levo (170px) - SMANJENA NA RAČUN 4, UJEDNAČEN PRELAZ SA 4
             Kontrolne: (300,952) (250,1040) → Završava: (1000,1080)
          [6] Završna linija: od (1000,1080) do (1920,1080)
        */}
        <path
          d="M1000,0 C700,80 600,140 1000,180 C1700,265 1800,325 1000,415 C-100,460 -200,590 1000,650 C3400,745 3400,838 1000,910 C300,952 250,1040 1000,1080 L1920,1080 L1920,0 Z"
          fill={inverted ? "#000000" : "url(#pinkGradient)"}
        />
      </svg>
    </div>
  )
}

export default AboutCurvedBackground

