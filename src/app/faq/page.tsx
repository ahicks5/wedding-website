import type { Metadata } from "next";
import FaqContent from "./FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Lyndsey and Andrew's wedding day.",
};

export default function FaqPage() {
  return <FaqContent />;
}
