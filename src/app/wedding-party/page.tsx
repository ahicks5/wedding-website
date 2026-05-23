import type { Metadata } from "next";
import WeddingPartyContent from "./WeddingPartyContent";

export const metadata: Metadata = {
  title: "Wedding Party",
  description:
    "Meet the bridesmaids, groomsmen, and special members of Lyndsey and Andrew's wedding party.",
};

export default function WeddingPartyPage() {
  return <WeddingPartyContent />;
}
