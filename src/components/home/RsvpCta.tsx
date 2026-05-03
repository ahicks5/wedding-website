"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import MagneticButton from "@/components/animations/MagneticButton";

export default function RsvpCta() {
  return (
    <section className="section-padding bg-sage">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-cream/80">
            We hope you can make it
          </p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl md:text-5xl">
            Will You Join Us?
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 font-serif text-lg italic leading-relaxed text-cream/80">
            Your presence would mean the world to us. Please let us know if
            you&apos;ll be celebrating with us by responding to our invitation.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <MagneticButton className="mt-10 inline-block">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/rsvp"
                className="btn-light"
              >
                RSVP Now
              </Link>
            </motion.div>
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
