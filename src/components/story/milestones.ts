// ============================================
// RELATIONSHIP TIMELINE — Andrew & Lyndsey
// ============================================
// Items render top-to-bottom in this order. Each item is either a
// milestone (date + title + short description) or a photo. On desktop,
// the `side` field places it left or right of the center line. On
// mobile everything stacks on a single left-line layout.
// Gallery photos (from public/images/photos/gallery/, after running
// `npm run sync-gallery`) are auto-sprinkled by EXIF date — see
// Timeline.tsx for that logic.
// ============================================

export type MilestoneItem = {
  type: "milestone";
  id: string;
  date: string;
  title: string;
  description: string;
  side: "left" | "right";
};

export type PhotoItem = {
  type: "photo";
  /** path under /images/photos/, e.g. "engagement/01.jpg" */
  src: string;
  alt: string;
  side: "left" | "right";
  aspect?: "portrait" | "square" | "landscape";
  /** small visual rotation in degrees, optional */
  tilt?: number;
};

export type TimelineItem = MilestoneItem | PhotoItem;

export const TIMELINE: TimelineItem[] = [
  {
    type: "milestone",
    id: "met",
    date: "July 5, 2021",
    title: "How we met",
    description: "A summer evening in Austin. The first hello.",
    side: "left",
  },
  {
    type: "milestone",
    id: "first-date",
    date: "August 15, 2021",
    title: "First date",
    description:
      "Five years to the day before we'd say I do — though we didn't know it yet.",
    side: "right",
  },
  {
    type: "milestone",
    id: "shreveport-move",
    date: "August 2021",
    title: "Lyndsey moves to Shreveport",
    description: "A long-distance start to whatever this was becoming.",
    side: "left",
  },
  {
    type: "milestone",
    id: "first-shreveport",
    date: "October 2021",
    title: "First trip to Shreveport",
    description: "Andrew makes the drive. The long-distance felt shorter.",
    side: "right",
  },
  {
    type: "milestone",
    id: "official",
    date: "January 7, 2022",
    title: "Boyfriend & girlfriend",
    description: "Officially together.",
    side: "left",
  },
  {
    type: "milestone",
    id: "andrew-graduation",
    date: "May 2022",
    title: "Andrew's graduation",
    description: "Notre Dame — and Lyndsey's first trip to South Bend.",
    side: "right",
  },
  {
    type: "milestone",
    id: "lyndsey-graduation",
    date: "May 2022",
    title: "Lyndsey's graduation",
    description: "Capping off her dietetic graduate program.",
    side: "left",
  },
  {
    type: "milestone",
    id: "tough-mudder",
    date: "October 2022",
    title: "Tough Mudder",
    description: "Mud, walls, ice baths — all in.",
    side: "right",
  },
  {
    type: "milestone",
    id: "hometown",
    date: "November 2022",
    title: "Andrew's hometown",
    description: "Lyndsey's first trip out west to where Andrew grew up.",
    side: "left",
  },
  {
    type: "milestone",
    id: "eras",
    date: "March 31, 2023",
    title: "Taylor Swift · Eras Tour",
    description: "Andrew surprised Lyndsey with seats neither of us will forget.",
    side: "right",
  },
  {
    type: "milestone",
    id: "austin-fc",
    date: "July 2023",
    title: "First Austin FC game",
    description: "Last-second tickets, impromptu date night at Q2.",
    side: "left",
  },
  {
    type: "milestone",
    id: "lyndsey-austin",
    date: "April 2024",
    title: "Lyndsey moves to Austin",
    description: "Same city, same zip code, same coffee shop.",
    side: "right",
  },
  {
    type: "milestone",
    id: "nd-am-2024",
    date: "August 31, 2024",
    title: "Notre Dame at Texas A&M",
    description: "Kyle Field season opener — Notre Dame 23, Texas A&M 13.",
    side: "left",
  },
  {
    type: "milestone",
    id: "nyc",
    date: "November 2024",
    title: "Trip to New York City",
    description:
      "Lyndsey's first time in NYC — visiting Pat & Ellie and catching a Saturday football game.",
    side: "right",
  },
  {
    type: "milestone",
    id: "christmas-kc",
    date: "December 2024",
    title: "Christmas in Kansas City",
    description: "Where Andrew's parents now call home.",
    side: "left",
  },
  {
    type: "milestone",
    id: "ring-shopping",
    date: "September 2025",
    title: "Ring shopping",
    description: "A hint of what was coming.",
    side: "right",
  },
  {
    type: "milestone",
    id: "nd-am-2025",
    date: "September 13, 2025",
    title: "Texas A&M at Notre Dame",
    description:
      "Round two in South Bend — came down to the final play. Texas A&M 41, Notre Dame 40.",
    side: "left",
  },
  {
    type: "milestone",
    id: "engaged",
    date: "December 14, 2025",
    title: "Engaged",
    description: "The yes.",
    side: "right",
  },
  {
    type: "milestone",
    id: "wedding",
    date: "August 15, 2026",
    title: "Our wedding day",
    description:
      "Five years to the day after our first date — full circle, in Austin.",
    side: "left",
  },
];
