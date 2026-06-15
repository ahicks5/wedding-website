import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SkipToContent from "@/components/layout/SkipToContent";
import PageTransitionProvider from "@/components/layout/PageTransitionProvider";
import MotionProvider from "@/components/layout/MotionProvider";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  title: {
    default: "Lyndsey & Andrew — August 2026",
    template: "%s | Lyndsey & Andrew Wedding",
  },
  description:
    "Join us in celebrating the wedding of Lyndsey and Andrew. August 15, 2026 in Austin, Texas.",
  openGraph: {
    title: "Lyndsey & Andrew — We're Getting Married!",
    description:
      "Join us in celebrating our wedding. August 15, 2026 in Austin, Texas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <MotionProvider>
          <SkipToContent />
          <Nav />
          <main id="main-content" className="min-h-screen">
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </main>
          <Footer />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
