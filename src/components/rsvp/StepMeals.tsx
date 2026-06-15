"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ADULT_ENTREES, KIDS_MEALS, SHARED_SIDES } from "@/lib/constants";
import type { GuestRsvpData } from "./RsvpForm";

interface StepMealsProps {
  guests: GuestRsvpData[]; // already filtered to attending, non-infant guests
  updateGuest: (id: string, updates: Partial<GuestRsvpData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const isKid = (g: GuestRsvpData) =>
  g.guest_type === "child" || g.guest_type === "toddler";

export default function StepMeals({
  guests,
  updateGuest,
  onNext,
  onBack,
}: StepMealsProps) {
  const [error, setError] = useState("");

  const nameFor = (g: GuestRsvpData) =>
    g.name_status === "PLACEHOLDER_UNKNOWN"
      ? g.plus_one_name.trim() || "Your guest"
      : g.display_name;

  const handleContinue = () => {
    if (guests.some((g) => !g.meal_preference)) {
      setError("Please choose a meal for each guest before continuing.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
          Dinner Selection
        </h2>
        <p className="mt-2 font-sans text-sm text-charcoal-light">
          Please choose an entrée for each guest.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {guests.map((guest) => {
          const options = isKid(guest) ? KIDS_MEALS : ADULT_ENTREES;
          return (
            <div key={guest.guest_id}>
              <p className="font-serif text-lg text-charcoal">
                {nameFor(guest)}
                {isKid(guest) && (
                  <span className="ml-2 font-sans text-xs uppercase tracking-[0.15em] text-warm-gray">
                    Kids&apos; menu
                  </span>
                )}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                {options.map((meal) => (
                  <button
                    key={meal.value}
                    onClick={() =>
                      updateGuest(guest.guest_id, { meal_preference: meal.value })
                    }
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all",
                      guest.meal_preference === meal.value
                        ? "border-gold bg-gold/5 shadow-gold"
                        : "border-linen bg-white hover:border-gold/40"
                    )}
                  >
                    <span className="block font-sans text-sm font-medium text-charcoal">
                      {meal.label}
                    </span>
                    {meal.description && (
                      <span className="mt-1 block font-sans text-sm text-warm-gray sm:text-xs">
                        {meal.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared sides — informational, served to everyone. */}
      <div className="mt-8 rounded-lg border border-linen bg-ivory/60 p-5 text-center">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-gray">
          Served family-style for all
        </p>
        <p className="mt-2 font-serif text-base text-charcoal-light">
          {SHARED_SIDES.join(" · ")}
        </p>
      </div>

      {error && (
        <p className="mt-4 text-center font-sans text-sm text-red-500">{error}</p>
      )}

      <div className="mt-10 flex items-center justify-center gap-4">
        <button onClick={onBack} className="btn-outline">
          Back
        </button>
        <button onClick={handleContinue} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}
