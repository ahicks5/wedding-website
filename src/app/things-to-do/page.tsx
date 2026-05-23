import type { Metadata } from "next";
import ThingsToDoContent from "./ThingsToDoContent";
import { pickRandomFluff } from "@/lib/fluff";

export const metadata: Metadata = {
  title: "Things to Do in Austin",
  description:
    "Our favorite spots in Austin — coffee, eats, drinks, and outdoor activities for guests making a weekend of it.",
};

// Force per-request rendering so the random fluff hero re-rolls on every
// visit instead of getting frozen at build time.
export const dynamic = "force-dynamic";

export default function ThingsToDoPage() {
  return <ThingsToDoContent fluffFile={pickRandomFluff()} />;
}
