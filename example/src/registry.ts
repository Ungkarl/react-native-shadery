import type { ComponentType } from 'react';

export interface DemoEntry {
  /** URL segment, e.g. 'orb' → /orb */
  slug: string;
  /** Display name, e.g. 'Orb' */
  name: string;
  /** One sentence shown in the gallery */
  description: string;
  /**
   * Small live preview for the gallery card (size ~72).
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
