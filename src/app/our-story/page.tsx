import type { Metadata } from "next";
import StoryHero from "@/components/story/StoryHero";
import Timeline from "@/components/story/Timeline";
import NextChapter from "@/components/story/NextChapter";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story of how Lyndsey and Andrew met, fell in love, and decided to spend their lives together.",
};

export default function OurStoryPage() {
  return (
    <>
      <StoryHero />
      <Timeline />
      <NextChapter />
    </>
  );
}
