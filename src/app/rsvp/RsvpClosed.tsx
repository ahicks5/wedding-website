import { Heart, Mail } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { WEDDING } from "@/lib/constants";
import FluffHero from "@/components/layout/FluffHero";

// Shown in place of the RSVP form once the admin closes RSVPs (the deadline has
// passed). The open/closed flag lives in site_settings and is read server-side
// in rsvp/page.tsx.
export default function RsvpClosed() {
  return (
    <>
      <FluffHero eyebrow="With love and gratitude" title="RSVPs Are Closed" />

      <section className="bg-ivory px-6 pb-24 pt-16 sm:pt-20">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0.15}>
            <div className="rounded-lg border border-linen bg-white p-8 text-center shadow-soft sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10">
                <Heart className="h-6 w-6 text-sage" />
              </div>

              <h2 className="mt-6 font-serif text-2xl text-charcoal sm:text-3xl">
                Thank you for responding
              </h2>

              <p className="mt-4 font-serif text-base italic leading-relaxed text-charcoal-light sm:text-lg">
                Our RSVP list is now closed as we finalize the details for the big
                day. If you still need to reach us about your response, please get
                in touch directly — we&apos;ll do our best to help.
              </p>

              <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5">
                <Mail className="h-4 w-4 text-sage" />
                <a
                  href="/contact"
                  className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-charcoal underline-offset-4 hover:underline"
                >
                  Contact us
                </a>
              </div>

              <div className="mt-10 border-t border-linen pt-6">
                <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-warm-gray">
                  {WEDDING.dayOfWeek}
                </p>
                <p className="mt-2 font-serif text-2xl text-charcoal">
                  {WEDDING.dateDisplay}
                </p>
                <p className="mt-1 font-serif text-sm italic text-warm-gray">
                  Austin, Texas
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
