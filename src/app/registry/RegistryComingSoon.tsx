"use client";

import { Gift } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import FluffHero from "@/components/layout/FluffHero";

export default function RegistryComingSoon({
  fluffFile,
}: {
  fluffFile: string | null;
}) {
  return (
    <>
      <FluffHero
        file={fluffFile}
        eyebrow="Gifts & registry"
        title="Registry Coming Soon"
      />

      <section className="bg-ivory px-6 pb-24 pt-16 sm:pt-20">
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
