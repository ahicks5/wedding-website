// ============================================
// RELATIONSHIP TIMELINE — Andrew & Lyndsey
// ============================================
// Items render top-to-bottom in this order. Each item is either a
// milestone (date + title + short description) or a photo. On desktop,
// the `side` field places it left or right of the center line. On
// mobile everything stacks on a single left-line layout.
// Photos do NOT need to align thematically with the date next to them
// — they're decorative side-rail content.
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

// Real engagement photos — referenced via paths under
// /public/images/photos/. Swap freely as more photos arrive.
const PH = {
  candid1: "engagement/proposal-1.jpg",
  candid2: "engagement/IMG_1611.jpg",
  candid3: "engagement/proposal-9.jpg",
  candid4: "engagement/IMG_1625.jpg",
  candid5: "engagement/proposal-18.jpg",
  candid6: "engagement/IMG_1641.jpg",
};

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
    type: "photo",
    src: PH.candid1,
    alt: "Lyndsey and Andrew",
    side: "right",
    aspect: "portrait",
    tilt: -1.5,
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
    type: "photo",
    src: PH.candid2,
    alt: "Together",
    side: "left",
    aspect: "landscape",
    tilt: 1,
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
    title: "Officially together",
    description: "Andrew asked. Lyndsey said yes.",
    side: "left",
  },
  {
    type: "photo",
    src: PH.candid3,
    alt: "A moment",
    side: "right",
    aspect: "square",
    tilt: -2,
  },
  {
    type: "milestone",
    id: "graduations",
    date: "May 2022",
    title: "Two graduations",
    description:
      "Andrew finishes at Notre Dame and Lyndsey completes her dietetic internship — Lyndsey's first trip to South Bend included.",
    side: "right",
  },
  {
    type: "milestone",
    id: "tough-mudder",
    date: "October 2022",
    title: "Tough Mudder",
    description: "Mud, walls, ice baths — all in.",
    side: "left",
  },
  {
    type: "photo",
    src: PH.candid4,
    alt: "Adventures",
    side: "left",
    aspect: "portrait",
    tilt: 2,
  },
  {
    type: "milestone",
    id: "california",
    date: "November 2022",
    title: "Meeting the Hicks family",
    description: "Lyndsey's first trip to California to meet Andrew's family.",
    side: "right",
  },
  {
    type: "milestone",
    id: "eras",
    date: "March 31, 2023",
    title: "Taylor Swift · Eras Tour",
    description: "Friendship bracelets, three hours of singing, no regrets.",
    side: "left",
  },
  {
    type: "photo",
    src: PH.candid5,
    alt: "Date night",
    side: "right",
    aspect: "landscape",
    tilt: -1,
  },
  {
    type: "milestone",
    id: "austin-fc",
    date: "July 2023",
    title: "First Austin FC game",
    description: "Verde and Black at Q2 Stadium together.",
    side: "right",
  },
  {
    type: "milestone",
    id: "lyndsey-austin",
    date: "April 2024",
    title: "Lyndsey moves to Austin",
    description: "Same city, same zip code, same coffee shop.",
    side: "left",
  },
  {
    type: "photo",
    src: PH.candid6,
    alt: "Together in Austin",
    side: "left",
    aspect: "square",
    tilt: 1.5,
  },
  {
    type: "milestone",
    id: "nd-am-2024",
    date: "August 31, 2024",
    title: "Notre Dame at Texas A&M",
    description:
      "Andrew's Irish vs. Aggieland on opening day — Notre Dame 23, Texas A&M 13.",
    side: "right",
  },
  {
    type: "milestone",
    id: "nd-am-2025",
    date: "September 13, 2025",
    // TODO: Verify final score for the 2025 ND vs Texas A&M game
    title: "Texas A&M at Notre Dame",
    description: "Round two — this time in South Bend.",
    side: "left",
  },
  {
    type: "milestone",
    id: "engaged",
    date: "December 14, 2025",
    title: "Engaged",
    description: "He asked. She said yes. Again.",
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
