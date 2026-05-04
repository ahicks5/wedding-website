"use client";

import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import FluffHero from "@/components/layout/FluffHero";

interface Person {
  name: string;
  role: string;
  /** how this person is connected to the couple (e.g. "College friend") */
  relation?: string;
  photo: string; // filename in /public/images/photos/wedding-party/
}

const BRIDESMAIDS: Person[] = [
  { name: "Chrislyn Herring", role: "Maid of Honor", relation: "Best friend", photo: "chrislyn.png" },
  { name: "Kayla Sager", role: "Matron of Honor", relation: "Sister-in-law of the bride", photo: "kayla.png" },
  { name: "Rebecca Wright", role: "Bridesmaid", relation: "Childhood friend", photo: "rebecca.jpg" },
  { name: "Bailey Cannon", role: "Bridesmaid", relation: "High school friend", photo: "bailey.jpg" },
  { name: "Gabby Kendrick", role: "Bridesmaid", relation: "College friend", photo: "gabby.png" },
  { name: "Nicole Hicks", role: "Bridesmaid", relation: "Sister of the groom", photo: "nicole.jpg" },
  { name: "Abby Sager", role: "Bridesmaid", relation: "Sister-in-law of the bride", photo: "abby.png" },
];

const GROOMSMEN: Person[] = [
  { name: "Matthew Hicks", role: "Best Man", relation: "Brother of the groom", photo: "matthew.jpg" },
  { name: "Connor Sloan", role: "Groomsman", relation: "College friend", photo: "connor-sloan.png" },
  { name: "Patrick Hollander", role: "Groomsman", relation: "College friend", photo: "pat.png" },
  { name: "Jonathan Sager", role: "Groomsman", relation: "Brother of the bride", photo: "jonathan.jpg" },
  { name: "Connor Sager", role: "Groomsman", relation: "Brother of the bride", photo: "connor-sager.jpg" },
  { name: "Joe Calamore", role: "Groomsman", relation: "High school friend", photo: "joe.png" },
  { name: "Zach Agcaoili", role: "Groomsman", relation: "High school friend", photo: "zach.png" },
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
        <div className={`text-center ${small ? "px-2 py-4" : "px-4 py-5"}`}>
          <h3
            className={`font-serif leading-tight text-charcoal ${
              small ? "text-sm sm:text-base" : "text-lg"
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
          {person.relation && (
            <p
              className={`mt-1 font-serif italic text-warm-gray ${
                small ? "text-xs" : "text-sm"
              }`}
            >
              {person.relation}
            </p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function WeddingPartyContent() {
  return (
    <>
      <FluffHero
        eyebrow="The people by our side"
        title="Meet the Wedding Party"
        subtitle="The incredible friends and family who will be standing with us on our big day."
      />

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

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            {BRIDESMAIDS.map((person, i) => (
              <div
                key={person.name}
                className="w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.834rem)] lg:w-[calc(25%-0.9375rem)] lg:max-w-[16rem]"
              >
                <PersonCard person={person} delay={i * 0.06} />
              </div>
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

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            {GROOMSMEN.map((person, i) => (
              <div
                key={person.name}
                className="w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.834rem)] lg:w-[calc(25%-0.9375rem)] lg:max-w-[16rem]"
              >
                <PersonCard person={person} delay={i * 0.06} />
              </div>
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
