// ============================================
// RELATIONSHIP MILESTONES — All placeholder content
// TODO: Replace with real dates, descriptions, and photos
// ============================================

export interface Milestone {
  date: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const MILESTONES: Milestone[] = [
  {
    date: "Growing Up",
    title: "Where It All Started",
    description:
      "Before their paths ever crossed, Andrew grew up in Texas with a love for the outdoors and an easy laugh that could fill any room. Lyndsey was raised with warmth and grace, the kind of person who lights up every gathering she walks into. Two stories unfolding separately — but headed toward the same destination.",
    // TODO: Replace with childhood/individual photos
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
    imageAlt: "Where it all started",
  },
  {
    date: "The Day They Met",
    title: "A Chance Encounter",
    description:
      "Some moments change everything. When Lyndsey and Andrew first met, there was an instant connection — the kind of easy conversation that makes hours feel like minutes. Neither of them knew it yet, but this was the beginning of something extraordinary.",
    // TODO: Replace with real photo
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
    imageAlt: "The day they met",
  },
  {
    date: "The First Date",
    title: "Butterflies & Good Coffee",
    description:
      "Nervous energy, stolen glances, and the kind of conversation that flows effortlessly. Their first date was everything a first date should be — and the beginning of a thousand more. By the end of the night, they both knew they'd found something special.",
    // TODO: Replace with real photo
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80",
    imageAlt: "Their first date",
  },
  {
    date: "Falling in Love",
    title: "Adventures Together",
    description:
      "What started as a spark quickly grew into something deeper. Road trips with the windows down, lazy Sunday mornings, inside jokes that no one else would understand, and the quiet comfort of knowing you've found your person. Every day together felt like a gift.",
    // TODO: Replace with real photo
    image:
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80",
    imageAlt: "Adventures together",
  },
  {
    date: "A Big Step",
    title: "Building a Life Together",
    description:
      "As their love deepened, so did their commitment. Moving in together, adopting routines, navigating life's challenges side by side — they were building something real. Through every up and down, one thing never wavered: they were better together.",
    // TODO: Replace with real photo
    image:
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80",
    imageAlt: "Building a life together",
  },
  {
    date: "The Proposal",
    title: "The Question of a Lifetime",
    description:
      "With a heart full of love and a ring in his pocket, Andrew planned the perfect moment to ask the most important question of his life. It was intimate, heartfelt, and absolutely them. And of course — she said yes.",
    // TODO: Replace with proposal photo
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    imageAlt: "The proposal",
  },
  {
    date: "Engaged!",
    title: "The Celebration Begins",
    description:
      "With a ring on her finger and joy in their hearts, Lyndsey and Andrew began planning the next chapter. Surrounded by the love of family and friends, the engagement season has been filled with excitement, laughter, and a whole lot of wedding planning.",
    // TODO: Replace with engagement photo
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    imageAlt: "Engaged and celebrating",
  },
];

export const PARALLAX_PHOTOS = [
  {
    // Shown between milestone 2 and 3
    after: 1,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    alt: "Lyndsey and Andrew together",
    quote: "I have found the one whom my soul loves.",
    attribution: "Song of Solomon 3:4",
  },
  {
    // Shown between milestone 5 and 6
    after: 4,
    image:
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1920&q=80",
    alt: "A beautiful moment",
    quote: "In all the world, there is no heart for me like yours.",
    attribution: "Maya Angelou",
  },
];
