"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RsvpStatus } from "@/lib/database.types";
import type { GuestRsvpData } from "./RsvpForm";

interface StepRsvpProps {
  guests: GuestRsvpData[];
  updateGuest: (id: string, updates: Partial<GuestRsvpData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepRsvp({
  guests,
  updateGuest,
  onNext,
  onBack,
}: StepRsvpProps) {
  const toggleStatus = (id: string, status: RsvpStatus) => {
    updateGuest(id, { rsvp_status: status });
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
          Will You Be Joining Us?
        </h2>
        <p className="mt-2 font-sans text-sm text-charcoal-light">
          Please RSVP for each guest in your party.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="rounded-lg border border-linen bg-white p-5"
          >
            <p className="font-serif text-lg text-charcoal">
              {guest.first_name} {guest.last_name}
            </p>
            <div className="mt-3 flex gap-2 sm:gap-3">
              <button
                onClick={() => toggleStatus(guest.id, "accepted")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-3 font-sans text-xs font-medium transition-all sm:gap-2 sm:text-sm",
                  guest.rsvp_status === "accepted"
                    ? "border-sage bg-sage text-white"
                    : "border-linen bg-white text-charcoal-light hover:border-sage/50"
                )}
              >
                <Check className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">Accepts</span>
                <span className="hidden sm:inline">Joyfully Accepts</span>
              </button>
              <button
                onClick={() => toggleStatus(guest.id, "declined")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-3 font-sans text-xs font-medium transition-all sm:gap-2 sm:text-sm",
                  guest.rsvp_status === "declined"
                    ? "border-charcoal-light bg-charcoal-light text-white"
                    : "border-linen bg-white text-charcoal-light hover:border-charcoal-light/50"
                )}
              >
                <X className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">Declines</span>
                <span className="hidden sm:inline">Regretfully Declines</span>
              </button>
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
