"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import FadeIn from "@/components/animations/FadeIn";
import FLUFF from "@/lib/fluff.generated.json";

const FLUFF_FILES = FLUFF as string[];

const TEXT_SHADOW =
  "0 2px 18px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.9)";

interface FluffHeroProps {
  /** Top eyebrow line — small uppercase tracker. */
  eyebrow: string;
  /** Page title. */
  title: string;
  /** Optional italic subtitle below the divider. */
  subtitle?: ReactNode;
  /**
   * Server-picked fluff filename. When provided (which is the normal
   * path — see `pickRandomFluff()` in `lib/fluff.ts`), the image src
   * lands in the SSR HTML so the browser starts the request during
   * initial parse instead of waiting for hydration. Left optional so
   * legacy callsites and tests still work without it.
   */
  file?: string | null;
}

/**
 * Reusable hero used by every page that doesn't have its own bespoke
 * hero (i.e. everything except the home page and Our Story). Shows a
 * random image from public/images/photos/fluff/ — picked on the
 * server so each visit gets fresh artwork without the hydration hitch.
 *
 * The section ships with a charcoal background so the hero looks
 * "complete" on first paint — the image then fades in once it decodes,
 * instead of users seeing a blank gap then a sudden pop.
 *
 * Forces white text via inline styles + heavy text-shadow so it reads
 * cleanly on any photo behind it.
 */
export default function FluffHero({
  eyebrow,
  title,
  subtitle,
  file: fileProp,
}: FluffHeroProps) {
  // Fallback for callsites that haven't been migrated to pass `file`:
  // pick on the client after mount (the old behavior, with its tell-tale
  // hitch). When `fileProp` is provided we skip this entirely.
  const [clientFile, setClientFile] = useState<string | null>(null);
  useEffect(() => {
    if (fileProp !== undefined) return;
    if (FLUFF_FILES.length === 0) return;
    setClientFile(FLUFF_FILES[Math.floor(Math.random() * FLUFF_FILES.length)]);
  }, [fileProp]);

  const file = fileProp !== undefined ? fileProp : clientFile;

  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-charcoal pt-24 sm:min-h-[60vh] sm:pt-28">
      {/* Background image — fades in once it's actually decoded so the
          dark section is fully styled from the very first paint. When
          `file` comes from the server, the <img> renders in the SSR
          HTML and the browser kicks off the request immediately. */}
      {file && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={`/images/photos/fluff/${file}`}
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
            onLoad={() => setLoaded(true)}
          />
        </div>
      )}

      {/* Lighter scrim — keeps text readable without dimming photos too much. */}
      <div aria-hidden className="absolute inset-0 bg-charcoal/40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/25"
      />

      <div className="relative z-10 px-6 py-10 text-center sm:py-14">
        <FadeIn>
          <p
            className="font-sans text-[10px] uppercase tracking-[0.3em] sm:text-xs sm:tracking-[0.35em]"
            style={{ color: "#FFFFFF", textShadow: TEXT_SHADOW, fontWeight: 600 }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl"
            style={{
              color: "#FFFFFF",
              fontWeight: 700,
              textShadow: TEXT_SHADOW,
              WebkitTextStroke: "0.5px #FFFFFF",
            }}
          >
            {title}
          </h1>
          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
          {subtitle && (
            <p
              className="mx-auto mt-5 max-w-xl font-serif text-base italic sm:text-lg"
              style={{ color: "#FFFFFF", textShadow: TEXT_SHADOW, fontWeight: 500 }}
            >
              {subtitle}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
