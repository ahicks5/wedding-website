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
// Date math
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
  const tokens = d.replace(/,/g, "").split(/\s+/);
  const monthIdx = MONTH_NAMES.indexOf((tokens[0] || "").toLowerCase());
  const year = parseInt(tokens[tokens.length - 1] || "2025", 10);
  const day = tokens.length === 3 ? parseInt(tokens[1] || "15", 10) : 15;
  return new Date(year, monthIdx === -1 ? 0 : monthIdx, isNaN(day) ? 15 : day);
}

function abbrevMonth(d: string): string {
  const t = d.replace(/,/g, "").split(/\s+/)[0] || "";
  return t.slice(0, 3);
}

function shortYear(d: string): string {
  const tokens = d.replace(/,/g, "").split(/\s+/);
  const y = tokens[tokens.length - 1] || "";
  return `'${y.slice(-2)}`;
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

// One tick per month between earliest and latest milestone.
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

const NAV_HEIGHT = 64;
const BAR_HEIGHT = 116;

// Dusty blue (sage-light from the palette)
const PLAYHEAD_COLOR = "#A3BDD1";

export default function HorizontalTimelineGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [playheadPct, setPlayheadPct] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const milestonePcts = MILESTONE_TICKS.map((m) => pct(m.ts));

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
          ? Math.max(0, Math.min(1, scrolledPast / scrollableHeight))
          : 0;

      const newPct = progress * 100;
      setPlayheadPct(newPct);

      // Active = milestone whose tick is closest to the playhead.
      let best = 0;
      let bestDist = Math.abs(milestonePcts[0] - newPct);
      for (let i = 1; i < milestonePcts.length; i++) {
        const d = Math.abs(milestonePcts[i] - newPct);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      setActiveIdx(best);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const active = MILESTONES[activeIdx];

  const Bar = (
    <div className="border-b border-linen bg-cream/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
        {/* Crossfade container — fixed min-height so the absolutely
            positioned old/new copies overlay cleanly during transition */}
        <div className="relative min-h-[44px] sm:min-h-[48px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 flex items-center gap-3"
            >
              {/* Left — stacked Mon / 'YY */}
              <div className="flex w-14 shrink-0 flex-col items-start font-serif leading-none">
                <span
                  className="text-lg sm:text-xl"
                  style={{ color: "#2C2C2C", fontWeight: 500 }}
                >
                  {abbrevMonth(active.date)}
                </span>
                <span
                  className="mt-0.5 font-serif text-base italic text-warm-gray sm:text-lg"
                  style={{ fontWeight: 500 }}
                >
                  {shortYear(active.date)}
                </span>
              </div>

              {/* Center — title + blurb (truncated to 1 line on mobile) */}
              <div className="min-w-0 flex-1 text-center">
                <h3
                  className="truncate font-serif text-sm leading-tight sm:overflow-visible sm:whitespace-normal sm:text-base"
                  style={{ color: "#2C2C2C", fontWeight: 600 }}
                >
                  {active.title}
                </h3>
                <p className="mt-0.5 font-serif text-[11px] italic leading-tight text-warm-gray sm:text-xs">
                  {active.description}
                </p>
              </div>

              {/* Right spacer for true center */}
              <div className="w-14 shrink-0" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ruler — tight gap above */}
        <div className="relative mt-2 h-7">
          {/* Baseline */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-px bg-linen"
          />

          {/* Monthly ticks */}
          {MONTH_TICKS.map((ts) => (
            <div
              key={`mo-${ts}`}
              aria-hidden
              className="absolute bottom-0 w-px bg-warm-gray/30"
              style={{ left: `${pct(ts)}%`, height: 6 }}
            />
          ))}

          {/* Milestone ticks — uniform; opacity dims for upcoming */}
          {MILESTONE_TICKS.map((m, i) => {
            const isPast = i <= activeIdx;
            return (
              <div
                key={m.id}
                title={`${m.date} — ${m.title}`}
                aria-hidden
                className="absolute bottom-0 -translate-x-1/2 transition-opacity duration-300 ease-out"
                style={{
                  left: `${pct(m.ts)}%`,
                  width: 2,
                  height: 14,
                  background: "#D4B85C",
                  opacity: isPast ? 1 : 0.4,
                  borderRadius: 1,
                }}
              />
            );
          })}

          {/* Playhead — continuous dusty blue, glides as you scroll */}
          <div
            aria-hidden
            className="absolute bottom-0 -translate-x-1/2"
            style={{
              left: `${playheadPct}%`,
              width: 3,
              height: 26,
              background: PLAYHEAD_COLOR,
              boxShadow: "0 0 14px rgba(163, 189, 209, 0.75)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative bg-cream">
      {!pinned && Bar}

      {pinned && (
        <div
          className="fixed left-0 right-0 z-30"
          style={{ top: `${NAV_HEIGHT}px` }}
        >
          {Bar}
        </div>
      )}

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
