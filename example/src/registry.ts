import type { ComponentType } from 'react';

/** Sections of the component list, in display order. Empty ones are hidden. */
export const CATEGORIES = [
  'Orbs',
  'Backgrounds',
  'Borders',
  'Effects',
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface DemoEntry {
  /** URL segment, e.g. 'orb' → /components/orb */
  slug: string;
  /** Display name, e.g. 'Orb' */
  name: string;
  /** Section in the component list */
  category: Category;
  /** One sentence shown in the list */
  description: string;
  /**
   * Small live preview for the list row (size ~44).
   * Once the list grows, thumbnails should get `paused` while off-screen.
   */
  Thumbnail: ComponentType;
  /** Full playground: preview + controls */
  Demo: ComponentType;
}

/** THE single list of components shown in the app. Add new components here. */
export const DEMOS: DemoEntry[] = [];

export function findDemo(slug: string): DemoEntry | undefined {
  return DEMOS.find((demo) => demo.slug === slug);
}

/** Internal screens, listed in development builds only. */
export const DEV_TOOLS = [
  {
    href: '/components/dev/hello-shader',
    name: 'Hello shader',
    description: 'Smoke test: Skia + Reanimated + the shared core.',
  },
] as const;
