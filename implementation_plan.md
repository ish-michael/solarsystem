# Implementation Plan - Solar System Explainer (Kosmos Explorer) - Phase 2 & 2.1

We are adding major improvements to the Kosmos Explorer app: highly prominent orbital lines, a dark/light mode toggle (deep space vs. antique starmap blueprint), detailed geological and historical data sheets, custom generated NASA-style images for all planets, and a toggleable space probes overlay showcasing historical space exploration.

Additionally, in Phase 2.1, we implemented robustness fixes covering asset compilation, MIME type sniff testing, macOS security clearance, React 19 linter conformity, and responsive layout optimizations.

---

## Proposed Changes

### 1. Prominent Orbits
- Normal Orbits: Indigo stroke with higher opacity (`rgba(99, 102, 241, 0.25)` in dark, `rgba(79, 70, 229, 0.35)` in light) and a stroke width of `1.2px` (up from `1px`).
- Selected Orbit: A bright, solid indigo-400 line (`rgba(129, 140, 248, 0.95)`) with a stroke width of `3.5px` and an SVG glow filter (`glow-selected-orbit`).

### 2. Dark & Light Mode Toggle
- Toggled via a sun/moon icon button in the top-right corner.
- Dark Mode: Deep space blacks (`#030712`), white twinkling stars, cosmic gradients.
- Light Mode (Antique Celestial Starmap): Soft cream background (`#fafaf9` / slate-50), dark indigo/slate orbital paths, golden star coordinates, blueprint-like styling.
- All styles will use Tailwind variables or class toggles (`.dark` parent mode).

### 3. Detailed Planetary Data
We will update `src/types.ts` and `src/data/solarSystemData.ts` to include:
- **Atmosphäre**: Text describing chemical composition (e.g., Nitrogen/Oxygen, CO2, Hydrogen/Helium).
- **Oberfläche**: Text describing geology and terrain (e.g., sulfur crusts, rusted iron-oxide sands, gas clouds, liquid metallic hydrogen).
- **Entdeckung**: Year and discoverer (e.g., Prehistoric vs. Galileo Galilei, William Herschel).

### 4. NASA-style Planet Images & MIME Correction (Phase 2.1)
- The generated images are stored in `src/assets/` and `public/assets/`.
- **MIME Correction**: The images were originally JPEG files named with a `.png` extension, which caused modern web servers and browsers enforcing strict security headers (e.g. `X-Content-Type-Options: nosniff`) to block them. They have been renamed to `.jpg` and the imports in [solarSystemData.ts](file:///Users/michael/Documents/AntiTest/src/data/solarSystemData.ts) updated.
- The detail panel renders this image right above the fact sheets, with a glowing drop-shadow.

### 5. Historical Space Probes Overlay ("Sonden anzeigen")
- A toggle button "Sonden anzeigen" (Show Probes) is placed in the bottom bar.
- When enabled, we render:
  - **Solar System View**: Probes fly on escape trajectories through the solar system:
    - *Voyager 1* & *Pioneer 10* on hyperbolic escape paths leaving the system.
    - *Voyager 2* crossing orbits of Jupiter, Saturn, Uranus, and Neptune.
    - *New Horizons* flying past the outer planets.
  - **Focused View**: Probes orbit the focused planet in their historical contexts:
    - *Earth*: Hubble Space Telescope / ISS.
    - *Mars*: Mars Reconnaissance Orbiter.
    - *Jupiter*: Juno spacecraft.
    - *Saturn*: Cassini-Huygens.
  - Probes are represented as small stylized SVG spacecraft with dashed path lines showing their trajectories.

---

## Phase 2.1 Robustness Updates & Fixes

### 1. Relative Asset Compiling (`base: './'`)
- Configured `base: './'` in [vite.config.ts](file:///Users/michael/Documents/AntiTest/vite.config.ts) so that Vite resolves all script, style, and image paths relatively (e.g., `./assets/...`). This makes the compiled app fully functional when double-clicked locally (`file://` protocol), served in subdirectories, or deployed to static hosting providers.

### 2. Collapsing Layout Fix
- Replaced the container-level `aspect-[4/3]` setup with direct responsive heights (`h-48 sm:h-64 lg:h-72`) on the `<img>` element inside [DetailPanel.tsx](file:///Users/michael/Documents/AntiTest/src/components/DetailPanel.tsx) to prevent layout engines from collapsing the images to 0px height in scrollable flexboxes. Added fallback slate/stone backgrounds to the image wrapper containers.

### 3. React 19 Rendering Purity
- Moved the randomized star creation loop out of the component scope to module scope in [StarField.tsx](file:///Users/michael/Documents/AntiTest/src/components/StarField.tsx) to prevent warnings about calling impure functions (`Math.random()`) inside rendering functions.

### 4. macOS Security Clearances
- Stripped extended attributes and quarantine flags from all asset images in `src/assets/` and `public/assets/` using the `xattr -c` utility to prevent macOS from blocking local server processes from reading them.

### 5. Diagnostic Printing
- Added a path printout (`MIME-Check & Pfad: ...`) underneath the image and a `useEffect` console logging fetch to monitor response metadata in the browser console.

---

## Component Updates

### [MODIFY] [types.ts](file:///Users/michael/Documents/AntiTest/src/types.ts)
- Add fields `atmosphere`, `surface`, `discoveryYear`, `discoverer`, and `imagePath` to the `Planet` and `SunData` types.

### [MODIFY] [solarSystemData.ts](file:///Users/michael/Documents/AntiTest/src/data/solarSystemData.ts)
- Import images with correct `.jpg` extensions.
- Populate the new atmosphere, surface, discovery, and image fields in German.

### [MODIFY] [index.css](file:///Users/michael/Documents/AntiTest/src/index.css)
- Add dark/light styling tokens and starmap coordinate grid backgrounds.
- Add SVG filter `glow-selected-orbit` for orbit lines.

### [MODIFY] [SolarSystem.tsx](file:///Users/michael/Documents/AntiTest/src/components/SolarSystem.tsx)
- Integrate theme-based styling (e.g. starmap styling in light mode).
- Implement space probes rendering (Voyager, New Horizons, Cassini, Juno, Hubble) depending on toggle state and focused planet.
- Remove unused parameter `_planetId` in `handleMouseLeave` to clear TypeScript compiler warnings.

### [MODIFY] [DetailPanel.tsx](file:///Users/michael/Documents/AntiTest/src/components/DetailPanel.tsx)
- Add display section for Atmosphere, Surface, and Discovery.
- Add planet image display with responsive heights, fallback backgrounds, visual diagnostic output, and console fetch logs.

### [MODIFY] [App.tsx](file:///Users/michael/Documents/AntiTest/src/App.tsx)
- Add theme state and space probes toggle state.
- Add top-right theme switcher button.
- Add bottom toggle button for space probes.

---

## Verification Plan

### Automated Verification
- Compile code using `npm run build`.
- Lint checks using `npm run lint` (returns 0 errors, 0 warnings).

### Manual Verification
1. **Orbits check**: Verify orbit lines are thick and selected planet orbits glow.
2. **Light Mode check**: Toggle theme button. Verify app changes to cream-colored starmap. Verify all text remains highly readable.
3. **Planet Details check**: Select Mars. Confirm new fields (Atmosphäre, Oberfläche, Entdeckung) and the generated NASA image are displayed.
4. **Probes check**: Turn on "Sonden anzeigen". In Solar view, check if Voyager 1/2 are animating along their paths. Select Jupiter and focus moons. Check if the Juno probe is orbiting Jupiter. Select Saturn and check Cassini.
5. **Console Check**: Open developer tools (F12) to verify `[Diagnostic] Image:` status is `200` or `304` and `Content-Type` is `image/jpeg`.
