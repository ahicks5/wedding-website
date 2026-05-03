"use client";

import { Users } from "lucide-react";
import type { Party } from "@/lib/database.types";
import type { GuestRsvpData } from "./RsvpForm";

interface StepPartyProps {
  party: Party;
  guests: GuestRsvpData[];
  onNext: () => void;
  onBack: () => void;
}

export default function StepParty({
  party,
  guests,
  onNext,
  onBack,
}: StepPartyProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10">
        <Users className="h-6 w-6 text-sage" />
      </div>

      <h2 className="mt-5 font-serif text-3xl text-charcoal sm:text-4xl">
        {party.party_name}
      </h2>
      <p className="mt-2 font-sans text-sm text-charcoal-light">
        We found your party! Please confirm these are the right guests.
      </p>

      {/* Guest List */}
      <div className="mt-8 space-y-3">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="rounded-lg border border-linen bg-white px-5 py-4 text-left"
          >
            <span className="font-serif text-lg text-charcoal">
              {guest.first_name} {guest.last_name}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button onClick={onBack} className="btn-outline">
          Not Me
        </button>
        <button onClick={onNext} className="btn-primary">
          That&apos;s Us!
        </button>
      </div>
    </div>
  );
}
