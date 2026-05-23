import type { Metadata } from "next";
import QrContent from "./QrContent";
import { pickRandomFluff } from "@/lib/fluff";

export const metadata: Metadata = {
  title: "QR Code",
  description: "Printable QR code for wedding invitations.",
};

// Force per-request rendering so the random fluff hero re-rolls on every
// visit instead of getting frozen at build time.
export const dynamic = "force-dynamic";

export default function QrPage() {
  return <QrContent fluffFile={pickRandomFluff()} />;
}
