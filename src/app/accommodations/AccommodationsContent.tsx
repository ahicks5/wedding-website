"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Plane,
  Car,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const HOTELS = [
  {
    name: "Austin Marriott Downtown",
    description:
      "Reliable brand with a great downtown location. Modern rooms, rooftop pool, and walking distance to restaurants and nightlife.",
    driveToElla: "~8 min to Hotel Ella",
    driveToChurch: "~18 min to SJN Church",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    url: "https://www.marriott.com/en-us/hotels/ausdt-austin-marriott-downtown/",
  },
  {
    name: "Hyatt Regency Austin",
    description:
      "Beautiful Lady Bird Lake views right on Congress Avenue. Great pool and easy access to the hike-and-bike trail.",
    driveToElla: "~12 min to Hotel Ella",
    driveToChurch: "~20 min to SJN Church",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    url: "https://www.hyatt.com/hyatt-regency/en-US/ausra-hyatt-regency-austin",
  },
  {
    name: "Hilton Austin",
    description:
      "Downtown convention district location with spacious rooms, a rooftop pool, and convenient access to 6th Street entertainment.",
    driveToElla: "~10 min to Hotel Ella",
    driveToChurch: "~20 min to SJN Church",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    url: "https://www.hilton.com/en/hotels/auscvhh-hilton-austin/",
  },
  {
    name: "Fairmont Austin",
    description:
      "Modern luxury with stunning Lady Bird Lake views. Exceptional pool deck, spa, and walkable to Congress Avenue.",
    driveToElla: "~12 min to Hotel Ella",
    driveToChurch: "~22 min to SJN Church",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    url: "https://www.fairmont.com/austin/",
  },
  {
    name: "The Driskill Hotel",
    description:
      "A legendary Austin landmark on 6th Street. Historic luxury with modern amenities, right in the heart of downtown.",
    driveToElla: "~10 min to Hotel Ella",
    driveToChurch: "~20 min to SJN Church",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    url: "https://www.hyatt.com/en-US/hotel/texas/the-driskill/drial",
  },
];

export default function AccommodationsContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ivory pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              Your travel guide
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Getting There &amp; Staying
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 font-serif text-lg italic text-charcoal-light">
              Everything you need to plan your trip to Austin — from flights to
              favorite spots.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Section 1: Flights */}
      <section className="bg-ivory pb-8 pt-8 sm:pb-12">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <div className="rounded-lg border border-linen bg-white p-8 shadow-soft sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10">
                  <Plane className="h-5 w-5 text-sage" />
                </div>
                <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
                  Flights
                </h2>
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal-light sm:text-base">
                Fly into <strong>Austin-Bergstrom International Airport (AUS)</strong>,
                located about 15 minutes from downtown Austin and approximately
                25 minutes from St. John Neumann Church. Most major airlines
                offer direct flights. We recommend booking early for the best
                rates — August is a popular travel month!
              </p>
              <a
                href="https://www.google.com/travel/flights?q=flights+to+AUS"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-sage-dark"
              >
                <Plane className="h-3.5 w-3.5" />
                Browse Flights
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 2: Getting from the Airport */}
      <section className="bg-ivory pb-12 pt-4 sm:pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <div className="rounded-lg border border-linen bg-white p-8 shadow-soft sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10">
                  <Car className="h-5 w-5 text-sage" />
                </div>
                <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
                  Getting from the Airport
                </h2>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Uber/Lyft */}
                <div className="rounded-lg border border-linen bg-ivory/50 p-6">
                  <h3 className="font-serif text-lg text-charcoal">
                    Uber &amp; Lyft
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-charcoal-light">
                    The easiest way to get around Austin. Expect <strong>$20–30</strong> to
                    downtown, about a <strong>15–20 minute</strong> ride.
                  </p>
                  <div className="mt-3 rounded-md bg-sage/5 p-3">
                    <p className="font-sans text-xs leading-relaxed text-charcoal-light">
                      <strong className="text-sage">Tip:</strong> The rideshare
                      pickup at AUS is on the second floor of the garage across
                      from the terminal — follow the signs for &ldquo;Rideshare
                      Pickup&rdquo; after exiting baggage claim.
                    </p>
                  </div>
                </div>

                {/* Rental Cars */}
                <div className="rounded-lg border border-linen bg-ivory/50 p-6">
                  <h3 className="font-serif text-lg text-charcoal">
                    Rental Cars
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-charcoal-light">
                    Available on the arrival level across from the terminal. All
                    major rental car companies are accessible without a shuttle.
                  </p>
                  <p className="mt-3 font-sans text-sm text-charcoal-light">
                    <strong>Major companies:</strong> Hertz, Enterprise, National,
                    Avis, Budget
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-sage" />
                    <span className="font-sans text-xs text-warm-gray">
                      Great if you want to explore Austin on your own
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 3: Where to Stay */}
      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="text-center">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
                Recommended hotels
              </p>
              <h2 className="mt-3 font-serif text-3xl text-charcoal sm:text-4xl">
                Where to Stay
              </h2>
              <div className="divider-gold" />
              <p className="mt-4 font-serif text-lg italic text-charcoal-light">
                We recommend staying downtown — all of these hotels are a short
                drive from both venues.
              </p>
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {HOTELS.map((hotel, i) => (
              <FadeIn key={hotel.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-linen bg-white shadow-soft transition-shadow hover:shadow-medium"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden sm:h-48">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl text-charcoal">
                        {hotel.name}
                      </h3>
                      <span className="shrink-0 font-sans text-xs font-medium text-gold">
                        {hotel.priceRange}
                      </span>
                    </div>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-charcoal-light">
                      {hotel.description}
                    </p>

                    {/* Distance badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-2.5 py-1 font-sans text-[10px] text-charcoal-light">
                        <MapPin className="h-2.5 w-2.5 text-sage" />
                        {hotel.driveToElla}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-2.5 py-1 font-sans text-[10px] text-charcoal-light">
                        <MapPin className="h-2.5 w-2.5 text-gold" />
                        {hotel.driveToChurch}
                      </span>
                    </div>

                    <a
                      href={hotel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-5 inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.15em] text-sage transition-colors hover:text-gold"
                    >
                      View Hotel
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-10 text-center">
              <a
                href="https://www.google.com/travel/hotels/Austin%20TX?q=hotels+in+austin+tx"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                Explore More Hotels
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 4: Our Favorite Spots (Placeholder) */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
              <h2 className="mt-4 font-serif text-3xl text-charcoal sm:text-4xl">
                Our Favorite Austin Spots
              </h2>
              <div className="divider-gold" />
              <p className="mt-4 font-serif text-lg italic text-charcoal-light">
                Coming soon — we&apos;ll share our favorite restaurants, bars,
                and things to do!
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="bg-ivory py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
                Key Locations
              </h2>
              <div className="divider-gold" />
            </div>
          </FadeIn>

          {/* Map Legend */}
          <FadeIn delay={0.1}>
            <div className="mt-6 flex flex-col items-center gap-3 text-center sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">1</span>
                <span className="font-sans text-xs text-charcoal sm:text-sm">Austin-Bergstrom Airport (AUS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">2</span>
                <span className="font-sans text-xs text-charcoal sm:text-sm">St. John Neumann Catholic Church</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">3</span>
                <span className="font-sans text-xs text-charcoal sm:text-sm">Hotel Ella</span>
              </div>
            </div>
          </FadeIn>

          {/* Embedded Google Maps */}
          <FadeIn delay={0.2}>
            <div className="mt-6 overflow-hidden rounded-lg border border-linen shadow-soft">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d110559!2d-97.82!3d30.31!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sst+john+neumann+catholic+church+austin+tx+%7C+hotel+ella+austin+tx+%7C+austin+bergstrom+airport!5e0!3m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding venue locations in Austin, TX"
                className="w-full"
              />
            </div>
            <p className="mt-3 text-center font-sans text-xs text-warm-gray">
              All three locations are within 25 minutes of each other. Click the cards below for turn-by-turn directions.
            </p>
          </FadeIn>

          {/* Quick direction cards */}
          <FadeIn delay={0.3}>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <a
                href="https://maps.google.com/?q=Austin-Bergstrom+International+Airport"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-linen bg-white p-4 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">1</span>
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal group-hover:text-sage transition-colors">Austin Airport (AUS)</p>
                  <p className="font-sans text-xs text-warm-gray">Get Directions</p>
                </div>
                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-warm-gray group-hover:text-sage transition-colors" />
              </a>

              <a
                href="https://maps.google.com/?q=St+John+Neumann+Catholic+Church+Austin+TX"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-linen bg-white p-4 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">2</span>
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal group-hover:text-gold transition-colors">Ceremony</p>
                  <p className="font-sans text-xs text-warm-gray">Get Directions</p>
                </div>
                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-warm-gray group-hover:text-gold transition-colors" />
              </a>

              <a
                href="https://maps.google.com/?q=Hotel+Ella+Austin+TX"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-linen bg-white p-4 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">3</span>
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal group-hover:text-sage transition-colors">Hotel Ella</p>
                  <p className="font-sans text-xs text-warm-gray">Get Directions</p>
                </div>
                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-warm-gray group-hover:text-sage transition-colors" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
