export { COLOR_SCHEMES } from './colorSchemes';
export type { ColorSchemeName } from './colorSchemes';
export {
  generatePalette,
  resolveColors,
  MIN_COLORS,
  MAX_COLORS,
  DEFAULT_COLORS,
} from './palette';
export type { ShaderColors } from './palette';
export type { BaseShaderProps, ReduceMotion } from './types';

// Building blocks for custom shaders.
export { ShaderCanvas } from './ShaderCanvas';
export type { ShaderCanvasProps } from './ShaderCanvas';
export { createLazyShader } from './lazyShader';
export { useShaderClock, REDUCED_MOTION_SPEED } from './useShaderClock';
export type { ShaderClockOptions } from './useShaderClock';
export { usePaletteUniforms } from './usePaletteUniforms';
export type {
  PaletteUniforms,
  PaletteUniformsOptions,
} from './usePaletteUniforms';
export { useAppActive } from './useAppActive';
export * as sksl from './sksl/noise';
