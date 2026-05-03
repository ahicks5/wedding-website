"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[9999] -translate-y-20 rounded-lg bg-sage px-4 py-2 font-sans text-sm font-medium text-cream shadow-medium transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
