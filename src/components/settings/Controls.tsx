import styles from './Controls.module.css';

/** Control segmentado: una fila de botones donde se elige uno (o varios). */
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.segmented} role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.segment} ${value === opt.value ? styles.segmentActive : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Grupo de botones de selección múltiple (toggle por opción). */
export function MultiToggle<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: SegmentedOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className={styles.segmented} role="group">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            className={`${styles.segment} ${active ? styles.segmentActive : ''}`}
            onClick={() => onToggle(opt.value)}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Interruptor sí/no. */
export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${styles.toggleKnob} ${checked ? styles.toggleKnobOn : ''}`}
      />
    </button>
  );
}

/** Selector numérico con botones − y +. */
export function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.stepper}>
      <button
        className={styles.stepperButton}
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label="menos"
      >
        −
      </button>
      <span className={styles.stepperValue}>{value}</span>
      <button
        className={styles.stepperButton}
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label="más"
      >
        +
      </button>
    </div>
  );
}

/** Deslizador con etiquetas en los extremos. */
export function Slider({
  value,
  min,
  max,
  step = 1,
  leftLabel,
  rightLabel,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.sliderWrap}>
      {leftLabel && <span className={styles.sliderEdge}>{leftLabel}</span>}
      <input
        type="range"
        className={styles.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {rightLabel && <span className={styles.sliderEdge}>{rightLabel}</span>}
    </div>
  );
}

/** Muestras de paleta de color seleccionables. */
export interface SwatchOption {
  name: string;
  label: string;
  colors: string[];
}

export function Swatches({
  options,
  value,
  onChange,
}: {
  options: SwatchOption[];
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className={styles.swatches}>
      {options.map((opt) => (
        <button
          key={opt.name}
          className={`${styles.swatch} ${value === opt.name ? styles.swatchActive : ''}`}
          onClick={() => onChange(opt.name)}
          aria-pressed={value === opt.name}
        >
          <span className={styles.swatchColors}>
            {opt.colors.map((c, i) => (
              <span
                key={i}
                className={styles.swatchDot}
                style={{ background: c }}
              />
            ))}
          </span>
          <span className={styles.swatchName}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
