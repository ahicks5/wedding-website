#!/usr/bin/env node
// ============================================
// Gallery EXIF Sync
// ============================================
// Reads every image in public/images/photos/gallery/, pulls the
// EXIF DateTimeOriginal (or CreateDate fallback) out of it, and
// writes a date-sorted manifest to src/lib/gallery.generated.json.
//
// The Timeline component reads that manifest and sprinkles gallery
// photos into the relationship timeline at chronologically-correct
// positions between milestones.
//
// Run after dropping new gallery photos in:
//   npm run sync-gallery
// ============================================

import exifr from "exifr";
import { readdir, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const GALLERY_DIR = "public/images/photos/gallery";
const OUTPUT_FILE = "src/lib/gallery.generated.json";
const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".heic", ".webp"]);

async function main() {
  let entries;
  try {
    entries = await readdir(GALLERY_DIR);
  } catch (err) {
    console.error(`Could not read ${GALLERY_DIR}: ${err.message}`);
    process.exit(1);
  }

  const photos = [];

  for (const file of entries) {
    if (file.startsWith(".")) continue; // .gitkeep, .DS_Store
    const ext = extname(file).toLowerCase();
    if (!VALID_EXT.has(ext)) continue;

    const fullPath = join(GALLERY_DIR, file);

    let isoDate = null;
    let source = "missing";
    try {
      const meta = await exifr.parse(fullPath, {
        pick: ["DateTimeOriginal", "CreateDate", "ModifyDate"],
      });
      const exifDate = meta?.DateTimeOriginal || meta?.CreateDate;
      if (exifDate instanceof Date && !isNaN(exifDate.getTime())) {
        isoDate = exifDate.toISOString();
        source = meta?.DateTimeOriginal ? "DateTimeOriginal" : "CreateDate";
      }
    } catch (err) {
      // Fall through to file mtime fallback
    }

    if (!isoDate) {
      // Fall back to file modification time so undated photos still
      // get a reasonable position in the timeline.
      try {
        const s = await stat(fullPath);
        isoDate = s.mtime.toISOString();
        source = "mtime";
      } catch {
        isoDate = new Date().toISOString();
        source = "fallback";
      }
    }

    photos.push({
      src: `gallery/${file}`,
      alt: "Andrew & Lyndsey",
      date: isoDate,
      source,
    });
  }

  photos.sort((a, b) => a.date.localeCompare(b.date));

  await writeFile(OUTPUT_FILE, JSON.stringify(photos, null, 2) + "\n");

  console.log(
    `Wrote ${photos.length} gallery photo${photos.length === 1 ? "" : "s"} to ${OUTPUT_FILE}.`
  );
  for (const p of photos) {
    console.log(`  - ${p.src} (${p.date.slice(0, 10)} via ${p.source})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
