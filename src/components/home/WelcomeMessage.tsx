"use client";

import FadeIn from "@/components/animations/FadeIn";

export default function WelcomeMessage() {
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
            Welcome
          </p>
          <h2 className="mt-3 font-serif text-3xl text-charcoal sm:text-4xl">
            We&apos;re Getting Married!
          </h2>
          <div className="divider-gold" />
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 font-serif text-lg leading-relaxed text-charcoal-light sm:text-xl">
            We are so thrilled for the next step in our lives and are so grateful
            you can join us. Browse the site for everything from accommodations to
            travel details, and don&apos;t forget to RSVP!
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="mt-10 font-serif text-xl italic text-sage">
            With all our love,
          </p>
          <p className="mt-2 font-serif text-2xl text-charcoal">
            Lyndsey &amp; Andrew
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
