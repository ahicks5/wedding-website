"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE, type MilestoneItem } from "./milestones";
import gallery from "@/lib/gallery.generated.json";

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

// ============================================
// Date math — convert milestone date strings into timestamps and percent
// positions on a single time axis from earliest -> latest milestone.
// ============================================

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function parseMilestoneDate(d: string): Date {
  // Handles "July 5, 2021", "August 2021", "May 2022".
  const tokens = d.replace(/,/g, "").split(/\s+/);
  const monthIdx = MONTH_NAMES.indexOf((tokens[0] || "").toLowerCase());
  const year = parseInt(tokens[tokens.length - 1] || "2025", 10);
  const day = tokens.length === 3 ? parseInt(tokens[1] || "15", 10) : 15;
  return new Date(year, monthIdx === -1 ? 0 : monthIdx, isNaN(day) ? 15 : day);
}

const MILESTONE_TICKS = MILESTONES.map((m) => ({
  ...m,
  ts: parseMilestoneDate(m.date).getTime(),
}));

const MIN_TS = MILESTONE_TICKS[0].ts;
const MAX_TS = MILESTONE_TICKS[MILESTONE_TICKS.length - 1].ts;
const SPAN = Math.max(1, MAX_TS - MIN_TS);

function pct(ts: number) {
  return ((ts - MIN_TS) / SPAN) * 100;
}

// One tick per month between the earliest and latest milestone.
const MONTH_TICKS: number[] = (() => {
  const out: number[] = [];
  const start = new Date(MIN_TS);
  let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor.getTime() <= MAX_TS) {
    out.push(cursor.getTime());
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return out;
})();

// Pixels of nav offset from the top of the viewport.
const NAV_HEIGHT = 64;
// Reserved height for the bar so the photo grid doesn't jump under it.
const BAR_HEIGHT = 116;

export default function HorizontalTimelineGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();

      const isPinned =
        rect.top <= NAV_HEIGHT && rect.bottom > NAV_HEIGHT + BAR_HEIGHT;
      setPinned(isPinned);

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

  const Bar = (
    <div className="border-b border-linen bg-cream/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        {/* Active milestone label */}
        <div className="mb-3 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gold sm:text-[11px]">
                {active.date}
              </p>
              <h3
                className="mt-0.5 font-serif text-sm leading-tight sm:text-base"
                style={{ color: "#2C2C2C", fontWeight: 600 }}
              >
                {active.title}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ruler */}
        <div className="relative h-7">
          {/* Baseline */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-px bg-linen"
          />

          {/* Monthly ticks — render first so milestones sit on top */}
          {MONTH_TICKS.map((ts) => (
            <div
              key={`mo-${ts}`}
              aria-hidden
              className="absolute bottom-0 w-px bg-warm-gray/35"
              style={{
                left: `${pct(ts)}%`,
                height: 6,
              }}
            />
          ))}

          {/* Milestone ticks */}
          {MILESTONE_TICKS.map((m, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <div
                key={m.id}
                title={`${m.date} — ${m.title}`}
                className="absolute bottom-0 -translate-x-1/2 transition-all duration-300 ease-out"
                style={{
                  left: `${pct(m.ts)}%`,
                  width: isActive ? 3 : 2,
                  height: isActive ? 26 : 14,
                  background: isActive
                    ? "#D4B85C"
                    : isPast
                      ? "#D4B85C"
                      : "rgba(212, 184, 92, 0.55)",
                  boxShadow: isActive
                    ? "0 0 10px rgba(212,184,92,0.55)"
                    : "none",
                  borderRadius: 1,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative bg-cream">
      {/* Inline copy — sits at the top of the section while it's still
          below the nav. Hidden once we pin. */}
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

      {/* Spacer reserves the bar's height so photos don't jump. */}
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
