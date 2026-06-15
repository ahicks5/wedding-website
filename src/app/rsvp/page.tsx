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
// Password is hardcoded to match the admin login (src/app/api/admin/rsvps),
// so there's a single password to remember for both the preview and /admin.
export default function RsvpPage({
  searchParams,
}: {
  searchParams: { preview?: string };
}) {
  const adminPassword = "dumptruck";
  const isPreview =
    !!searchParams.preview && searchParams.preview === adminPassword;

  return isPreview ? <RsvpContent /> : <RsvpComingSoon />;
}
