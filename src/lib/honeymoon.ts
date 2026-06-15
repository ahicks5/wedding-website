// ============================================
// Honeymoon fund — experience definitions
//
// This is the ONE place to edit the honeymoon fund content. Each experience
// renders as a card with a progress bar on /registry/honeymoon. The `id` is a
// stable key used to total contributions in Supabase — once money is attached
// to an id, don't rename it (change title/blurb/goal freely).
//
// The trip: 5 nights in Mallorca → a few in Florence → the rest in Rome.
// ============================================

export type HoneymoonExperience = {
  /** Stable key — do not rename once contributions exist. */
  id: string;
  /** Short emoji shown in the card badge. */
  emoji: string;
  /** Card title. */
  title: string;
  /** Where it happens — small uppercase label. */
  location: string;
  /** One-line pitch in the couple's voice. */
  blurb: string;
  /**
   * Fundraising target in whole dollars. Bars can exceed this. Set to `null`
   * for an open-ended fund — it shows the running total with no goal/bar.
   */
  goalDollars: number | null;
};

export const HONEYMOON_EXPERIENCES: HoneymoonExperience[] = [
  {
    id: "general-fund",
    emoji: "💙",
    title: "The honeymoon fund",
    location: "Everywhere",
    blurb: "Toward anything and everything else — every bit helps us celebrate.",
    goalDollars: null,
  },
  {
    id: "mallorca-boat-day",
    emoji: "🏖️",
    title: "A boat day in Mallorca",
    location: "Mallorca",
    blurb: "Our own little cove, a chilled bottle of wine, and nowhere to be.",
    goalDollars: 400,
  },
  {
    id: "tuscany-wine-tasting",
    emoji: "🍷",
    title: "Wine tasting in Tuscany",
    location: "Florence",
    blurb: "A slow afternoon among the Chianti vines, glass in hand.",
    goalDollars: 250,
  },
  {
    id: "vatican-private-tour",
    emoji: "⛪",
    title: "A private Vatican tour",
    location: "Rome",
    blurb: "St. Peter's and the Sistine Chapel, with a guide all to ourselves.",
    goalDollars: 300,
  },
  {
    id: "rome-special-dinner",
    emoji: "🍝",
    title: "A special dinner in Rome",
    location: "Rome",
    blurb: "The long, candlelit, anniversary-worthy one.",
    goalDollars: 250,
  },
];

// Lookup helper used by the checkout route to validate an incoming id.
export function getExperience(id: string): HoneymoonExperience | undefined {
  return HONEYMOON_EXPERIENCES.find((e) => e.id === id);
}

// ---------------------------------------------------------------------------
// PREVIEW / DEMO data
//
// Shown ONLY when Supabase isn't configured (local preview before Stripe is
// connected) so the bars look alive while you scan and edit the page. Once
// Supabase + the webhook are live, real contributions replace these entirely.
// ---------------------------------------------------------------------------
export const DEMO_RAISED_DOLLARS: Record<string, number> = {
  "mallorca-boat-day": 260,
  "tuscany-wine-tasting": 250, // fully funded — shows the celebratory state
  "vatican-private-tour": 90,
  "rome-special-dinner": 175,
  "general-fund": 640,
};

// Preset "quick amount" chips offered in the contribute dialog (dollars).
export const QUICK_AMOUNTS = [25, 50, 100, 250];

export function formatUSD(dollars: number): string {
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
