import type { Metadata } from "next";
import QrContent from "./QrContent";

export const metadata: Metadata = {
  title: "QR Code",
  description: "Printable QR code for wedding invitations.",
};

export default function QrPage() {
  return <QrContent />;
}
