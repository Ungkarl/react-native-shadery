# react-native-shadery — agent notes

GPU shader components for React Native (Skia + Reanimated). JS-only library built with
react-native-builder-bob; Expo example app in `example/`. See `CONTRIBUTING.md` for the full
component checklist.

## Rules

- **Yarn only** (`yarn`, `yarn add`, `yarn example expo install …`). Never `npm install`.
- **Git:** branch per change, Conventional Commits, PR, CI green, squash merge. Never push to
  `main` (release commits from `yarn release` are the only exception).
- **Every shader** needs CanvasKit tests (compiles, all uniforms supplied, renders at t=5 and
  t=3000, one behaviour test) using `test-utils/skia.ts`, **and** a look on the iOS simulator in
  Expo Go before calling it done.
- **SkSL:** no backticks (they end the JS template string); `pow(max(x, 0.0), y)`; smooth,
  long-tailed, normalized blend weights (no smoothstep plateaus, no Gaussians that snap);
  sample shape noise by direction, not per pixel.
- Shaders compile lazily via `createLazyShader` (the package has `"sideEffects": false`).
- The example app must stay **Expo Go compatible**: only libraries bundled in Expo Go.
  Routes live in `example/src/app/`; components are added only via `example/src/registry.ts`.
- **React:** no `useEffect` for derived state, resets, event logic or parent notification;
  `useSyncExternalStore` for external stores. The only effect in core starts/stops Reanimated's
  frame callback.
- Before finishing: `yarn typecheck && yarn lint && yarn test && yarn prepare`.
