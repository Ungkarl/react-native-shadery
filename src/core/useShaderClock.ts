import { useEffect } from 'react';
import {
  useFrameCallback,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import type { FrameInfo, SharedValue } from 'react-native-reanimated';
import { useAppActive } from './useAppActive';
import type { ReduceMotion } from './types';

/** Animation speed multiplier while motion is reduced. */
export const REDUCED_MOTION_SPEED = 0.25;

/** Largest time step per frame, in ms. Resuming after a stall never makes the animation jump. */
const MAX_STEP_MS = 100;

export interface ShaderClockOptions {
  /** Time multiplier. Default 1. */
  speed?: number;
  /** Freezes the clock on its current value. Default false. */
  paused?: boolean;
  /** How to respond to the system "Reduce Motion" setting. Default 'system'. */
  reduceMotion?: ReduceMotion;
}

/**
 * Shader time in seconds, advanced on the UI thread every frame.
 *
 * The frame loop stops entirely (no per-frame work, no redraws) while `paused` is true or the
 * app is in the background. Under Reduce Motion the clock runs at a quarter speed.
 */
export function useShaderClock({
  speed = 1,
  paused = false,
  reduceMotion = 'system',
}: ShaderClockOptions = {}): SharedValue<number> {
  const time = useSharedValue(0);
  const appActive = useAppActive();
  const systemReducedMotion = useReducedMotion();
  const reduced =
    reduceMotion === 'always' ||
    (reduceMotion === 'system' && systemReducedMotion);
  const rate = reduced ? speed * REDUCED_MOTION_SPEED : speed;
  const running = appActive && !paused;

  const frameCallback = useFrameCallback((frameInfo: FrameInfo) => {
    if (frameInfo.timeSincePreviousFrame !== null) {
      const dt = Math.min(frameInfo.timeSincePreviousFrame, MAX_STEP_MS);
      time.value += dt * 0.001 * rate;
    }
  }, running);

  // Start/stop Reanimated's frame loop (an external system) to match `running`.
  useEffect(() => {
    frameCallback.setActive(running);
  }, [frameCallback, running]);

  return time;
}
