/**
 * Escenografía SVG: las islas del mapa y la ilustración del cuento.
 * Usa variables CSS del theme (var(--mint), etc.).
 */

/** Ancho fluido: la isla llena su contenedor manteniendo proporción. */
const islandSvgStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
};

/** Isla de los Números (botón del mapa). */
export function MathIslandArt() {
  return (
    <svg style={islandSvgStyle} viewBox="0 0 240 168">
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
    <svg style={islandSvgStyle} viewBox="0 0 240 168">
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
    <svg style={islandSvgStyle} viewBox="0 0 240 168">
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

/** Isla del Francés (botón del mapa): torre Eiffel y globo "Oui!". */
export function FrenchIslandArt() {
  return (
    <svg style={islandSvgStyle} viewBox="0 0 240 168">
      <ellipse cx="120" cy="150" rx="112" ry="16" fill="#fff" opacity="0.35" />
      <ellipse cx="120" cy="130" rx="98" ry="24" fill="#F3DCA6" />
      <path
        d="M26 124 Q 120 90 214 124 Q 180 110 120 108 Q 60 110 26 124 Z"
        fill="var(--mint)"
      />
      {/* Torre Eiffel simplificada */}
      <g fill="#7A6A8A" stroke="#7A6A8A">
        <path
          d="M96 118 L106 118 Q 108 88 111 70 L115 70 Q 118 88 120 118 L130 118 L124 108 Q 116 92 115 62 L111 62 Q 110 92 102 108 Z"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="107" y="52" width="12" height="12" rx="2" />
        <rect x="111" y="42" width="4" height="12" rx="1.5" />
        <line x1="100" y1="104" x2="126" y2="104" strokeWidth="4" strokeLinecap="round" />
        <line x1="104" y1="86" x2="122" y2="86" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <circle cx="113" cy="40" r="3" fill="var(--coral)" />
      {/* Globo "Oui!" */}
      <g transform="translate(146 34)">
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
          Oui!
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
