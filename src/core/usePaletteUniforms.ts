import { useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { MAX_COLORS, hexToRgb, lchToRgb, rgbToLch } from './palette';
import type { LCH, RGB } from './palette';

export interface PaletteUniforms {
  color1: RGB;
  color2: RGB;
  color3: RGB;
  color4: RGB;
  color5: RGB;
  /** How many of the 5 slots hold real colors (2–5). */
  colorCount: number;
}

export interface PaletteUniformsOptions {
  /** 2–5 resolved hex colors (see `resolveColors`). */
  colors: readonly string[];
  /** Hue rotation in degrees per second (0 = off). */
  hueShift?: number;
  /** Shader time in seconds (see `useShaderClock`). */
  time: SharedValue<number>;
}

/**
 * Turns a palette into the `color1..color5` + `colorCount` uniforms every palette shader
 * declares. Unused slots repeat the last color. With `hueShift`, all colors rotate around
 * the OKLCH hue wheel over time, keeping lightness and chroma.
 */
export function usePaletteUniforms({
  colors,
  hueShift = 0,
  time,
}: PaletteUniformsOptions): SharedValue<PaletteUniforms> {
  // Parse once per palette (inline arrays are new every render, so key by content).
  const colorsKey = colors.join(',');
  const palette = useMemo(() => {
    const list = colorsKey.split(',');
    const rgb = list.map(hexToRgb);
    while (rgb.length < MAX_COLORS) rgb.push(rgb[rgb.length - 1]!);
    return { count: list.length, rgb, lch: rgb.map(rgbToLch) };
  }, [colorsKey]);

  const hueShiftRad = (hueShift * Math.PI) / 180;

  return useDerivedValue<PaletteUniforms>(() => {
    let rgb: RGB[] = palette.rgb;
    if (hueShiftRad !== 0) {
      const shift = hueShiftRad * time.value;
      rgb = palette.lch.map((c: LCH): RGB =>
        lchToRgb([c[0], c[1], c[2] + shift])
      );
    }
    return {
      color1: rgb[0]!,
      color2: rgb[1]!,
      color3: rgb[2]!,
      color4: rgb[3]!,
      color5: rgb[4]!,
      colorCount: palette.count,
    };
  });
}
