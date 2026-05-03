"use client";

import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";

interface Person {
  name: string;
  role: string;
  photo: string; // filename in /public/images/photos/wedding-party/
}

const BRIDESMAIDS: Person[] = [
  { name: "Chrislyn Herring", role: "Maid of Honor", photo: "chrislyn.png" },
  { name: "Kayla Sager", role: "Matron of Honor", photo: "kayla.png" },
  { name: "Rebecca Wright", role: "Bridesmaid", photo: "rebecca.jpg" },
  { name: "Bailey Cannon", role: "Bridesmaid", photo: "bailey.jpg" },
  { name: "Gabby Kendrick", role: "Bridesmaid", photo: "gabby.png" },
  { name: "Nicole Hicks", role: "Bridesmaid", photo: "nicole.jpg" },
  { name: "Abby Sager", role: "Bridesmaid", photo: "abby.png" },
];

const GROOMSMEN: Person[] = [
  { name: "Matthew Hicks", role: "Best Man", photo: "matthew.jpg" },
  { name: "Connor Sloan", role: "Groomsman", photo: "connor-sloan.png" },
  { name: "Patrick Hollander", role: "Groomsman", photo: "pat.png" },
  { name: "Jonathan Sager", role: "Groomsman", photo: "jonathan.jpg" },
  { name: "Connor Sager", role: "Groomsman", photo: "connor-sager.jpg" },
  { name: "Joe Calamore", role: "Groomsman", photo: "joe.png" },
  { name: "Zach Agcaoili", role: "Groomsman", photo: "zach.png" },
];

const RING_BEARERS: Person[] = [
  { name: "Nolan Marchand", role: "Ring Bearer", photo: "nolan.jpg" },
  { name: "Lincoln Keif", role: "Ring Bearer", photo: "lincoln.png" },
];

const FLOWER_GIRLS: Person[] = [
  { name: "Kenzie Steiner", role: "Flower Girl", photo: "kenzie.jpg" },
  { name: "Charley Keif", role: "Flower Girl", photo: "charley.jpg" },
];

const PHOTO_BASE = "/images/photos/wedding-party";

function PersonCard({
  person,
  delay,
  small,
}: {
  person: Person;
  delay: number;
  small?: boolean;
}) {
  return (
    <FadeIn delay={delay}>
      <div className="flex flex-col items-center overflow-hidden rounded-lg border border-linen bg-white shadow-soft">
        <div
          className={`relative w-full overflow-hidden bg-ivory ${
            small ? "h-44 sm:h-52" : "h-56 sm:h-64"
          }`}
        >
          <Image
            src={`${PHOTO_BASE}/${person.photo}`}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className={`text-center ${small ? "px-3 py-4" : "px-4 py-5"}`}>
          <h3
            className={`font-serif text-charcoal ${
              small ? "text-base" : "text-lg"
            }`}
          >
            {person.name}
          </h3>
          <p
            className={`mt-1 font-sans font-medium uppercase tracking-[0.15em] text-sage ${
              small ? "text-[11px]" : "text-xs"
            }`}
          >
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
              <PersonCard
                key={person.name}
                person={person}
                delay={i * 0.08}
                small
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
