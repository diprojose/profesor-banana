# Profesor Banana 🍌

App para que los niños aprendan **matemáticas**, **lectura** e **inglés**
jugando, de la mano del Profesor Banana. React + TypeScript + Vite, instalable como PWA (funciona sin
internet) y con cuentas opcionales en Firebase para guardar el progreso
de varios niños en la nube.

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (Vite)
npm run build    # compilar para producción
npm run preview  # previsualizar el build
npm test         # tests (Vitest)
```

## Cuentas y nube (Firebase) ☁️

Sin configurar nada, la app funciona en **modo local**: el progreso se
guarda en el dispositivo. Para activar cuentas (registro/login) y la
sincronización en la nube:

1. Crea un proyecto en <https://console.firebase.google.com> (gratis).
2. **Authentication → Sign-in method**: activa *Email/Password* y *Google*.
3. **Firestore Database**: créala en modo producción y publica las reglas
   de `firestore.rules` (Firestore → Reglas → pegar → Publicar).
4. **Configuración del proyecto → Tus apps → Web**: registra una app web
   y copia la configuración.
5. Copia `.env.example` a `.env.local` y pega ahí esos valores.
6. `npm run dev` — ahora verás la pantalla de login al abrir.

### Desplegar en Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # elige tu proyecto
npm run build
firebase deploy           # sube dist/ + reglas de Firestore
```

### Cómo funciona la sincronización

- El padre/madre se registra; cada niño tiene su **perfil** (avatar,
  nombre, grado) con su propio progreso.
- Los datos viven en `users/{uid}/children/{perfil}` en Firestore y
  siempre también en `localStorage` (la app funciona offline y sube los
  cambios al reconectar; gana la copia más reciente).
- "Jugar sin cuenta" usa solo el dispositivo; al crear cuenta después,
  los perfiles locales se suben solos.

## PWA 📱

La app es instalable ("Añadir a pantalla de inicio") y precachea todo lo
necesario para jugar sin internet (`vite-plugin-pwa`, ver
`vite.config.ts`).

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
├─ content/stories.ts       Cuentos (varias páginas ES / EN)
├─ english/                 🇬🇧 Isla del Inglés (vocabulario + generador)
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

## Lectura con corrección real 🎤

- "Escuchar" lee la frase en voz alta (TTS).
- El botón del micrófono **graba de verdad** con la Web Speech API
  (`src/hooks/useSpeechRecognition.ts`, Chrome/Edge): transcribe lo que dice
  el niño y lo compara con la frase (`src/game/readingCheck.ts`).
- La frase se pinta **palabra por palabra**: verde = bien leída, naranja
  subrayada = falta practicar. Da estrella solo si lee bien (≥80%), una vez
  por página.
- Si el navegador no soporta reconocimiento, el botón pasa a confirmación
  manual ("Ya lo leí").

## Isla del Inglés 🇬🇧

- Muestra un dibujo (emoji grande) y opciones del nombre en inglés
  (opción múltiple, como las sumas).
- Botón 🔊 para oír la **pronunciación** en inglés.
- Suma estrellas, medallas y la estadística "palabras en inglés".
- Vocabulario en `src/english/vocabulary.ts` (fácil de ampliar).

## Cuentos múltiples

- Selector de cuentos al entrar a la Isla de las Palabras.
- El botón de avanzar **solo aparece cuando el niño lee bien** la página.

## Próximos pasos sugeridos

- Más operaciones (multiplicación) y más cuentos/vocabulario.
- Avatar del niño personalizable.
- Sonidos de acierto/celebración.
