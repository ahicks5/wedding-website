import type { Metadata } from "next";
import RsvpContent from "./RsvpContent";
import RsvpComingSoon from "./RsvpComingSoon";

export const metadata: Metadata = {
  title: "RSVP",
  description: "RSVP to Lyndsey and Andrew's wedding celebration.",
};

// Server component — reads ?preview=<password> on the server so the admin
// password is never sent to the client. Anyone with the password can hit
// /rsvp?preview=<password> to test the real form before invites go out.
export default function RsvpPage({
  searchParams,
}: {
  searchParams: { preview?: string };
}) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "wedding2026";
  const isPreview =
    !!searchParams.preview && searchParams.preview === adminPassword;

  return isPreview ? <RsvpContent /> : <RsvpComingSoon />;
}
