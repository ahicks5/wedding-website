"use client";

import { motion } from "framer-motion";
import { Gift, Heart, ExternalLink, Palmtree } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

// TODO: Replace # with real registry URLs
const REGISTRIES = [
  {
    name: "Amazon Wedding Registry",
    description:
      "Browse our curated list of home essentials, kitchen upgrades, and things to help us build our life together.",
    icon: Gift,
    url: "#",
    color: "sage" as const,
  },
  {
    name: "Zola Registry",
    description:
      "Our main registry with a mix of experiences, household items, and group gifts to contribute toward.",
    icon: Heart,
    url: "#",
    color: "gold" as const,
  },
  {
    name: "Honeymoon Fund",
    description:
      "Help us create unforgettable memories on our honeymoon! Any contribution toward our trip means the world to us.",
    icon: Palmtree,
    url: "#",
    color: "sage" as const,
  },
];

const iconColorMap = {
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/10 text-gold",
};

export default function RegistryContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ivory pb-8 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              Gifts &amp; registry
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Your Presence Is Our Greatest Gift
            </h1>
            <div className="divider-gold" />
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 font-serif text-lg leading-relaxed text-charcoal-light">
              Celebrating with you is truly all we need. However, if you&apos;d
              like to honor us with a gift, we&apos;ve registered at a few
              places below. We&apos;re grateful for your generosity and
              thoughtfulness.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Registry Cards */}
      <section className="bg-ivory pb-20 pt-8 sm:pb-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {REGISTRIES.map((registry, i) => {
              const Icon = registry.icon;
              return (
                <FadeIn key={registry.name} delay={i * 0.12}>
                  <motion.a
                    href={registry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col items-center rounded-lg border border-linen bg-white p-6 text-center shadow-soft transition-shadow hover:shadow-medium sm:p-8"
                  >
                    {/* Icon */}
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

                    <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.15em] text-sage transition-colors group-hover:text-gold">
                      View Registry
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </motion.a>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
