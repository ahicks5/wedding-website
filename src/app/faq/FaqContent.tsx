"use client";

import FadeIn from "@/components/animations/FadeIn";
import Accordion from "@/components/ui/Accordion";

// TODO: Update answers with real details once finalized
const FAQ_ITEMS = [
  {
    question: "What is the dress code?",
    answer:
      "We're asking guests to dress in formal attire. Think elegant cocktail dresses, suits, or dressy separates. Austin in August is warm, so lightweight fabrics are encouraged! Please avoid white or ivory, as those are reserved for the bride.",
  },
  {
    question: "Will the ceremony and reception be at the same location?",
    answer:
      "The ceremony will be held at St. John Neumann Catholic Church, and the reception will follow at Hotel Ella. The venues are approximately 15 minutes apart by car. Transportation details will be shared closer to the date.",
  },
  {
    question: "What time should I arrive?",
    answer:
      "The ceremony begins at 2:00 PM. We kindly ask that guests arrive by 1:30 PM to allow time to be seated. The doors will open at 1:15 PM.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes! Both the ceremony venue and Hotel Ella have parking available. Complimentary valet parking will be provided at the reception. We also recommend rideshare services like Uber or Lyft for a stress-free evening.",
  },
  {
    question: "Can I bring a plus one?",
    answer:
      "Please refer to your invitation for details on your party size. We've done our best to include everyone, but due to venue capacity, we can only accommodate the guests listed on your invitation. If you have questions, please don't hesitate to reach out to us directly.",
  },
  {
    question: "What's the weather like in Austin in August?",
    answer:
      "Hot! August in Austin typically sees temperatures in the mid-90s to low 100s°F (35-40°C). The ceremony is indoors and the reception venue is fully air-conditioned, but we recommend light, breathable fabrics. Stay hydrated and don't forget sunscreen if you're exploring the city!",
  },
  {
    question: "Are kids welcome?",
    answer:
      "While we love your little ones, our wedding will be an adults-only celebration so that everyone can relax and enjoy the evening. We appreciate your understanding and hope this gives you a great excuse for a night out!",
  },
  {
    question: "Can I take photos during the ceremony?",
    answer:
      "We kindly ask for an unplugged ceremony — please keep phones and cameras tucked away while we exchange vows. Our professional photographer and videographer will capture every moment, and we'll share the photos with everyone afterward. Feel free to snap away at the reception!",
  },
  {
    question: "What if I have dietary restrictions?",
    answer:
      "We want everyone to enjoy the meal! When you RSVP, there will be a space to note any dietary restrictions or allergies. Our caterer is experienced in accommodating a variety of needs, including vegetarian, vegan, gluten-free, and common allergen-free options.",
  },
  {
    question: "Is there an after-party?",
    answer:
      "You bet! After the reception wraps up, we'll be continuing the celebration. Details on the after-party location and time will be shared closer to the wedding date — stay tuned!",
  },
  {
    question: "When is the RSVP deadline?",
    answer:
      "Please RSVP by July 1, 2026. This helps us finalize catering, seating, and all the details to make the day perfect. You can RSVP right here on our website — just head to the RSVP page!",
  },
];

export default function FaqContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ivory pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              Got questions?
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 font-serif text-lg italic text-charcoal-light">
              Everything you need to know about our big day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Accordion */}
      <section className="bg-ivory pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn delay={0.15}>
            <Accordion items={FAQ_ITEMS} />
          </FadeIn>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl text-charcoal">
              Still Have Questions?
            </h2>
            <div className="divider-gold" />
            <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal-light">
              Don&apos;t hesitate to reach out — we&apos;re happy to help with
              anything you need.
            </p>
            <a href="/contact" className="btn-primary mt-8 inline-flex">
              Contact Us
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
