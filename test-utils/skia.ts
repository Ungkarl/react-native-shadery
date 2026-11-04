/// <reference types="node" />
// CanvasKit (Skia compiled to WebAssembly) helpers for shader tests. It is the same SkSL
// compiler react-native-skia uses on device, so a shader that compiles here compiles there.
// Lives outside src/ so it is never published.
//
// Test files using this must start with:
//   /**
//    * @jest-environment node
//    */
//   /// <reference types="node" />
import path from 'path';
import { expect } from '@jest/globals';
import type { CanvasKit, RuntimeEffect } from 'canvaskit-wasm';

const CANVASKIT_JS = require.resolve('canvaskit-wasm/bin/full/canvaskit.js');

let canvasKit: Promise<CanvasKit> | undefined;

/** Loads CanvasKit once per test file. */
export function loadCanvasKit(): Promise<CanvasKit> {
  if (!canvasKit) {
    const init = require(CANVASKIT_JS);
    const dir = path.dirname(CANVASKIT_JS);
    canvasKit = init({
      locateFile: (file: string) => path.join(dir, file),
    }) as Promise<CanvasKit>;
  }
  return canvasKit;
}

/** Compiles SkSL. `effect` is null on failure; `errors` holds the compiler messages. */
export async function compileShader(source: string) {
  const CK = await loadCanvasKit();
  const errors: string[] = [];
  const effect = CK.RuntimeEffect.Make(source, (e) => errors.push(e));
  return { effect, errors };
}

/** Uniform values by name. Scalars may be plain numbers; vectors are arrays. */
export type UniformValues = Record<string, number | readonly number[]>;

export interface RenderedImage {
  size: number;
  /** RGBA_8888, unpremultiplied, sRGB. */
  pixels: Uint8Array;
  /** Sum of all alpha values (0 = fully transparent image). */
  total: number;
  alpha(x: number, y: number): number;
  rgb(x: number, y: number): [number, number, number];
}

/** Renders one `size` × `size` frame of a shader. Throws if it doesn't compile. */
export async function renderShader(
  source: string,
  uniforms: UniformValues,
  { size = 160 }: { size?: number } = {}
): Promise<RenderedImage> {
  const CK = await loadCanvasKit();
  const { effect, errors } = await compileShader(source);
  if (!effect)
    throw new Error(`shader failed to compile:\n${errors.join('\n')}`);

  const values: number[] = [];
  for (let i = 0; i < effect.getUniformCount(); i++) {
    const name = effect.getUniformName(i);
    const value = uniforms[name];
    if (value === undefined) throw new Error(`missing uniform "${name}"`);
    values.push(...(typeof value === 'number' ? [value] : value));
  }

  const surface = CK.MakeSurface(size, size);
  if (!surface) throw new Error('could not create a CanvasKit surface');
  const paint = new CK.Paint();
  paint.setShader(effect.makeShader(values));
  surface.getCanvas().drawPaint(paint);
  const pixels = surface.makeImageSnapshot().readPixels(0, 0, {
    width: size,
    height: size,
    colorType: CK.ColorType.RGBA_8888,
    alphaType: CK.AlphaType.Unpremul,
    colorSpace: CK.ColorSpace.SRGB,
  }) as Uint8Array;
  paint.delete();
  surface.delete();
  effect.delete();

  let total = 0;
  for (let i = 3; i < pixels.length; i += 4) total += pixels[i]!;
  const index = (x: number, y: number) => (y * size + x) * 4;
  return {
    size,
    pixels,
    total,
    alpha: (x, y) => pixels[index(x, y) + 3]!,
    rgb: (x, y) => {
      const i = index(x, y);
      return [pixels[i]!, pixels[i + 1]!, pixels[i + 2]!];
    },
  };
}

/**
 * Fails if the shader declares a uniform the component doesn't supply (Skia throws on
 * device when one is missing). Extra supplied uniforms are fine.
 */
export function assertUniformsSupplied(
  effect: RuntimeEffect,
  suppliedNames: readonly string[]
) {
  const declared: string[] = [];
  for (let i = 0; i < effect.getUniformCount(); i++) {
    declared.push(effect.getUniformName(i));
  }
  const missing = declared.filter((name) => !suppliedNames.includes(name));
  expect(missing).toEqual([]);
}

/**
 * Walks 72 rays from the center to the edge and returns the highest number of separate
 * bright bands any ray crosses. An intact ring gives 1 on every ray; a torn outline more.
 * Two thresholds (hysteresis), so pixel rounding at an edge can't count as a new band.
 */
export function maxBandsPerRay(
  alpha: (x: number, y: number) => number,
  size: number,
  { high = 110, low = 60 }: { high?: number; low?: number } = {}
) {
  let worst = 0;
  const c = size / 2;
  for (let a = 0; a < 72; a++) {
    const angle = (a / 72) * Math.PI * 2;
    let bands = 0;
    let inside = false;
    for (let r = 0; r < c - 1; r++) {
      const value = alpha(
        Math.round(c + Math.cos(angle) * r),
        Math.round(c + Math.sin(angle) * r)
      );
      if (!inside && value > high) {
        bands++;
        inside = true;
      } else if (inside && value < low) {
        inside = false;
      }
    }
    worst = Math.max(worst, bands);
  }
  return worst;
}
