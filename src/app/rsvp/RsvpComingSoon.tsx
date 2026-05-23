"use client";

import { Mail, Sparkles } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { WEDDING } from "@/lib/constants";
import FluffHero from "@/components/layout/FluffHero";

export default function RsvpComingSoon({
  fluffFile,
}: {
  fluffFile: string | null;
}) {
  return (
    <>
      <FluffHero
        file={fluffFile}
        eyebrow="Save the date"
        title="RSVP Coming Soon"
      />

      <section className="bg-ivory px-6 pb-24 pt-16 sm:pt-20">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0.15}>
            <div className="rounded-lg border border-linen bg-white p-8 text-center shadow-soft sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>

              <h2 className="mt-6 font-serif text-2xl text-charcoal sm:text-3xl">
                We&apos;re putting on the finishing touches
              </h2>

              <p className="mt-4 font-serif text-base italic leading-relaxed text-charcoal-light sm:text-lg">
                Formal invitations will arrive in the mail, and our online RSVP
                form will open right around the same time. Until then, please
                hold the date — we can&apos;t wait to celebrate with you.
              </p>

              <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5">
                <Mail className="h-4 w-4 text-sage" />
                <span className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-charcoal">
                  Watch your mailbox
                </span>
              </div>

              <div className="mt-10 border-t border-linen pt-6">
                <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-warm-gray">
                  {WEDDING.dayOfWeek}
                </p>
                <p className="mt-2 font-serif text-2xl text-charcoal">
                  {WEDDING.dateDisplay}
                </p>
                <p className="mt-1 font-serif text-sm italic text-warm-gray">
                  Austin, Texas
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
