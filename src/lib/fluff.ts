import FLUFF from "./fluff.generated.json";

const FLUFF_FILES = FLUFF as string[];

/**
 * Server-side random pick from the fluff manifest. Called from each
 * page.tsx so the chosen filename lands in the SSR HTML — the browser
 * starts loading the image during initial parse instead of waiting on
 * React hydration + a useEffect tick. Pages that import this must also
 * `export const dynamic = "force-dynamic"` so the pick re-rolls per
 * request instead of getting frozen at build time.
 */
export function pickRandomFluff(): string | null {
  if (FLUFF_FILES.length === 0) return null;
  return FLUFF_FILES[Math.floor(Math.random() * FLUFF_FILES.length)];
}
