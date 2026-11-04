import { Skia } from '@shopify/react-native-skia';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';

/**
 * Returns a getter that compiles `source` the first time it is called and reuses the result.
 * Compiling lazily keeps imports free of side effects (`"sideEffects": false`).
 *
 * The getter returns `null` if the shader fails to compile; Skia does not throw. Every
 * shader must therefore have a CanvasKit compile test.
 */
export function createLazyShader(source: string): () => SkRuntimeEffect | null {
  let effect: SkRuntimeEffect | null | undefined;
  return () => {
    if (effect === undefined) {
      effect = Skia.RuntimeEffect.Make(source);
      if (effect === null && typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn('react-native-shadery: a shader failed to compile.');
      }
    }
    return effect;
  };
}
