"use client";

import { MotionConfig } from "framer-motion";

// Make every Framer Motion animation on the site honor the OS "Reduce Motion"
// accessibility setting. With reducedMotion="user", devices/users that have
// Reduce Motion enabled get movement/transform animations turned off (opacity
// fades are kept), which eliminates animation jank/flashing on phones that
// struggle with it (older devices, Low Power Mode, etc.).
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
