import type { Metadata } from "next";
import FaqContent from "./FaqContent";
import { pickRandomFluff } from "@/lib/fluff";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Lyndsey and Andrew's wedding day.",
};

// Force per-request rendering so the random fluff hero re-rolls on every
// visit instead of getting frozen at build time.
export const dynamic = "force-dynamic";

export default function FaqPage() {
  return <FaqContent fluffFile={pickRandomFluff()} />;
}
