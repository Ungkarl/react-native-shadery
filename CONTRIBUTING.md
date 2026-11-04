# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The library package in the root directory.
- An example app in the `example/` directory.

To get started with the project, make sure you have the correct version of [Node.js](https://nodejs.org/) installed. See the [`.nvmrc`](./.nvmrc) file for the version used in this project.

Run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

> Since the project relies on Yarn workspaces, you cannot use [`npm`](https://github.com/npm/cli) for development without manually migrating.

### Running the example app

The [example app](/example/) is a dark gallery of every component, each with a playground of
live controls. It runs in **Expo Go**, so no native build is needed. It uses the library's
source directly, so edits to `src/` hot-reload.

```sh
yarn example ios       # iOS simulator, Expo Go
yarn example android   # Android emulator, Expo Go
yarn example web
yarn example start     # just the packager; scan the QR code with Expo Go on a phone
```

If Expo CLI can't open the iOS simulator itself, boot one (`xcrun simctl boot "iPhone 18 Pro"`) or
run `yarn example start` and open the `exp://` URL in Expo Go.

The example may only use libraries that ship inside Expo Go. Check before adding anything new.

App structure (Expo Router, routes in `example/src/app/`):

- `/` — front page.
- `/components` — full-screen modal with its own stack: the component list, grouped by
  category from `example/src/registry.ts`.
- `/components/<slug>` — the playground for one component, pushed inside the modal.
- `/components/dev/hello-shader` — internal smoke test (an animated gradient with a pause
  toggle) proving Skia + Reanimated + the shared core work. Listed under "Dev tools" in
  development builds only.

> Fast Refresh after editing SkSL can occasionally leave a canvas blank. Reload the app (`r` in
> the packager) before treating that as a bug.

### Checks

```sh
yarn typecheck
yarn lint          # yarn lint --fix to fix formatting
yarn test          # unit tests + real Skia (CanvasKit) shader tests
yarn prepare       # builds lib/
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add a new component.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for a component.
- `test`: adding or updating tests.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

## Shader rules

These each cost real debugging time. Follow them in every shader:

1. **Shaders fail silently on device.** `Skia.RuntimeEffect.Make` returns `null` on a compile
   error and the component just renders nothing. Every shader gets a CanvasKit compile test.
2. **Every uniform a shader declares must be supplied**, or Skia throws at runtime. Extra
   uniforms are ignored. Test it with `assertUniformsSupplied`.
3. **No backticks in SkSL.** The source lives in a JS template string; a backtick in a shader
   comment ends the string.
4. **Guard `pow`.** GPU `pow(x, y)` with a slightly negative `x` returns NaN (stray pixels on
   iOS). Always `pow(max(x, 0.0), y)`.
5. **Avoid hard color edges.** They come from noise warps strong enough to fold the layout back
   on itself, blend weights with corners (smoothstep plateaus), or weights that fall off too
   fast (Gaussians) so gaps snap. Use smooth, long-tailed, normalized weights.
6. **Sample shape noise by direction, not per pixel**, for ring-like shapes; otherwise high
   values tear the outline (`maxBandsPerRay` catches it).
7. **CanvasKit (CPU) and the GPU differ.** Always also look at the iOS simulator before calling
   a visual change done, and render at very long run times too (`iTime` ≈ 3000 s): precision
   bugs only show up late.

## Adding a component

Example name `glow-border` / `GlowBorder`.

### Files

```
src/components/glow-border/
  GlowBorder.tsx            Public component (props extend BaseShaderProps)
  glowBorder.sksl.ts        SkSL source string (+ snippets from src/core/sksl)
  shader.ts                 export const getGlowBorderShader = createLazyShader(glowBorderSksl)
  index.ts                  export { GlowBorder } + its props type + its LIMITS (if any)
  __tests__/glowBorder.test.ts
example/src/demos/GlowBorderDemo.tsx      Playground with a control per prop + reset
example/src/demos/GlowBorderThumbnail.tsx
```

### Wiring

1. `package.json` → `exports`:
   ```json
   "./glow-border": {
     "react-native-shadery-source": "./src/components/glow-border/index.ts",
     "types": "./lib/typescript/src/components/glow-border/index.d.ts",
     "default": "./lib/module/components/glow-border/index.js"
   }
   ```
2. `src/index.ts` → `export * from './components/glow-border';`
3. `example/src/registry.ts` → add the `DemoEntry` (with its `category`).
4. README → add a row to the Components table + a usage snippet + its props table.

### Definition of done

- [ ] Props: every number has documented min/max and is clamped to a range where it always
      looks right; defaults look good with zero props.
- [ ] Shared behaviour via core: `paused`, background pause, `reduceMotion`, `speed`,
      `accessibilityLabel`, `testID`.
- [ ] Shader rules above followed (no backticks, guarded `pow`, smooth blends).
- [ ] Tests: compiles, uniforms supplied, renders at t=5 and t=3000, plus one behaviour test
      specific to the component (e.g. "glow off is darker than glow on").
- [ ] Checked on the iOS simulator in Expo Go (and Android if available), including extreme
      prop values in the playground.
- [ ] Demo + thumbnail in the example app; README updated.
- [ ] `yarn typecheck && yarn lint && yarn test && yarn prepare` green; PR CI green; squash merge.

Shader test files start with:

```ts
/**
 * @jest-environment node
 */
/// <reference types="node" />
```

and use the helpers in [`test-utils/skia.ts`](./test-utils/skia.ts) (`compileShader`,
`renderShader`, `assertUniformsSupplied`, `maxBandsPerRay`).

## Releasing

We use [release-it](https://github.com/release-it/release-it). From an up-to-date `main`:

```sh
GITHUB_TOKEN=$(gh auth token) yarn release
npm publish
```

release-it bumps the version, writes `CHANGELOG.md`, commits, tags and creates the GitHub
release. npm publishing is a separate manual step (npm uses passkey 2FA).

## Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
