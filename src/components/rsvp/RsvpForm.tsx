"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Guest, Household, Rsvp, NameStatus, GuestType } from "@/lib/database.types";
import StepSearch from "./StepSearch";
import StepParty from "./StepParty";
import StepRsvp from "./StepRsvp";
import StepRehearsal from "./StepRehearsal";
import StepMeals from "./StepMeals";
import StepNotes from "./StepNotes";
import StepConfirmation from "./StepConfirmation";

export interface GuestRsvpData {
  guest_id: string;
  display_name: string;
  name_status: NameStatus;
  guest_type: GuestType;
  is_primary_contact: boolean;
  invited_rehearsal_dinner: boolean;
  attending_wedding: boolean | null;
  attending_rehearsal: boolean | null;
  meal_preference: string;
  dietary_notes: string;
  plus_one_name: string;
  // For PLACEHOLDER_UNKNOWN seats only: "adult" | "child", chosen at RSVP time.
  plus_one_type: string;
}

// Logical steps. Rehearsal and meals are conditionally skipped, but we keep
// stable numeric ids and compute the visible sequence so the progress bar and
// next/back navigation stay correct regardless of which steps apply.
const SEARCH = 1;
const PARTY = 2;
const RSVP = 3;
const REHEARSAL = 4;
const MEALS = 5;
const NOTES = 6;
const CONFIRM = 7;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function RsvpForm() {
  const [step, setStep] = useState(SEARCH);
  const [direction, setDirection] = useState(1);
  const [household, setHousehold] = useState<Household | null>(null);
  const [guestData, setGuestData] = useState<GuestRsvpData[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const anyRehearsalInvited = guestData.some((g) => g.invited_rehearsal_dinner);
  // Infants don't need a meal, so the meal step only applies if a non-infant is attending.
  const anyNeedsMeal = guestData.some(
    (g) => g.attending_wedding === true && g.guest_type !== "infant"
  );

  // The ordered list of steps that actually apply to this party.
  const sequence = useMemo(() => {
    const s = [SEARCH, PARTY, RSVP];
    if (anyRehearsalInvited) s.push(REHEARSAL);
    if (anyNeedsMeal) s.push(MEALS);
    s.push(NOTES, CONFIRM);
    return s;
  }, [anyRehearsalInvited, anyNeedsMeal]);

  const goTo = (target: number, dir: number) => {
    setDirection(dir);
    setStep(target);
  };

  const goNext = () => {
    const i = sequence.indexOf(step);
    if (i >= 0 && i < sequence.length - 1) goTo(sequence[i + 1], 1);
  };

  const goBack = () => {
    const i = sequence.indexOf(step);
    if (i > 0) goTo(sequence[i - 1], -1);
  };

  const primaryGuestId =
    guestData.find((g) => g.is_primary_contact)?.guest_id ?? guestData[0]?.guest_id;

  const handleHouseholdFound = (
    foundHousehold: Household,
    guests: Guest[],
    rsvps: Rsvp[]
  ) => {
    const byId = new Map(rsvps.map((r) => [r.guest_id, r]));
    setHousehold(foundHousehold);
    setGuestData(
      guests.map((g) => {
        const existing = byId.get(g.guest_id);
        return {
          guest_id: g.guest_id,
          display_name: g.display_name,
          name_status: g.name_status,
          guest_type: g.guest_type,
          is_primary_contact: g.is_primary_contact,
          invited_rehearsal_dinner: g.invited_rehearsal_dinner,
          attending_wedding: existing?.attending_wedding ?? null,
          attending_rehearsal: existing?.attending_rehearsal ?? null,
          meal_preference: existing?.meal_preference ?? "",
          dietary_notes: existing?.dietary_notes ?? "",
          plus_one_name:
            existing?.plus_one_name ??
            (g.name_status === "PLACEHOLDER_UNKNOWN" ? "" : g.display_name),
          plus_one_type:
            g.name_status === "PLACEHOLDER_UNKNOWN"
              ? existing?.plus_one_type ??
                (g.guest_type === "child" || g.guest_type === "toddler"
                  ? "child"
                  : "adult")
              : "",
        };
      })
    );
    // Prefill contact/note from the primary's existing response, if any.
    const primary = guests.find((g) => g.is_primary_contact) ?? guests[0];
    const primaryRsvp = primary ? byId.get(primary.guest_id) : undefined;
    setEmail(primaryRsvp?.rsvp_email ?? "");
    setPhone(primaryRsvp?.rsvp_phone ?? "");
    setNote(primaryRsvp?.notes ?? "");
    goTo(PARTY, 1);
  };

  const updateGuest = (id: string, updates: Partial<GuestRsvpData>) => {
    setGuestData((prev) =>
      prev.map((g) => (g.guest_id === id ? { ...g, ...updates } : g))
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_guest_id: primaryGuestId,
          email: email.trim() || null,
          phone: phone.trim() || null,
          note: note.trim() || null,
          guests: guestData.map((g) => ({
            guest_id: g.guest_id,
            attending_wedding: g.attending_wedding,
            attending_rehearsal: g.invited_rehearsal_dinner ? g.attending_rehearsal : null,
            meal_preference:
              g.attending_wedding && g.guest_type !== "infant"
                ? g.meal_preference || null
                : null,
            dietary_notes: g.dietary_notes || null,
            plus_one_name:
              g.name_status === "PLACEHOLDER_UNKNOWN" ? g.plus_one_name || null : null,
            plus_one_type:
              g.name_status === "PLACEHOLDER_UNKNOWN" ? g.plus_one_type || null : null,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      goTo(CONFIRM, 1);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Progress: position within the applicable steps, excluding the final confirm.
  const stepsBeforeConfirm = sequence.length - 1;
  const currentIndex = sequence.indexOf(step) + 1;

  return (
    <div className="mx-auto max-w-2xl">
      {step !== CONFIRM && (
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-warm-gray">
              Step {currentIndex} of {stepsBeforeConfirm}
            </span>
            <span className="font-sans text-xs text-warm-gray">
              {Math.round((currentIndex / stepsBeforeConfirm) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-linen">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / stepsBeforeConfirm) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>
      )}

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
          {step === SEARCH && <StepSearch onHouseholdFound={handleHouseholdFound} />}

          {step === PARTY && household && (
            <StepParty
              household={household}
              guests={guestData}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === RSVP && (
            <StepRsvp
              guests={guestData}
              updateGuest={updateGuest}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === REHEARSAL && (
            <StepRehearsal
              guests={guestData}
              updateGuest={updateGuest}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === MEALS && (
            <StepMeals
              guests={guestData.filter(
                (g) => g.attending_wedding === true && g.guest_type !== "infant"
              )}
              updateGuest={updateGuest}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === NOTES && (
            <StepNotes
              guests={guestData}
              email={email}
              phone={phone}
              note={note}
              setEmail={setEmail}
              setPhone={setPhone}
              setNote={setNote}
              onSubmit={handleSubmit}
              onBack={goBack}
              submitting={submitting}
            />
          )}

          {step === CONFIRM && (
            <StepConfirmation
              guests={guestData}
              searchName={household?.search_name ?? ""}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
