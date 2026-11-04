// Reusable SkSL snippets. Concatenate the ones a shader needs into its source.
// Rule: never put a backtick inside SkSL (it would end the JS template string).

/** `vec3 hash33(vec3 p)`: pseudo-random vector in -1..1 per lattice point. */
export const hash33 = `
  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx);
  }
`;

/** `float snoise3(vec3 p)`: 3D simplex noise, roughly -1..1. Requires {@link hash33}. */
export const snoise3 = `
  float snoise3(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    return dot(vec4(31.316), n);
  }
`;

/** `float ringDist(float a, float b)`: distance between two positions on a ring, in turns (0..0.5). */
export const ringDist = `
  float ringDist(float a, float b) {
    return abs(fract(a - b + 0.5) - 0.5);
  }
`;

/** `float dither(vec2 p)`: about 1/255 of noise per pixel, to break up banding in soft gradients. */
export const dither = `
  float dither(vec2 p) {
    return (fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  }
`;

/** `vec3 shoulder(vec3 x)`: leaves values below 0.8 untouched; highlights roll off instead of clipping. */
export const shoulder = `
  vec3 shoulder(vec3 x) {
    vec3 k = vec3(0.8);
    return min(x, k) + 0.2 * (vec3(1.0) - exp(-max(x - k, 0.0) * 5.0));
  }
`;
