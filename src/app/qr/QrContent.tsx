"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { WEDDING } from "@/lib/constants";
import FluffHero from "@/components/layout/FluffHero";

export default function QrContent() {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svgEl = svgContainerRef.current?.querySelector("svg");
    if (!svgEl) return;

    // Convert SVG to a downloadable PNG
    const canvas = document.createElement("canvas");
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    img.onload = () => {
      // White background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const link = document.createElement("a");
      link.download = "wedding-qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <FluffHero
        eyebrow="For your invitations"
        title="QR Code"
        subtitle="Scan to visit our wedding website"
      />
      <div className="flex flex-col items-center justify-center bg-ivory px-6 pb-20 pt-16 sm:pt-20">
      <FadeIn delay={0.2}>
        <div className="mt-8 rounded-2xl border border-linen bg-white p-6 shadow-soft sm:mt-10 sm:p-10">
          <div ref={svgContainerRef} className="flex items-center justify-center">
            <QRCodeSVG
              value={WEDDING.siteUrl}
              size={200}
              bgColor="#FFFFFF"
              fgColor="#2C2C2C"
              level="H"
              includeMargin={false}
            />
          </div>

          <p className="mt-4 text-center font-sans text-xs text-warm-gray">
            {WEDDING.siteUrl}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.35}>
        <button onClick={handleDownload} className="btn-primary mt-8">
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </button>
      </FadeIn>

      <FadeIn delay={0.45}>
        <p className="mt-8 max-w-sm text-center font-sans text-xs leading-relaxed text-warm-gray">
          Print this QR code on your save-the-dates, invitations, or table
          cards. Guests can scan it with their phone camera to visit the site
          instantly.
        </p>
      </FadeIn>
      </div>
    </>
  );
}
