// ============================================
// WEDDING DETAILS
// ============================================

export const WEDDING = {
  groomFirstName: "Andrew",
  brideFirstName: "Lyndsey",
  coupleName: "Lyndsey & Andrew",
  hashtag: "#LyndseyAndAndrew", // TODO: Finalize hashtag

  // TODO: Confirm exact date and times
  date: new Date("2026-08-15T14:00:00-05:00"), // August 15, 2026, 2:00 PM CDT
  dateDisplay: "August 15, 2026",
  dayOfWeek: "Saturday",
  year: 2026,

  ceremony: {
    name: "St. John Neumann Catholic Church",
    address: "5455 Bee Cave Rd, Austin, TX 78746",
    time: "2:00 PM",
    mapUrl: "https://maps.google.com/?q=St+John+Neumann+Catholic+Church+Austin+TX",
  },

  reception: {
    name: "Hotel Ella",
    address: "1900 University Ave, Austin, TX 78705",
    time: "5:00 PM",
    mapUrl: "https://maps.google.com/?q=Hotel+Ella+Austin+TX",
  },

  // TODO: Update with real site URL after deployment
  siteUrl: "https://lyndseyandandrew.com",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Wedding Party", href: "/wedding-party" },
  { label: "FAQ", href: "/faq" },
  { label: "Accommodations", href: "/accommodations" },
  { label: "Registry", href: "/registry" },
  { label: "RSVP", href: "/rsvp" },
  { label: "Contact", href: "/contact" },
] as const;

export const SCHEDULE = [
  {
    day: "Saturday",
    date: "August 15",
    events: [
      { time: "2:00 PM", title: "Ceremony", location: "St. John Neumann Catholic Church" },
      { time: "5:00 PM", title: "Cocktail Hour", location: "Hotel Ella" },
      { time: "6:00 PM", title: "Reception & Dinner", location: "Hotel Ella" },
      { time: "9:00 PM", title: "Dancing & Celebration", location: "Hotel Ella" },
    ],
  },
  {
    day: "Sunday",
    date: "August 16",
    events: [
      // TODO: Confirm brunch details
      { time: "10:00 AM", title: "Farewell Brunch", location: "TBD" },
    ],
  },
] as const;
