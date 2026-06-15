import type { Metadata } from "next";
import { getRaisedTotals } from "@/lib/contributions";
import HoneymoonContent from "./HoneymoonContent";

// HIDDEN PAGE — not linked from the registry card or nav. `noindex` keeps it
// out of search results while it's a private preview. Share the direct URL
// (/registry/honeymoon) to review it.
export const metadata: Metadata = {
  title: "Honeymoon Fund",
  description: "Help send Lyndsey and Andrew off on their honeymoon.",
  robots: { index: false, follow: false },
};

// Always render fresh so the bars reflect the latest contributions.
export const dynamic = "force-dynamic";

export default async function HoneymoonPage() {
  const raised = await getRaisedTotals();
  return <HoneymoonContent raised={raised} />;
}
