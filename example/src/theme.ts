export const colors = {
  background: '#0b0c10',
  card: '#12141a',
  cardPressed: '#1a1d25',
  border: '#1f222b',
  text: '#e8e9ee',
  textSecondary: '#8b8f9c',
  accent: '#7df7ff',
  track: '#2a2e39',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
} as const;

export const font = {
  title: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15 },
  caption: { fontSize: 13 },
  /** Keeps changing numbers from jittering. */
  value: { fontSize: 13, fontVariant: ['tabular-nums'] },
} as const;
