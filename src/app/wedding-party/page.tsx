import type { Metadata } from "next";
import WeddingPartyContent from "./WeddingPartyContent";
import { pickRandomFluff } from "@/lib/fluff";

export const metadata: Metadata = {
  title: "Wedding Party",
  description:
    "Meet the bridesmaids, groomsmen, and special members of Lyndsey and Andrew's wedding party.",
};

// Force per-request rendering so the random fluff hero re-rolls on every
// visit instead of getting frozen at build time.
export const dynamic = "force-dynamic";

export default function WeddingPartyPage() {
  return <WeddingPartyContent fluffFile={pickRandomFluff()} />;
}
