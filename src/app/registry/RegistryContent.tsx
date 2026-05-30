"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Sofa,
  Palmtree,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import FluffHero from "@/components/layout/FluffHero";

type Registry = {
  name: string;
  description: string;
  icon: LucideIcon;
  url: string | null;
  color: "sage" | "gold";
  comingSoon?: boolean;
};

const REGISTRIES: Registry[] = [
  {
    name: "Crate & Barrel",
    description:
      "Home essentials, kitchen pieces, and the things we'll use every day in our first place together.",
    icon: Sofa,
    url: "https://www.crateandbarrel.com/gift-registry/lyndsey-sager-and-andrew-hicks/r7546104",
    color: "gold",
  },
  {
    name: "Amazon",
    description:
      "A curated mix of practical favorites — small upgrades, everyday must-haves, and a few fun finds.",
    icon: Gift,
    url: "https://www.amazon.com/wedding/guest-view/3EIOIRQPQLMQI",
    color: "sage",
  },
  {
    name: "Honeymoon Fund",
    description:
      "We're putting together a way for friends to help us celebrate on our honeymoon — details to follow.",
    icon: Palmtree,
    url: null,
    color: "sage",
    comingSoon: true,
  },
];

const iconColorMap = {
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/10 text-gold",
};

export default function RegistryContent() {
  return (
    <>
      <FluffHero
        eyebrow="Gifts & registry"
        title="Your Presence Is Our Greatest Gift"
        subtitle="Celebrating with you is truly all we need. If you'd like to honor us with a gift, we've registered at a few places below."
      />

      {/* Registry Cards */}
      <section className="bg-ivory pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {REGISTRIES.map((registry, i) => {
              const Icon = registry.icon;
              const isComingSoon = registry.comingSoon;

              const cardClasses = `flex h-full flex-col items-center rounded-lg border border-linen bg-white p-6 text-center shadow-soft sm:p-8 ${
                isComingSoon ? "opacity-80" : "group transition-shadow hover:shadow-medium"
              }`;

              const body = (
                <>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${iconColorMap[registry.color]}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 font-serif text-xl text-charcoal">
                    {registry.name}
                  </h3>

                  <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal-light">
                    {registry.description}
                  </p>

                  {isComingSoon ? (
                    <span className="mt-auto pt-6 inline-flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-gray">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="mt-auto pt-6 inline-flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.15em] text-sage transition-colors group-hover:text-gold">
                      View Registry
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </>
              );

              return (
                <FadeIn key={registry.name} delay={i * 0.12}>
                  {isComingSoon || !registry.url ? (
                    <div className={cardClasses}>{body}</div>
                  ) : (
                    <motion.a
                      href={registry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                      className={cardClasses}
                    >
                      {body}
                    </motion.a>
                  )}
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
