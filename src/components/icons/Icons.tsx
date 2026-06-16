/**
 * Íconos SVG pequeños y reutilizables, portados del prototipo.
 * Todos aceptan tamaño y heredan color/animación vía props estándar.
 */

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function StarIcon({ size = 28, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <path
        d="M12 2.6l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.1 19.6l1.3-6.2L2.7 9.1l6.3-.7z"
        fill="#FBC13E"
        stroke="#E9A21F"
        strokeWidth="1"
      />
    </svg>
  );
}

export function HomeIcon({ size = 20, color = 'var(--accent)' }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M3 11.5L12 4l9 7.5"
        stroke={color}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 10v9h13v-9"
        stroke={color}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M7 5l12 7-12 7z" fill="#fff" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="#fff"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircleIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#9FD9B8" />
      <path
        d="M8 12.5l2.5 2.5 5-5.5"
        stroke="#fff"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrossCircleIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#F7B3A8" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GearIcon({ size = 26, color = 'var(--ink)' }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1l-.4-2.6h-3.8l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 11a7.8 7.8 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h3.8l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4z"
        fill={color}
        opacity="0.9"
      />
      <circle cx="12" cy="12" r="3.2" fill="#fff" />
    </svg>
  );
}

export function SpeakerIcon({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 4V5L8 9z" fill="#fff" />
      <path
        d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicIcon({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'relative' }}>
      <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
      <path
        d="M6 11a6 6 0 0 0 12 0M12 17v3"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
