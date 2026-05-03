"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxBreakProps {
  image: string;
  alt: string;
  quote: string;
  attribution: string;
}

export default function ParallaxBreak({
  image,
  alt,
  quote,
  attribution,
}: ParallaxBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative my-4 h-[40vh] overflow-hidden sm:my-8 sm:h-[50vh] md:h-[60vh]"
    >
      <motion.div className="absolute inset-[-10%]" style={{ y: imageY }}>
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-charcoal/30" />

      <div className="relative z-10 flex h-full items-center justify-center px-6 sm:px-8">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center"
        >
          <p className="font-serif text-xl italic leading-relaxed text-white sm:text-2xl md:text-3xl">
            &ldquo;{quote}&rdquo;
          </p>
          <cite className="mt-3 block font-sans text-[10px] uppercase tracking-[0.25em] text-cream sm:mt-4 sm:text-xs">
            — {attribution}
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
