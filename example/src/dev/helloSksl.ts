// Smoke-test shader: an animated two-color gradient. Lives in the example so it never ships.
// Also compiled and rendered by src/core/__tests__/hello.test.ts.
export const helloSksl = `
  uniform float iTime;
  uniform vec2 iResolution;

  vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    vec3 a = vec3(0.49, 0.97, 1.0);
    vec3 b = vec3(0.62, 0.0, 1.0);
    float t = 0.5 + 0.5 * sin(iTime + uv.x * 3.0 + uv.y * 2.0);
    return vec4(mix(a, b, t), 1.0);
  }
`;
