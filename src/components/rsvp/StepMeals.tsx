"use client";

import { cn } from "@/lib/utils";
import type { GuestRsvpData } from "./RsvpForm";

// TODO: Update with actual menu options from caterer
const MEAL_OPTIONS = [
  { value: "Beef", label: "Filet Mignon", description: "Herb-crusted beef tenderloin" },
  { value: "Salmon", label: "Pan-Seared Salmon", description: "Atlantic salmon with lemon butter" },
  { value: "Chicken", label: "Herb Roasted Chicken", description: "Free-range chicken with rosemary" },
  { value: "Vegetarian", label: "Vegetarian", description: "Seasonal vegetable risotto" },
];

interface StepMealsProps {
  guests: GuestRsvpData[];
  updateGuest: (id: string, updates: Partial<GuestRsvpData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepMeals({
  guests,
  updateGuest,
  onNext,
  onBack,
}: StepMealsProps) {
  return (
    <div>
      <div className="text-center">
        <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
          Dinner Selection
        </h2>
        <p className="mt-2 font-sans text-sm text-charcoal-light">
          Please choose a meal for each attending guest.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {guests.map((guest) => (
          <div key={guest.id}>
            <p className="font-serif text-lg text-charcoal">
              {guest.first_name} {guest.last_name}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {MEAL_OPTIONS.map((meal) => (
                <button
                  key={meal.value}
                  onClick={() =>
                    updateGuest(guest.id, { meal_choice: meal.value })
                  }
                  className={cn(
                    "rounded-lg border p-4 text-left transition-all",
                    guest.meal_choice === meal.value
                      ? "border-gold bg-gold/5 shadow-gold"
                      : "border-linen bg-white hover:border-gold/40"
                  )}
                >
                  <span className="block font-sans text-sm font-medium text-charcoal">
                    {meal.label}
                  </span>
                  <span className="mt-1 block font-sans text-sm text-warm-gray sm:text-xs">
                    {meal.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button onClick={onBack} className="btn-outline">
          Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}
