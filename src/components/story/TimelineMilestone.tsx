"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Milestone } from "./milestones";

interface TimelineMilestoneProps {
  milestone: Milestone;
  index: number;
}

export default function TimelineMilestone({
  milestone,
  index,
}: TimelineMilestoneProps) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-12">
      {/* Left Content (or empty spacer on odd) */}
      <div
        className={`${isEven ? "md:text-right" : "md:order-3 md:text-left"}`}
      >
        {isEven ? (
          <MilestoneContent milestone={milestone} align="right" />
        ) : (
          <MilestoneImage milestone={milestone} side="right" />
        )}
      </div>

      {/* Center Timeline Line + Dot */}
      <div className="hidden flex-col items-center md:flex">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative z-10 flex h-4 w-4 items-center justify-center"
        >
          <div className="h-3 w-3 rounded-full border-2 border-gold bg-cream" />
        </motion.div>
        <div className="w-px flex-1 bg-linen" />
      </div>

      {/* Right Content (or empty spacer on even) */}
      <div className={`${isEven ? "md:order-3" : ""}`}>
        {isEven ? (
          <MilestoneImage milestone={milestone} side="left" />
        ) : (
          <MilestoneContent milestone={milestone} align="left" />
        )}
      </div>
    </div>
  );
}

function MilestoneContent({
  milestone,
  align,
}: {
  milestone: Milestone;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: align === "right" ? 30 : -30,
      }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="pb-16"
    >
      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
        {milestone.date}
      </span>
      <h3 className="mt-2 font-serif text-2xl text-charcoal sm:text-3xl">
        {milestone.title}
      </h3>
      <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal-light">
        {milestone.description}
      </p>

      {/* Mobile-only image */}
      <div className="mt-6 overflow-hidden rounded-lg md:hidden">
        <Image
          src={milestone.image}
          alt={milestone.imageAlt}
          width={600}
          height={400}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </motion.div>
  );
}

function MilestoneImage({
  milestone,
  side,
}: {
  milestone: Milestone;
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: side === "left" ? -30 : 30,
      }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="hidden pb-16 md:block"
    >
      <div className="group overflow-hidden rounded-lg">
        <Image
          src={milestone.image}
          alt={milestone.imageAlt}
          width={600}
          height={400}
          className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="50vw"
        />
      </div>
    </motion.div>
  );
}
