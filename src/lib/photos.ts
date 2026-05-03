// ============================================
// PHOTO REGISTRY
// ============================================
// Drop image files in `public/images/photos/<category>/`.
// Add an entry here referencing the filename and the alt text.
// The Timeline component (and future photo components) read from
// this registry, so adding a photo = drop file + add one line.
// ============================================

export type PhotoAspect = "portrait" | "square" | "landscape";

export type Photo = {
  /** filename relative to /public/images/photos/<category>/, e.g. "01.jpg" */
  src: string;
  /** what the image shows; required for accessibility */
  alt: string;
  /** how to crop the image into its container; defaults to "portrait" */
  aspect?: PhotoAspect;
};

// Engagement photos — your pro shoot. Drop into /public/images/photos/engagement/
export const ENGAGEMENT_PHOTOS: Photo[] = [];

// General gallery — candids, dates, vacations, etc.
// Drop into /public/images/photos/gallery/
export const GALLERY_PHOTOS: Photo[] = [];
