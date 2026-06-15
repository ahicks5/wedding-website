import type { Metadata } from "next";
import RsvpContent from "./RsvpContent";

export const metadata: Metadata = {
  title: "RSVP",
  description: "RSVP to Lyndsey and Andrew's wedding celebration.",
};

// RSVP is open to all guests. (The "Coming Soon" gate lives in RsvpComingSoon
// if it ever needs to be re-enabled before a future event.)
export default function RsvpPage() {
  return <RsvpContent />;
}
