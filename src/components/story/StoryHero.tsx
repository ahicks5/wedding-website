"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StoryHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.75]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Drop shadow on the text so it stays legible regardless of how
  // light or dark the photo behind it happens to be.
  const textShadow =
    "0 2px 14px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.5)";

  return (
    <section
      ref={ref}
      className="relative flex h-[55vh] items-center justify-center overflow-hidden sm:h-[70vh] md:h-[80vh]"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/photos/engagement/proposal-4.jpg"
          alt="Lyndsey and Andrew — the proposal"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Charcoal scrim — fades in as you scroll */}
      <motion.div
        className="absolute inset-0 bg-charcoal"
        style={{ opacity: overlayOpacity }}
      />

      {/* Vertical gradient — extra darkness behind the text band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/30"
      />

      <motion.div
        className="relative z-10 px-6 text-center"
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textShadow }}
          className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-cream sm:text-xs sm:tracking-[0.35em]"
        >
          How it all began
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-5 font-serif text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontWeight: 400, textShadow }}
        >
          Our Story
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          style={{ textShadow }}
          className="mt-4 max-w-md font-serif text-base italic text-cream sm:mt-6 sm:text-lg"
        >
          Every love story is beautiful, but ours is our favorite.
        </motion.p>
      </motion.div>
    </section>
  );
}
