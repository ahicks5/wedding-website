"use client";

import FadeIn from "@/components/animations/FadeIn";
import RsvpForm from "@/components/rsvp/RsvpForm";
import FluffHero from "@/components/layout/FluffHero";

export default function RsvpContent({
  fluffFile,
}: {
  fluffFile: string | null;
}) {
  return (
    <>
      <FluffHero
        file={fluffFile}
        eyebrow="We'd love to celebrate with you"
        title="RSVP"
      />

      <section className="bg-ivory px-6 pb-24 pt-16 sm:pt-20">
        <FadeIn delay={0.15}>
          <RsvpForm />
        </FadeIn>
      </section>
    </>
  );
}
