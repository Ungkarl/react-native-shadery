import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { Uniforms } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import {
  ShaderCanvas,
  createLazyShader,
  useShaderClock,
} from 'react-native-shadery';
import { helloSksl } from '../../../dev/helloSksl';
import { ControlPanel } from '../../../playground/ControlPanel';
import { ResetButton } from '../../../playground/ResetButton';
import { SliderControl } from '../../../playground/SliderControl';
import { ToggleControl } from '../../../playground/ToggleControl';
import { spacing } from '../../../theme';

const getHelloShader = createLazyShader(helloSksl);

const DEFAULTS = { paused: false, speed: 1 };
const MAX_PREVIEW = 480;

/** Internal smoke test: Skia + Reanimated + the shared core, in Expo Go. */
export default function HelloShader() {
  const { width } = useWindowDimensions();
  const size = Math.min(width - spacing.md * 2, MAX_PREVIEW);
  const [paused, setPaused] = useState(DEFAULTS.paused);
  const [speed, setSpeed] = useState(DEFAULTS.speed);

  const time = useShaderClock({ paused, speed });
  const uniforms = useDerivedValue<Uniforms>(() => ({
    iTime: time.value,
    iResolution: [size, size],
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.preview}>
        <ShaderCanvas
          width={size}
          height={size}
          shader={getHelloShader()}
          uniforms={uniforms}
        />
      </View>
      <ControlPanel>
        <ToggleControl label="paused" value={paused} onChange={setPaused} />
        <SliderControl
          label="speed"
          value={speed}
          min={0}
          max={4}
          step={0.1}
          onChange={setSpeed}
        />
        <ResetButton
          onPress={() => {
            setPaused(DEFAULTS.paused);
            setSpeed(DEFAULTS.speed);
          }}
        />
      </ControlPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  preview: { alignItems: 'center', paddingTop: spacing.md },
});
