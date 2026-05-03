"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` on import, so the map can only render on the
// client. Wrap the inner component in a dynamic import with ssr disabled.
const MapView = dynamic(() => import("./AustinMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full animate-pulse bg-ivory sm:h-[400px] md:h-[460px]" />
  ),
});

export default function AustinInteractiveMap() {
  return (
    <div className="overflow-hidden rounded-lg border border-linen shadow-soft">
      <MapView />
    </div>
  );
}
