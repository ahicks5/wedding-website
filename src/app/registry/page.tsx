import type { Metadata } from "next";
import RegistryContent from "./RegistryContent";
import RegistryComingSoon from "./RegistryComingSoon";
import { pickRandomFluff } from "@/lib/fluff";

export const metadata: Metadata = {
  title: "Registry",
  description: "Gift registry and honeymoon fund for Lyndsey and Andrew.",
};

// Server component — reads ?preview=<password> on the server so the admin
// password is never sent to the client. Hit /registry?preview=<password>
// to see the real registry cards while we finish wiring real links.
// `searchParams` already forces dynamic rendering, so the fluff hero
// re-rolls per request automatically.
export default function RegistryPage({
  searchParams,
}: {
  searchParams: { preview?: string };
}) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "wedding2026";
  const isPreview =
    !!searchParams.preview && searchParams.preview === adminPassword;
  const fluffFile = pickRandomFluff();

  return isPreview ? (
    <RegistryContent fluffFile={fluffFile} />
  ) : (
    <RegistryComingSoon fluffFile={fluffFile} />
  );
}
