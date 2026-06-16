/**
 * Personajes e ilustraciones grandes de la app, portados del
 * prototipo: avatar del niño, el Profesor Banana y la manzana.
 */

/** Carita del avatar del encabezado (Home). */
export function ChildAvatar({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="30" r="20" fill="#F6CBA0" />
      <path
        d="M12 28 C 12 12 52 12 52 28 C 52 20 44 14 32 14 C 20 14 12 20 12 28 Z"
        fill="#6B4A2B"
      />
      <circle cx="25" cy="30" r="3" fill="#3b2f26" />
      <circle cx="39" cy="30" r="3" fill="#3b2f26" />
      <path
        d="M26 39 Q 32 44 38 39"
        stroke="#B5704A"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="22" cy="36" rx="3.5" ry="2.2" fill="#F4A9A0" opacity="0.7" />
      <ellipse cx="42" cy="36" rx="3.5" ry="2.2" fill="#F4A9A0" opacity="0.7" />
    </svg>
  );
}

/** Manzana del problema de matemáticas. */
export function Apple({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size + 2} viewBox="0 0 64 64">
      <ellipse cx="32" cy="59" rx="16" ry="3.5" fill="rgba(0,0,0,0.07)" />
      <path
        d="M32 21 C 24 13 12 17 12 31 C 12 45 22 56 32 56 C 42 56 52 45 52 31 C 52 17 40 13 32 21 Z"
        fill="#F1736B"
      />
      <rect x="30" y="11" width="4.5" height="13" rx="2.2" fill="#8A5A3B" />
      <ellipse
        cx="41"
        cy="13"
        rx="9"
        ry="5"
        fill="#7FCB86"
        transform="rotate(-24 41 13)"
      />
      <ellipse cx="23" cy="31" rx="5" ry="8" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

/** Profesor Banana, versión simple (botón de ayuda). */
export function ProfessorBananaSimple({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size + 2} viewBox="0 0 120 130">
      <path
        d="M58 16 C 40 20 31 42 31 67 C 31 92 43 112 64 114 C 83 116 91 99 91 79 C 91 59 85 41 79 27 C 75 18 67 14 58 16 Z"
        fill="#F7CE3E"
        stroke="#E7B52E"
        strokeWidth="3"
      />
      <g stroke="#5A4632" strokeWidth="3.4" fill="#fff">
        <circle cx="53" cy="62" r="12" />
        <circle cx="80" cy="62" r="12" />
      </g>
      <circle cx="55" cy="63" r="4" fill="#41372B" />
      <circle cx="82" cy="63" r="4" fill="#41372B" />
      <path
        d="M57 82 Q 67 91 78 81"
        stroke="#5A4632"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Profesor Banana, versión completa con birrete (modal/celebración). */
export function ProfessorBananaFull({
  size = 120,
  bob = true,
}: {
  size?: number;
  bob?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * (130 / 120)}
      viewBox="0 0 120 130"
      style={bob ? { animation: 'bob 2.2s ease-in-out infinite' } : undefined}
    >
      <ellipse cx="62" cy="122" rx="30" ry="6" fill="rgba(0,0,0,0.08)" />
      <path
        d="M58 16 C 40 20 31 42 31 67 C 31 92 43 112 64 114 C 83 116 91 99 91 79 C 91 59 85 41 79 27 C 75 18 67 14 58 16 Z"
        fill="#F7CE3E"
        stroke="#E7B52E"
        strokeWidth="3"
      />
      <path
        d="M48 32 C 41 46 40 70 48 90 C 53 102 60 106 66 104 C 56 98 51 84 50 67 C 49 51 51 40 56 32 C 53 30 50 30 48 32 Z"
        fill="#FBDD72"
        opacity="0.8"
      />
      <g stroke="#5A4632" strokeWidth="3.4" fill="#fff">
        <circle cx="53" cy="62" r="13" />
        <circle cx="80" cy="62" r="13" />
      </g>
      <line x1="66" y1="62" x2="67" y2="62" stroke="#5A4632" strokeWidth="3.4" />
      <circle cx="55" cy="63" r="4.5" fill="#41372B" />
      <circle cx="82" cy="63" r="4.5" fill="#41372B" />
      <circle cx="56.5" cy="61.5" r="1.5" fill="#fff" />
      <circle cx="83.5" cy="61.5" r="1.5" fill="#fff" />
      <ellipse cx="44" cy="76" rx="6" ry="4" fill="#F6A6A0" opacity="0.7" />
      <ellipse cx="89" cy="76" rx="6" ry="4" fill="#F6A6A0" opacity="0.7" />
      <path
        d="M55 82 Q 67 93 79 82"
        stroke="#5A4632"
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
      />
      <g>
        <rect
          x="44"
          y="6"
          width="40"
          height="9"
          rx="2"
          fill="#3B3550"
          transform="rotate(-8 64 10)"
        />
        <path d="M50 12 L64 7 L78 12 L64 17 Z" fill="#4A4366" />
        <circle cx="80" cy="11" r="2.5" fill="#F7CE3E" />
        <path d="M80 11 L82 22" stroke="#F7CE3E" strokeWidth="2" />
        <circle cx="82" cy="23" r="2.5" fill="#F2B84B" />
      </g>
    </svg>
  );
}
