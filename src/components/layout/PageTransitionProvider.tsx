"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

// Fade the NEW page in only. The previous version used AnimatePresence with
// mode="wait" + an exit animation, which faded the old page out to a blank
// cream screen before the new one faded in — a visible "flash" on every
// navigation, especially on mobile. A simple keyed fade-in has no blank gap.
export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Reduce Motion on → no page-change fade at all.
  if (reduce) return <div key={pathname}>{children}</div>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
