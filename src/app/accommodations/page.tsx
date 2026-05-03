import type { Metadata } from "next";
import AccommodationsContent from "./AccommodationsContent";

export const metadata: Metadata = {
  title: "Accommodations",
  description:
    "Hotels, travel tips, and things to do in Austin for Lyndsey and Andrew's wedding.",
};

export default function AccommodationsPage() {
  return <AccommodationsContent />;
}
