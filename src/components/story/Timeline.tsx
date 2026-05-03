"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  TIMELINE,
  type MilestoneItem,
  type PhotoItem,
} from "./milestones";
import { cn } from "@/lib/utils";

const ASPECT_CLASS = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[3/2]",
};

function resolveSrc(src: string) {
  // Allow either a remote URL (Unsplash placeholder) or a relative path
  // under /public/images/photos/.
  return src.startsWith("http") ? src : `/images/photos/${src}`;
}

export default function Timeline() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="relative mx-auto max-w-5xl px-6">
        {/* Mobile vertical line — pinned to the left rail */}
        <div className="absolute bottom-0 left-10 top-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent lg:hidden" />

        {/* Desktop center line */}
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent lg:block" />

        <div className="relative space-y-8 sm:space-y-10 lg:space-y-14">
          {TIMELINE.map((item, idx) =>
            item.type === "milestone" ? (
              <Milestone key={item.id} item={item} index={idx} />
            ) : (
              <PhotoFloat
                key={`photo-${idx}`}
                item={item}
                index={idx}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function Milestone({ item, index }: { item: MilestoneItem; index: number }) {
  const isLeft = item.side === "left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.05 }}
      className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-x-3"
    >
      {/* Dot on the line */}
      <div
        aria-hidden
        className={cn(
          "absolute h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-cream",
          "left-10 top-1.5 -translate-x-1/2",
          "lg:left-1/2 lg:top-2"
        )}
      />

      {/* Content — sits tight to the line */}
      <div
        className={cn(
          "pl-14 lg:pl-0",
          isLeft
            ? "lg:col-start-1 lg:pr-4 lg:text-right"
            : "lg:col-start-2 lg:pl-4"
        )}
      >
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
          {item.date}
        </p>
        <h3 className="mt-1.5 font-serif text-lg text-charcoal sm:text-xl">
          {item.title}
        </h3>
        <p
          className={cn(
            "mt-1.5 font-serif text-sm leading-snug text-charcoal-light",
            isLeft ? "lg:ml-auto" : "",
            "lg:max-w-[18rem]"
          )}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function PhotoFloat({ item, index }: { item: PhotoItem; index: number }) {
  const isLeft = item.side === "left";
  const aspectClass = ASPECT_CLASS[item.aspect ?? "portrait"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16"
    >
      <div
        className={cn(
          "pl-16 lg:pl-0",
          isLeft
            ? "lg:col-start-1 lg:flex lg:justify-end lg:pr-4"
            : "lg:col-start-2 lg:pl-4"
        )}
      >
        <div
          className="w-full max-w-xs sm:max-w-sm"
          style={{
            transform: item.tilt ? `rotate(${item.tilt}deg)` : undefined,
          }}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-md bg-ivory shadow-medium",
              aspectClass
            )}
          >
            <Image
              src={resolveSrc(item.src)}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 30vw"
              priority={index < 3}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
