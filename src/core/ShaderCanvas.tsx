import { Canvas, Fill, Shader } from '@shopify/react-native-skia';
import type { SkRuntimeEffect, Uniforms } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ShaderCanvasProps {
  width: number;
  height: number;
  /** Compiled shader. Nothing is rendered when it is `null`. */
  shader: SkRuntimeEffect | null;
  /** Every uniform the shader declares must be present. */
  uniforms: SharedValue<Uniforms> | Uniforms;
  style?: StyleProp<ViewStyle>;
}

/** Fills a `width` × `height` canvas with a runtime shader. */
export function ShaderCanvas({
  width,
  height,
  shader,
  uniforms,
  style,
}: ShaderCanvasProps) {
  if (!shader) {
    return null;
  }

  return (
    <Canvas style={[{ width, height }, style]}>
      <Fill>
        <Shader source={shader} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
