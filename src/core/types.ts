import type { StyleProp, ViewStyle } from 'react-native';

/**
 * How to respond to the system "Reduce Motion" setting. `'system'` (default) plays the
 * animation at a quarter speed when it is on; `'always'` always does; `'never'` ignores it.
 */
export type ReduceMotion = 'system' | 'always' | 'never';

/** Props every shader component accepts. */
export interface BaseShaderProps {
  /**
   * Freezes the animation on its current frame. While paused (and while the app is in the
   * background) nothing is computed or redrawn. Default `false`.
   */
  paused?: boolean;
  /** See {@link ReduceMotion}. Default `'system'`. */
  reduceMotion?: ReduceMotion;
  /** Global time multiplier for all animation. Default `1`. */
  speed?: number;
  /** Read by screen readers. When set, the component is exposed as an image with this label. */
  accessibilityLabel?: string;
  /** Used to find the component in end-to-end tests. */
  testID?: string;
  /** Additional styles for the outer container. */
  style?: StyleProp<ViewStyle>;
}
