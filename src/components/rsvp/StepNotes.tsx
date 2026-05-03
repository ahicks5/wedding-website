"use client";

import { Loader2 } from "lucide-react";
import type { GuestRsvpData } from "./RsvpForm";

interface StepNotesProps {
  guests: GuestRsvpData[];
  updateGuest: (id: string, updates: Partial<GuestRsvpData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

export default function StepNotes({
  guests,
  updateGuest,
  onSubmit,
  onBack,
  submitting,
}: StepNotesProps) {
  // Show one combined dietary/notes section per guest
  const attendingGuests = guests.filter((g) => g.rsvp_status === "accepted");
  const allDeclining = attendingGuests.length === 0;

  return (
    <div>
      <div className="text-center">
        <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
          {allDeclining ? "Any Notes?" : "Dietary Needs & Notes"}
        </h2>
        <p className="mt-2 font-sans text-sm text-charcoal-light">
          {allDeclining
            ? "Anything you'd like us to know?"
            : "Let us know about any allergies, restrictions, or anything else."}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {!allDeclining &&
          attendingGuests.map((guest) => (
            <div key={guest.id}>
              <p className="font-serif text-lg text-charcoal">
                {guest.first_name} {guest.last_name}
              </p>
              <input
                type="text"
                placeholder="Dietary restrictions (e.g., nut allergy, vegan)..."
                value={guest.dietary_restrictions}
                onChange={(e) =>
                  updateGuest(guest.id, {
                    dietary_restrictions: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-linen bg-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition-colors placeholder:text-warm-gray/60 focus:border-sage focus:ring-2 focus:ring-sage/20"
              />
            </div>
          ))}

        {/* Shared notes field */}
        <div>
          <label className="block font-sans text-sm font-medium text-charcoal">
            Anything else you&apos;d like to share?
          </label>
          <textarea
            placeholder="Song requests, well wishes, special needs..."
            value={guests[0]?.notes ?? ""}
            onChange={(e) => {
              // Apply note to the first guest (party-level note)
              if (guests[0]) {
                updateGuest(guests[0].id, { notes: e.target.value });
              }
            }}
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-linen bg-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition-colors placeholder:text-warm-gray/60 focus:border-sage focus:ring-2 focus:ring-sage/20"
          />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button onClick={onBack} className="btn-outline" disabled={submitting}>
          Back
        </button>
        <button
          onClick={onSubmit}
          className="btn-primary"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit RSVP"
          )}
        </button>
      </div>
    </div>
  );
}
