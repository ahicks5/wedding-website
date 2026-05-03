"use client";

import FadeIn from "@/components/animations/FadeIn";
import RsvpForm from "@/components/rsvp/RsvpForm";

export default function RsvpContent() {
  return (
    <>
      <section className="bg-ivory pb-8 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              We&apos;d love to celebrate with you
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              RSVP
            </h1>
            <div className="divider-gold" />
          </FadeIn>
        </div>
      </section>

      <section className="bg-ivory px-6 pb-24">
        <FadeIn delay={0.15}>
          <RsvpForm />
        </FadeIn>
      </section>
    </>
  );
}
