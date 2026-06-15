import type { Metadata } from "next";
import ThankYouContent from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your honeymoon gift.",
  robots: { index: false, follow: false },
};

export default function HoneymoonThankYouPage() {
  return <ThankYouContent />;
}
