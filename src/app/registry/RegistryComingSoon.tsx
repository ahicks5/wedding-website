"use client";

import { Gift } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function RegistryComingSoon() {
  return (
    <>
      <section className="bg-ivory pb-8 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              Gifts &amp; registry
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Registry Coming Soon
            </h1>
            <div className="divider-gold" />
          </FadeIn>
        </div>
      </section>

      <section className="bg-ivory px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0.15}>
            <div className="rounded-lg border border-linen bg-white p-8 text-center shadow-soft sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <Gift className="h-6 w-6 text-gold" />
              </div>

              <h2 className="mt-6 font-serif text-2xl text-charcoal sm:text-3xl">
                Your presence is our greatest gift
              </h2>

              <p className="mt-4 font-serif text-base italic leading-relaxed text-charcoal-light sm:text-lg">
                We&apos;re still putting our registry together. Once we have
                the links ready, they&apos;ll live right here. Until then,
                please save the date — that&apos;s all we need.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
