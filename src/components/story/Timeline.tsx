"use client";

import { MILESTONES, PARALLAX_PHOTOS } from "./milestones";
import TimelineMilestone from "./TimelineMilestone";
import ParallaxBreak from "./ParallaxBreak";

export default function Timeline() {
  // Build an interleaved list of milestones and parallax breaks
  const elements: React.ReactNode[] = [];

  MILESTONES.forEach((milestone, index) => {
    elements.push(
      <TimelineMilestone key={milestone.title} milestone={milestone} index={index} />
    );

    // Check if a parallax break should appear after this milestone
    const parallax = PARALLAX_PHOTOS.find((p) => p.after === index);
    if (parallax) {
      elements.push(
        <ParallaxBreak
          key={`parallax-${index}`}
          image={parallax.image}
          alt={parallax.alt}
          quote={parallax.quote}
          attribution={parallax.attribution}
        />
      );
    }
  });

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-5xl px-6">{elements}</div>
    </section>
  );
}
