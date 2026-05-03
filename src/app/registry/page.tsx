import type { Metadata } from "next";
import RegistryContent from "./RegistryContent";

export const metadata: Metadata = {
  title: "Registry",
  description: "Gift registry and honeymoon fund for Lyndsey and Andrew.",
};

export default function RegistryPage() {
  return <RegistryContent />;
}
