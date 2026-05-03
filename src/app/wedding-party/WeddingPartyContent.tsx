"use client";

import { User } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

interface Person {
  name: string;
  role: string;
}

const BRIDESMAIDS: Person[] = [
  { name: "Chrislyn Herring", role: "Maid of Honor" },
  { name: "Kayla Sager", role: "Matron of Honor" },
  { name: "Rebecca Wright", role: "Bridesmaid" },
  { name: "Bailey Cannon", role: "Bridesmaid" },
  { name: "Gabby Kendrick", role: "Bridesmaid" },
  { name: "Nicole Hicks", role: "Bridesmaid" },
  { name: "Abby Sager", role: "Bridesmaid" },
];

const GROOMSMEN: Person[] = [
  { name: "Matthew Hicks", role: "Best Man" },
  { name: "Connor Sloan", role: "Groomsman" },
  { name: "Patrick Hollander", role: "Groomsman" },
  { name: "Jonathan Sager", role: "Groomsman" },
  { name: "Connor Sager", role: "Groomsman" },
  { name: "Joe Calamore", role: "Groomsman" },
  { name: "Zach Agcaoili", role: "Groomsman" },
];

const RING_BEARERS: Person[] = [
  { name: "Nolan Marchand", role: "Ring Bearer" },
  { name: "Lincoln Keif", role: "Ring Bearer" },
];

const FLOWER_GIRLS: Person[] = [
  { name: "Kenzie Steiner", role: "Flower Girl" },
  { name: "Charley Keif", role: "Flower Girl" },
];

function PersonCard({ person, delay }: { person: Person; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex flex-col items-center overflow-hidden rounded-lg border border-linen bg-white shadow-soft">
        {/* Photo placeholder */}
        <div className="flex h-48 w-full items-center justify-center bg-ivory sm:h-56">
          <User className="h-16 w-16 text-linen" />
        </div>
        {/* Info */}
        <div className="px-4 py-5 text-center">
          <h3 className="font-serif text-lg text-charcoal">{person.name}</h3>
          <p className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.15em] text-sage">
            {person.role}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

function SmallPersonCard({ person, delay }: { person: Person; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex flex-col items-center overflow-hidden rounded-lg border border-linen bg-white shadow-soft">
        <div className="flex h-36 w-full items-center justify-center bg-ivory sm:h-44">
          <User className="h-12 w-12 text-linen" />
        </div>
        <div className="px-4 py-4 text-center">
          <h3 className="font-serif text-base text-charcoal">{person.name}</h3>
          <p className="mt-1 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-sage">
            {person.role}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

export default function WeddingPartyContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ivory pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              The people by our side
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Meet the Wedding Party
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 font-serif text-lg italic text-charcoal-light">
              The incredible friends and family who will be standing with us on
              our big day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Bridesmaids */}
      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
                Bridesmaids
              </h2>
              <div className="divider-gold" />
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {BRIDESMAIDS.map((person, i) => (
              <PersonCard key={person.name} person={person} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* Groomsmen */}
      <section className="section-padding bg-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
                Groomsmen
              </h2>
              <div className="divider-gold" />
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {GROOMSMEN.map((person, i) => (
              <PersonCard key={person.name} person={person} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* Ring Bearers & Flower Girls */}
      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
                Ring Bearers &amp; Flower Girls
              </h2>
              <div className="divider-gold" />
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[...RING_BEARERS, ...FLOWER_GIRLS].map((person, i) => (
              <SmallPersonCard
                key={person.name}
                person={person}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
