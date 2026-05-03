"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Pixels of nav offset from the top of the viewport.
const NAV_HEIGHT = 64;
// Reserved space at the top of the section for the fixed bar to overlay.
const BAR_HEIGHT = 110;

export default function HorizontalTimelineGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Track scroll position relative to the section. We're not using
  // framer-motion's useScroll here because position:sticky was getting
  // killed upstream by overflow-x styling — running the math ourselves
  // and using position:fixed guarantees the bar pins as expected.
  useEffect(() => {
    const handleScroll = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();

      // Pin once the top of the section reaches the bottom of the nav.
      // Unpin again once the bottom of the section is above that line.
      const isPinned =
        rect.top <= NAV_HEIGHT && rect.bottom > NAV_HEIGHT + BAR_HEIGHT;
      setPinned(isPinned);

      // Distance scrolled past the section's pinning point.
      const scrolledPast = NAV_HEIGHT - rect.top;
      const scrollableHeight = rect.height - BAR_HEIGHT;
      const progress =
        scrollableHeight > 0
          ? Math.max(0, Math.min(0.999, scrolledPast / scrollableHeight))
          : 0;
      const idx = Math.min(
        MILESTONES.length - 1,
        Math.floor(progress * MILESTONES.length)
      );
      setActiveIdx(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const active = MILESTONES[activeIdx];
  const progressPct =
    MILESTONES.length > 1 ? (activeIdx / (MILESTONES.length - 1)) * 100 : 0;

  const Bar = (
    <div className="border-b border-linen bg-cream/95 backdrop-blur-md">
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
              <h3
                className="mt-1 font-serif text-base leading-tight sm:text-lg"
                style={{ color: "#2C2C2C", fontWeight: 600 }}
              >
                {active.title}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots track */}
        <div className="relative px-1">
          <div
            aria-hidden
            className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-linen"
          />
          <div
            aria-hidden
            className="absolute left-1 top-1/2 h-px -translate-y-1/2 bg-gold transition-all duration-500 ease-out"
            style={{
              width: `calc(${progressPct}% - 0.5rem * ${progressPct / 100})`,
            }}
          />
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
  );

  return (
    <section ref={sectionRef} className="relative bg-cream">
      {/* Inline copy of the bar — sits at the top of the section while
          you're still above it. Disappears once we pin the fixed copy
          so it doesn't double up. */}
      {!pinned && Bar}

      {/* Fixed copy — pins under the nav while the section is in view. */}
      {pinned && (
        <div
          className="fixed left-0 right-0 z-30"
          style={{ top: `${NAV_HEIGHT}px` }}
        >
          {Bar}
        </div>
      )}

      {/* Spacer so the photo grid starts below where the bar would be
          when pinned — keeps layout stable when we toggle. */}
      {pinned && <div style={{ height: `${BAR_HEIGHT}px` }} />}

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
