"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, Check, Loader2 } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import FluffHero from "@/components/layout/FluffHero";
import {
  HONEYMOON_EXPERIENCES,
  QUICK_AMOUNTS,
  formatUSD,
  type HoneymoonExperience,
} from "@/lib/honeymoon";
import type { RaisedTotals } from "@/lib/contributions";

export default function HoneymoonContent({ raised }: { raised: RaisedTotals }) {
  const [active, setActive] = useState<HoneymoonExperience | null>(null);

  return (
    <>
      <FluffHero
        eyebrow="Your presence is the gift"
        title="Honeymoon Fund"
        subtitle="If you'd like to give a little something, help send us off — five nights in Mallorca, then on to Florence and Rome."
      />

      <section className="bg-ivory pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid gap-5 sm:gap-6">
            {HONEYMOON_EXPERIENCES.map((exp, i) => (
              <FadeIn key={exp.id} delay={i * 0.08}>
                <ExperienceCard
                  exp={exp}
                  raisedDollars={raised[exp.id] ?? 0}
                  onContribute={() => setActive(exp)}
                />
              </FadeIn>
            ))}
          </div>

          <p className="mt-12 text-center font-serif text-base italic text-warm-gray">
            Thank you for being part of our story. — Lyndsey &amp; Andrew
          </p>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <ContributeDialog exp={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function ExperienceCard({
  exp,
  raisedDollars,
  onContribute,
}: {
  exp: HoneymoonExperience;
  raisedDollars: number;
  onContribute: () => void;
}) {
  // Open-ended fund (no goal): a full decorative bar + running total, no target.
  const openEnded = exp.goalDollars == null;
  const pct = openEnded
    ? 100
    : Math.min(100, Math.round((raisedDollars / exp.goalDollars!) * 100));
  const funded = !openEnded && raisedDollars >= exp.goalDollars!;

  return (
    <div className="rounded-xl border border-linen bg-white p-6 shadow-soft sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage/10 text-2xl">
          {exp.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-warm-gray">
            {exp.location}
          </p>
          <h3 className="mt-1 font-serif text-xl text-charcoal">{exp.title}</h3>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-charcoal-light">
            {exp.blurb}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-linen">
          <motion.div
            className={`h-full rounded-full ${funded ? "bg-gold" : "bg-sage"}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between font-sans text-sm">
          <span className="font-medium text-charcoal">
            {openEnded ? (
              <>
                {formatUSD(raisedDollars)}{" "}
                <span className="text-warm-gray">contributed so far</span>
              </>
            ) : funded ? (
              <span className="inline-flex items-center gap-1.5 text-gold-dark">
                <Check className="h-4 w-4" /> Fully funded — thank you!
              </span>
            ) : (
              <>
                {formatUSD(raisedDollars)}{" "}
                <span className="text-warm-gray">of {formatUSD(exp.goalDollars!)}</span>
              </>
            )}
          </span>
          <button
            onClick={onContribute}
            className="inline-flex items-center gap-1.5 rounded-full bg-sage px-4 py-2 font-sans text-xs font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-sage-dark"
          >
            <Heart className="h-3.5 w-3.5" />
            Contribute
          </button>
        </div>
      </div>
    </div>
  );
}

function ContributeDialog({
  exp,
  onClose,
}: {
  exp: HoneymoonExperience;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<number>(QUICK_AMOUNTS[1]);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "preview" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  // The chosen amount is either a preset chip or the custom field, whichever
  // was touched last (custom wins when it has a value).
  const customNum = parseFloat(custom);
  const chosenDollars = custom.trim() && !Number.isNaN(customNum) ? customNum : amount;
  const valid = chosenDollars >= 5;

  async function handleSubmit() {
    if (!valid) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/honeymoon/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: exp.id,
          amountCents: Math.round(chosenDollars * 100),
        }),
      });
      const data = await res.json();

      if (data.notConfigured) {
        setStatus("preview");
        return;
      }
      if (!res.ok || !data.url) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      // Hand off to Stripe's hosted checkout.
      window.location.href = data.url;
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-charcoal/50 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-medium sm:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-warm-gray">
              {exp.location}
            </p>
            <h3 className="mt-1 font-serif text-2xl text-charcoal">{exp.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-warm-gray transition-colors hover:bg-linen hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === "preview" ? (
          <div className="mt-6 rounded-lg bg-ivory p-5 text-center">
            <p className="font-serif text-lg text-charcoal">Preview mode 💙</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-charcoal-light">
              Payments aren&apos;t switched on yet — this page is a private
              preview. Once Stripe is connected, this button will take guests
              to a secure checkout for{" "}
              <span className="font-medium text-charcoal">
                {formatUSD(chosenDollars)}
              </span>
              .
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-full bg-sage px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-sage-dark"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <p className="mt-4 font-sans text-sm text-charcoal-light">
              Choose an amount to contribute:
            </p>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((amt) => {
                const selected = !custom.trim() && amount === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustom("");
                    }}
                    className={`rounded-lg border py-2.5 font-sans text-sm font-medium transition-colors ${
                      selected
                        ? "border-sage bg-sage text-white"
                        : "border-linen bg-white text-charcoal hover:border-sage"
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              <label className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-charcoal-light">
                  $
                </span>
                <input
                  type="number"
                  min={5}
                  inputMode="decimal"
                  placeholder="Other amount"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="w-full rounded-lg border border-linen py-2.5 pl-8 pr-4 font-sans text-sm text-charcoal outline-none transition-colors focus:border-sage"
                />
              </label>
            </div>

            {status === "error" && (
              <p className="mt-3 font-sans text-sm text-red-600">{errorMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!valid || status === "loading"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-sage px-6 py-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Contribute {valid ? formatUSD(chosenDollars) : ""}</>
              )}
            </button>
            <p className="mt-3 text-center font-sans text-xs text-warm-gray">
              Secure checkout powered by Stripe.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
