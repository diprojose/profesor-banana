# Aventura Matemática 🏝️

App para que los niños aprendan **matemáticas** y **lectura** jugando.
Reescrita en React + TypeScript a partir del prototipo original
(`Aventura Matematica.dc.html`).

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (Vite)
npm run build    # compilar para producción
npm run preview  # previsualizar el build
npm test         # tests (Vitest)
```

## Estructura

```
src/
├─ main.tsx                 Punto de entrada
├─ App.tsx                  Enrutado entre pantallas
├─ styles/global.css        Reset + animaciones compartidas
├─ game/                    🎲 Generador de problemas ALEATORIOS
│  ├─ types.ts              Tipos y configuración (rangos, operaciones)
│  ├─ mathGenerator.ts      Lógica pura y testeable
│  └─ mathGenerator.test.ts Tests del generador
├─ i18n/strings.ts          Textos ES / EN
├─ content/readingPages.ts  Frases del cuento
├─ theme/                   Paletas de color y fuentes (tokens)
├─ state/                   Contexto global (pantalla, idioma, estrellas, ajustes)
├─ hooks/useSpeech.ts       Text-to-Speech (lectura en voz alta)
└─ components/
   ├─ layout/               Marco de tablet
   ├─ common/               Piezas reutilizables (estrellas, idioma, mapa)
   ├─ icons/                Íconos SVG pequeños
   ├─ art/                  Ilustraciones (personajes y escenografía)
   └─ screens/              Home, Math y Reading
```

## Lo nuevo respecto al prototipo

- **Sumas aleatorias**: cada problema se genera al azar
  (`src/game/mathGenerator.ts`) en vez de estar hardcodeado. Es
  configurable (rango de números, tope del resultado, nº de opciones)
  y ya soporta **resta** además de suma.
- Arquitectura por capas (estado, contenido, theme, UI) lista para
  ir agregando niveles, más operaciones y cuentos.

## Pantalla de ajustes ⚙️

Accesible desde el engranaje en la esquina del mapa. Es **muy
personalizable** y todo se guarda automáticamente en `localStorage`
(`src/state/persistence.ts`):

- **Perfil**: nombre del niño/a.
- **Idioma**: ES / EN.
- **Apariencia**: paleta de colores (con muestras) y tipo de letra (con vista previa).
- **Matemáticas**: presets de dificultad (Fácil/Medio/Difícil) o control fino
  de operaciones (suma/resta), número más grande, resultado máximo y nº de
  opciones. Alimenta directamente al generador (`mathConfig`).
- **Audio y lectura**: activar/desactivar la voz, velocidad y tono.
- Botón de **Restablecer todo**.

## Niveles y medallas 🏆

El progreso del niño (estrellas, sumas resueltas, páginas leídas, racha y
medallas) vive en `src/progress/` y se guarda en `localStorage`
(`aventura.progress.v1`):

- **Niveles** (`levels.ts`): cada nivel pide más estrellas que el anterior.
  La barra del mapa muestra el progreso real al siguiente nivel.
- **Medallas** (`medals.ts`): logros desbloqueables por hitos (primera
  estrella, 10/25 sumas, racha de 5, leer 5/15 páginas, 25 estrellas, nivel 5).
- **Pantalla de Logros**: toca el perfil en el mapa para ver tu nivel,
  estadísticas y la colección de medallas.
- **Celebración**: al subir de nivel o ganar una medalla aparece un
  `RewardOverlay`. El progreso está cubierto con tests.

## Dificultad que sube con el nivel 📈

- `src/game/difficulty.ts` mapea cada nivel a un rango de números: empieza
  con sumas de 1 dígito y crece hasta **sumas de 4 dígitos**.
- En Ajustes → Matemáticas hay dos modos: **Por nivel** (automático, por
  defecto) o **Personalizada** (topes fijos).
- **Sin repeticiones seguidas**: el generador recuerda las últimas sumas y
  evita repetirlas (4+5 y 5+4 cuentan como la misma).
- **Números grandes**: las manzanas solo se dibujan con números pequeños
  (≤10) y la tipografía se ajusta sola para que no se desborde.
- **Tips reales** (`src/game/hints.ts`): el botón de ayuda da estrategias
  concretas usando los números del problema (contar desde el mayor, contar
  hacia atrás, trabajar por columnas...).

## Próximos pasos sugeridos

- Más operaciones (multiplicación) y más cuentos/niveles de lectura.
- Avatar del niño personalizable.
- Sonidos de acierto/celebración.
