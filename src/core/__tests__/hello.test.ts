/**
 * @jest-environment node
 */
/// <reference types="node" />
import { describe, expect, it } from '@jest/globals';
import { helloSksl } from '../../../example/src/dev/helloSksl';
import {
  assertUniformsSupplied,
  compileShader,
  renderShader,
} from '../../../test-utils/skia';

const SIZE = 160;
const uniformsAt = (iTime: number) => ({
  iTime,
  iResolution: [SIZE, SIZE],
});

describe('hello shader (smoke test for the harness)', () => {
  it('compiles with Skia', async () => {
    const { effect, errors } = await compileShader(helloSksl);
    expect(errors).toEqual([]);
    expect(effect).not.toBeNull();
  });

  it('only declares uniforms the screen supplies', async () => {
    const { effect } = await compileShader(helloSksl);
    assertUniformsSupplied(effect!, Object.keys(uniformsAt(0)));
  });

  it.each([5, 3000])('renders a non-empty image at t = %d', async (t) => {
    const image = await renderShader(helloSksl, uniformsAt(t), { size: SIZE });
    expect(image.total).toBeGreaterThan(0);
    const [r, g, b] = image.rgb(SIZE / 2, SIZE / 2);
    expect(r + g + b).toBeGreaterThan(0);
  });

  it('animates over time', async () => {
    const a = await renderShader(helloSksl, uniformsAt(5), { size: SIZE });
    const b = await renderShader(helloSksl, uniformsAt(6), { size: SIZE });
    expect(a.rgb(10, 10)).not.toEqual(b.rgb(10, 10));
  });
});
