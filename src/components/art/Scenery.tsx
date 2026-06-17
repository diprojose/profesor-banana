/**
 * Escenografía SVG: el fondo del mapa, las islas (Números y
 * Palabras) y la ilustración del cuento. Portado del prototipo.
 * Usa variables CSS del theme (var(--mint), etc.).
 */

/** Fondo del mapa con sol, nubes, sendero y banderita. */
export function MapScenery() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 1024 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M0 300 Q 256 268 512 300 T 1024 300 L1024 600 L0 600 Z"
        fill="var(--bg2)"
        opacity="0.55"
      />
      <path
        d="M0 350 Q 256 320 512 350 T 1024 350 L1024 600 L0 600 Z"
        fill="var(--bg2)"
      />
      <g opacity="0.85">
        <circle cx="930" cy="80" r="44" fill="var(--yellow)" />
        <g stroke="var(--yellow)" strokeWidth="7" strokeLinecap="round">
          <line x1="930" y1="14" x2="930" y2="2" />
          <line x1="990" y1="80" x2="1010" y2="80" />
          <line x1="884" y1="34" x2="872" y2="22" />
          <line x1="976" y1="34" x2="988" y2="22" />
          <line x1="884" y1="126" x2="872" y2="138" />
        </g>
      </g>
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="180" cy="90" rx="46" ry="22" />
        <ellipse cx="220" cy="78" rx="34" ry="20" />
        <ellipse cx="610" cy="60" rx="40" ry="19" />
        <ellipse cx="650" cy="72" rx="30" ry="16" />
      </g>
      <path
        d="M408 432 C 478 422 496 332 600 314 C 660 304 690 286 728 262"
        stroke="#ffffff"
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray="0.5 28"
        fill="none"
        opacity="0.95"
      />
      <g>
        <circle cx="470" cy="398" r="15" fill="#fff" stroke="var(--mint)" strokeWidth="5" />
        <path
          d="M463 398 l5 5 9 -10"
          stroke="var(--accent)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="560" cy="345" r="15" fill="#fff" stroke="var(--mint)" strokeWidth="5" />
        <path
          d="M553 345 l5 5 9 -10"
          stroke="var(--accent)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="648" cy="305" r="14" fill="#EFE3CF" stroke="#fff" strokeWidth="4" />
        <path
          d="M648 300 a4 4 0 0 1 4 4 v3 h-8 v-3 a4 4 0 0 1 4 -4z M644 307 h8 v6 h-8z"
          fill="#C9A06A"
        />
      </g>
      <g transform="translate(404 416)">
        <path d="M-26 0 Q 0 22 26 0 Z" fill="#E98C73" />
        <rect x="-2" y="-30" width="4" height="30" fill="#9C6B45" />
        <path d="M2 -30 L2 -6 L26 -16 Z" fill="#fff" />
        <path d="M2 -30 L2 -6 L26 -16 Z" fill="var(--coral)" opacity="0.55" />
      </g>
    </svg>
  );
}

/** Isla de los Números (botón del mapa). */
export function MathIslandArt() {
  return (
    <svg width="252" height="168" viewBox="0 0 240 168">
      <ellipse cx="120" cy="150" rx="112" ry="16" fill="#fff" opacity="0.35" />
      <ellipse cx="120" cy="130" rx="98" ry="24" fill="#F3DCA6" />
      <path
        d="M26 124 Q 120 90 214 124 Q 180 110 120 108 Q 60 110 26 124 Z"
        fill="var(--mint)"
      />
      <path
        d="M80 112 C 76 92 76 76 84 58"
        stroke="#A9743F"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <g fill="#7FC98C">
        <ellipse cx="84" cy="52" rx="27" ry="10" transform="rotate(-16 84 52)" />
        <ellipse cx="84" cy="52" rx="27" ry="10" transform="rotate(16 84 52)" />
        <ellipse cx="84" cy="48" rx="10" ry="24" />
        <ellipse cx="64" cy="56" rx="24" ry="9" transform="rotate(-46 64 56)" />
        <ellipse cx="104" cy="56" rx="24" ry="9" transform="rotate(46 104 56)" />
      </g>
      <circle cx="80" cy="50" r="4.5" fill="#C98A2E" />
      <g>
        <circle cx="162" cy="74" r="36" fill="#fff" stroke="var(--yellow)" strokeWidth="7" />
        <text
          x="162"
          y="86"
          textAnchor="middle"
          fontFamily="var(--head)"
          fontSize="30"
          fontWeight="800"
          fill="var(--accent)"
        >
          123
        </text>
      </g>
    </svg>
  );
}

/** Isla de las Palabras (botón del mapa). */
export function WordIslandArt() {
  return (
    <svg width="252" height="168" viewBox="0 0 240 168">
      <ellipse cx="120" cy="150" rx="112" ry="16" fill="#fff" opacity="0.35" />
      <ellipse cx="120" cy="130" rx="98" ry="24" fill="#F3DCA6" />
      <path
        d="M26 124 Q 120 90 214 124 Q 180 110 120 108 Q 60 110 26 124 Z"
        fill="var(--mint)"
      />
      <rect x="78" y="78" width="9" height="36" rx="4" fill="#A9743F" />
      <circle cx="82" cy="64" r="26" fill="#84C98C" />
      <circle cx="64" cy="74" r="18" fill="#76BE82" />
      <circle cx="100" cy="74" r="18" fill="#76BE82" />
      <circle cx="72" cy="58" r="5" fill="var(--coral)" />
      <circle cx="94" cy="60" r="5" fill="var(--coral)" />
      <g transform="translate(150 46)">
        <path
          d="M0 8 Q 16 0 30 8 L30 50 Q 16 42 0 50 Z"
          fill="#fff"
          stroke="var(--coral)"
          strokeWidth="3"
        />
        <path
          d="M60 8 Q 44 0 30 8 L30 50 Q 44 42 60 50 Z"
          fill="#fff"
          stroke="var(--coral)"
          strokeWidth="3"
        />
        <text
          x="30"
          y="34"
          textAnchor="middle"
          fontFamily="var(--head)"
          fontSize="20"
          fontWeight="800"
          fill="var(--coralInk)"
        >
          ABC
        </text>
      </g>
    </svg>
  );
}

/** Isla del Inglés (botón del mapa): isla con un globo "Hi!". */
export function EnglishIslandArt() {
  return (
    <svg width="252" height="168" viewBox="0 0 240 168">
      <ellipse cx="120" cy="150" rx="112" ry="16" fill="#fff" opacity="0.35" />
      <ellipse cx="120" cy="130" rx="98" ry="24" fill="#F3DCA6" />
      <path
        d="M26 124 Q 120 90 214 124 Q 180 110 120 108 Q 60 110 26 124 Z"
        fill="var(--mint)"
      />
      {/* Cartelito con la bandera-mundo y "Hi!" */}
      <g transform="translate(96 40)">
        <circle cx="22" cy="34" r="34" fill="#fff" stroke="var(--accent)" strokeWidth="6" />
        <circle cx="22" cy="34" r="26" fill="#BFE0F5" />
        <path
          d="M2 28 Q 22 22 42 28 M2 40 Q 22 46 42 40 M22 8 Q 34 34 22 60 M22 8 Q 10 34 22 60"
          stroke="var(--accent)"
          strokeWidth="2.4"
          fill="none"
          opacity="0.7"
        />
      </g>
      <g transform="translate(150 30)">
        <path
          d="M2 6 Q2 0 8 0 H46 Q52 0 52 6 V26 Q52 32 46 32 H22 L12 42 L14 32 H8 Q2 32 2 26 Z"
          fill="#fff"
          stroke="var(--coral)"
          strokeWidth="3"
        />
        <text
          x="27"
          y="23"
          textAnchor="middle"
          fontFamily="var(--head)"
          fontSize="18"
          fontWeight="800"
          fill="var(--coralInk)"
        >
          Hi!
        </text>
      </g>
    </svg>
  );
}

/** Ilustración del cuento (Isla de las Palabras / lectura). */
export function StorybookScene() {
  return (
    <svg width="100%" viewBox="0 0 560 300" style={{ display: 'block' }}>
      <rect width="560" height="300" fill="#DCF1FB" />
      <circle cx="80" cy="64" r="34" fill="#FBD34B" />
      <g stroke="#FBD34B" strokeWidth="6" strokeLinecap="round">
        <line x1="80" y1="14" x2="80" y2="2" />
        <line x1="128" y1="64" x2="142" y2="64" />
        <line x1="44" y1="28" x2="35" y2="19" />
        <line x1="116" y1="28" x2="125" y2="19" />
      </g>
      <g fill="#fff" opacity="0.92">
        <ellipse cx="420" cy="58" rx="44" ry="20" />
        <ellipse cx="460" cy="48" rx="32" ry="17" />
      </g>
      <path
        d="M210 90 q14 -12 28 0"
        stroke="#8FB8C9"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M250 78 q12 -10 24 0"
        stroke="#8FB8C9"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M0 196 Q 140 176 280 196 T 560 196 L560 300 L0 300 Z"
        fill="#9AD7EC"
        opacity="0.6"
      />
      <path
        d="M0 224 Q 140 204 280 224 T 560 224 L560 300 L0 300 Z"
        fill="#79C7E4"
      />
      <ellipse cx="300" cy="214" rx="118" ry="22" fill="#F3DCA6" />
      <path
        d="M210 206 Q 300 180 392 206 Q 350 196 300 195 Q 250 196 210 206 Z"
        fill="#9BD9A8"
      />
      <path
        d="M300 196 C 296 176 296 160 304 142"
        stroke="#A9743F"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <g fill="#7FC98C">
        <ellipse cx="304" cy="136" rx="30" ry="11" transform="rotate(-16 304 136)" />
        <ellipse cx="304" cy="136" rx="30" ry="11" transform="rotate(16 304 136)" />
        <ellipse cx="304" cy="132" rx="11" ry="27" />
      </g>
      <g transform="translate(150 224)">
        <path d="M-34 0 Q 0 26 34 0 Z" fill="#E98C73" />
        <rect x="-2" y="-40" width="5" height="40" fill="#9C6B45" />
        <path d="M3 -40 L3 -8 L34 -22 Z" fill="#fff" />
        <path d="M3 -40 L3 -8 L34 -22 Z" fill="var(--coral)" opacity="0.6" />
      </g>
      <g transform="translate(0 12)">
        <path
          d="M430 250 q10 8 20 0"
          stroke="#fff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
