"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { TIMELINE, type MilestoneItem } from "./milestones";
import gallery from "@/lib/gallery.generated.json";
import { cn } from "@/lib/utils";

const MILESTONES = TIMELINE.filter(
  (item): item is MilestoneItem => item.type === "milestone"
);

type GalleryEntry = {
  src: string;
  alt: string;
  date: string;
  source: string;
  width: number;
  height: number;
};

const PHOTOS = gallery as GalleryEntry[];

// Compact date label for the dot row (full date below the active dot is
// shown via the label up top; the dots themselves don't need text).
function shortDate(d: string) {
  const parts = d.replace(/,/g, "").split(/\s+/);
  // "August 2021" -> "Aug '21"; "July 5, 2021" -> "Jul '21"
  const monthAbbr = (parts[0] || "").slice(0, 3);
  const yearShort = `'${(parts[parts.length - 1] || "").slice(-2)}`;
  return `${monthAbbr} ${yearShort}`;
}

export default function HorizontalTimelineGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(0.999, latest));
    const idx = Math.floor(clamped * MILESTONES.length);
    setActiveIdx(Math.min(MILESTONES.length - 1, idx));
  });

  const active = MILESTONES[activeIdx];
  const progressPct =
    MILESTONES.length > 1 ? (activeIdx / (MILESTONES.length - 1)) * 100 : 0;

  return (
    <section ref={sectionRef} className="bg-cream">
      {/* Sticky horizontal timeline */}
      <div className="sticky top-16 z-30 border-b border-linen bg-cream/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
          {/* Active milestone label */}
          <div className="mb-3 text-center sm:mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gold sm:text-[11px]">
                  {active.date}
                </p>
                <h3 className="mt-1 font-serif text-base leading-tight text-charcoal sm:text-lg">
                  {active.title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots track */}
          <div className="relative px-1">
            {/* Background line */}
            <div
              aria-hidden
              className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-linen"
            />
            {/* Filled progress line */}
            <div
              aria-hidden
              className="absolute left-1 top-1/2 h-px -translate-y-1/2 bg-gold transition-all duration-500 ease-out"
              style={{ width: `calc(${progressPct}% - 0.5rem * ${progressPct / 100})` }}
            />
            {/* Dots */}
            <div className="relative flex items-center justify-between">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.id}
                  title={`${m.date} — ${m.title}`}
                  className={cn(
                    "rounded-full transition-all duration-300 ease-out",
                    i === activeIdx
                      ? "h-3 w-3 bg-gold shadow-[0_0_0_4px_rgba(212,184,92,0.25)]"
                      : i < activeIdx
                        ? "h-2 w-2 bg-gold"
                        : "h-2 w-2 border border-warm-gray/40 bg-cream"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Photo gallery — vertical scroll */}
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <div className="space-y-5 sm:space-y-7">
          {PHOTOS.map((photo, i) => (
            <div
              key={photo.src}
              className="overflow-hidden rounded-md bg-ivory shadow-medium"
            >
              <Image
                src={`/images/photos/${photo.src}`}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="h-auto w-full"
                sizes="(max-width: 768px) 100vw, 640px"
                priority={i < 2}
                loading={i < 2 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
