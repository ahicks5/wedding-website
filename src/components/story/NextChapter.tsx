"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import MagneticButton from "@/components/animations/MagneticButton";
import { WEDDING } from "@/lib/constants";

export default function NextChapter() {
  return (
    <section className="section-padding bg-ivory">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold">
            And now
          </p>
          <h2 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
            The Next Chapter
          </h2>
          <div className="divider-gold" />
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 font-serif text-lg italic leading-relaxed text-charcoal-light sm:text-xl">
            From that very first moment to this one, every step has led us here.
            And on {WEDDING.dateDisplay}, we&apos;ll take the most important step
            of all — surrounded by the people we love most.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="mt-6 font-serif text-lg text-charcoal-light">
            We can&apos;t wait to celebrate with you.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <MagneticButton>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/rsvp" className="btn-primary">
                  RSVP Now
                </Link>
              </motion.div>
            </MagneticButton>
            <motion.div whileHover={{ x: 4 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.15em] text-sage transition-colors hover:text-gold"
              >
                View Wedding Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
