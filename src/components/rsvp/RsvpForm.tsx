"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Guest, Party, RsvpStatus } from "@/lib/database.types";
import StepSearch from "./StepSearch";
import StepParty from "./StepParty";
import StepRsvp from "./StepRsvp";
import StepMeals from "./StepMeals";
import StepNotes from "./StepNotes";
import StepConfirmation from "./StepConfirmation";

export interface GuestRsvpData {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: RsvpStatus;
  meal_choice: string;
  dietary_restrictions: string;
  notes: string;
}

const TOTAL_STEPS = 6;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function RsvpForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [party, setParty] = useState<Party | null>(null);
  const [guestData, setGuestData] = useState<GuestRsvpData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handlePartyFound = (foundParty: Party, guests: Guest[]) => {
    setParty(foundParty);
    setGuestData(
      guests.map((g) => ({
        id: g.id,
        first_name: g.first_name,
        last_name: g.last_name,
        rsvp_status: g.rsvp_status === "pending" ? "accepted" : g.rsvp_status,
        meal_choice: g.meal_choice ?? "",
        dietary_restrictions: g.dietary_restrictions ?? "",
        notes: g.notes ?? "",
      }))
    );
    goNext();
  };

  const updateGuest = (id: string, updates: Partial<GuestRsvpData>) => {
    setGuestData((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guests: guestData.map((g) => ({
            id: g.id,
            rsvp_status: g.rsvp_status,
            meal_choice: g.meal_choice || null,
            dietary_restrictions: g.dietary_restrictions || null,
            notes: g.notes || null,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      goNext();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Determine if any guest is attending (for meal step)
  const anyAccepted = guestData.some((g) => g.rsvp_status === "accepted");

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Bar */}
      {step < TOTAL_STEPS && (
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-warm-gray">
              Step {step} of {TOTAL_STEPS - 1}
            </span>
            <span className="font-sans text-xs text-warm-gray">
              {Math.round((step / (TOTAL_STEPS - 1)) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-linen">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {step === 1 && <StepSearch onPartyFound={handlePartyFound} />}
          {step === 2 && party && (
            <StepParty
              party={party}
              guests={guestData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepRsvp
              guests={guestData}
              updateGuest={updateGuest}
              onNext={() => {
                // Skip meals if nobody is attending
                if (!guestData.some((g) => g.rsvp_status === "accepted")) {
                  setDirection(1);
                  setStep(5); // Jump to notes
                } else {
                  goNext();
                }
              }}
              onBack={goBack}
            />
          )}
          {step === 4 && anyAccepted && (
            <StepMeals
              guests={guestData.filter((g) => g.rsvp_status === "accepted")}
              updateGuest={updateGuest}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <StepNotes
              guests={guestData}
              updateGuest={updateGuest}
              onSubmit={handleSubmit}
              onBack={goBack}
              submitting={submitting}
            />
          )}
          {step === 6 && (
            <StepConfirmation guests={guestData} partyName={party?.party_name ?? ""} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
