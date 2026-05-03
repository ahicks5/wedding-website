import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Lyndsey and Andrew.",
};

export default function ContactPage() {
  return <ContactContent />;
}
