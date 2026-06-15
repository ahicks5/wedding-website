"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="never": render the same (working) animated experience on every
// device regardless of the OS "Reduce Motion" setting. We tried honoring the OS
// setting, but our static fallback hid content ("pure white") on phones with
// Reduce Motion enabled — and the normal animations are smooth there anyway
// (the real flicker was backdrop-blur, since removed). "never" also makes
// useReducedMotion() return false everywhere, so the static fallback branches
// in FadeIn / PageTransition / Hero / StoryHero stay inert.
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
