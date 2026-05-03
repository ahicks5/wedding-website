"use client";

import {
  Coffee,
  Croissant,
  Utensils,
  Wine,
  Moon,
  Compass,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

type Place = { name: string; query: string };
type Section = {
  title: string;
  icon: LucideIcon;
  iconColor: "sage" | "gold";
  places: Place[];
};

const SECTIONS: Section[] = [
  {
    title: "Coffee",
    icon: Coffee,
    iconColor: "sage",
    places: [
      { name: "Summer Moon Coffee", query: "Summer Moon Coffee Austin TX" },
      { name: "Joe's Coffee on 2nd", query: "Joe's Coffee 2nd Street Austin TX" },
      { name: "Sorrento's Coffee", query: "Sorrento's Coffee Austin TX" },
      { name: "Desnudo Coffee", query: "Desnudo Coffee Austin TX" },
    ],
  },
  {
    title: "Breakfast",
    icon: Croissant,
    iconColor: "gold",
    places: [
      { name: "Rosen's Bagels", query: "Rosen's Bagels Austin TX" },
      { name: "Phoebe's", query: "Phoebe's Diner Austin TX" },
    ],
  },
  {
    title: "Lunch & Dinner",
    icon: Utensils,
    iconColor: "sage",
    places: [
      { name: "Cabo Bob's", query: "Cabo Bob's Austin TX" },
      { name: "Jewboy Burgers", query: "Jewboy Burgers Austin TX" },
      { name: "One Taco", query: "One Taco Austin TX" },
      { name: "Terry Black's BBQ", query: "Terry Black's Barbecue Austin TX" },
      { name: "Banger's", query: "Banger's Sausage House Austin TX" },
    ],
  },
  {
    title: "Drinks",
    icon: Wine,
    iconColor: "gold",
    places: [
      { name: "Upstairs at Caroline's", query: "Upstairs at Caroline's Austin TX" },
      { name: "The Roosevelt Room", query: "The Roosevelt Room Austin TX" },
      { name: "Arriba Abajo", query: "Arriba Abajo Austin TX downtown" },
      { name: "Cockfight", query: "Cockfight ATX Austin TX" },
      { name: "Zanzibar", query: "Zanzibar Austin TX" },
    ],
  },
  {
    title: "Late Night",
    icon: Moon,
    iconColor: "sage",
    places: [
      { name: "P. Terry's", query: "P. Terry's Burger Stand Austin TX" },
    ],
  },
  {
    title: "Outdoors",
    icon: Compass,
    iconColor: "gold",
    places: [
      { name: "Barton Springs Pool", query: "Barton Springs Pool Austin TX" },
      { name: "Congress Ave Bat Bridge", query: "Congress Avenue Bat Bridge Austin TX" },
      { name: "Rowing Dock (paddleboarding)", query: "Rowing Dock Austin TX" },
    ],
  },
];

const iconBg: Record<"sage" | "gold", string> = {
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/10 text-gold",
};

function mapHref(query: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

export default function ThingsToDoContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ivory pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              Our local tips
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Things to Do in Austin
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 font-serif text-lg italic text-charcoal-light">
              A handful of our favorite spots if you have time to wander.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Sections */}
      <section className="bg-ivory pb-24 pt-8">
        <div className="mx-auto max-w-5xl space-y-12 px-6 sm:space-y-16">
          {SECTIONS.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <FadeIn key={section.title} delay={sIdx * 0.05}>
                <div>
                  {/* Section header */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg[section.iconColor]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
                      {section.title}
                    </h2>
                  </div>

                  {/* Cards */}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {section.places.map((place) => (
                      <motion.a
                        key={place.name}
                        href={mapHref(place.query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.25 }}
                        className="group flex items-center justify-between rounded-lg border border-linen bg-white px-4 py-4 shadow-soft transition-shadow hover:shadow-medium sm:px-5"
                      >
                        <span className="font-serif text-base text-charcoal sm:text-lg">
                          {place.name}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-warm-gray transition-colors group-hover:text-sage" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </>
  );
}
