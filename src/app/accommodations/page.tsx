import type { Metadata } from "next";
import AccommodationsContent from "./AccommodationsContent";
import { pickRandomFluff } from "@/lib/fluff";

export const metadata: Metadata = {
  title: "Accommodations",
  description:
    "Hotels, travel tips, and things to do in Austin for Lyndsey and Andrew's wedding.",
};

// Force per-request rendering so the random fluff hero re-rolls on every
// visit instead of getting frozen at build time.
export const dynamic = "force-dynamic";

export default function AccommodationsPage() {
  return <AccommodationsContent fluffFile={pickRandomFluff()} />;
}
