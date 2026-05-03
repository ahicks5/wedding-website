import type { Metadata } from "next";
import RsvpContent from "./RsvpContent";

export const metadata: Metadata = {
  title: "RSVP",
  description: "RSVP to Lyndsey and Andrew's wedding celebration.",
};

export default function RsvpPage() {
  return <RsvpContent />;
}
