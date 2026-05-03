"use client";

import { motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import Link from "next/link";
import type { GuestRsvpData } from "./RsvpForm";

interface StepConfirmationProps {
  guests: GuestRsvpData[];
  partyName: string;
}

export default function StepConfirmation({
  guests,
  partyName,
}: StepConfirmationProps) {
  const anyAccepted = guests.some((g) => g.rsvp_status === "accepted");

  return (
    <div className="text-center">
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage"
      >
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="mt-8 font-serif text-3xl text-charcoal sm:text-4xl">
          {anyAccepted ? "We Can't Wait to See You!" : "We'll Miss You!"}
        </h2>

        <div className="divider-gold mt-2" />

        {anyAccepted ? (
          <p className="mt-4 font-serif text-lg text-charcoal-light">
            Thank you, {partyName}! Your RSVP has been received. We&apos;re so
            excited to celebrate with you in August!
          </p>
        ) : (
          <p className="mt-4 font-serif text-lg text-charcoal-light">
            Thank you for letting us know, {partyName}. We&apos;ll miss you!
            You&apos;ll be in our hearts on our special day.
          </p>
        )}
      </motion.div>

      {/* RSVP Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mx-auto mt-8 max-w-sm"
      >
        <div className="rounded-lg border border-linen bg-white p-6">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-gray">
            Your Response
          </p>
          <div className="mt-4 space-y-2">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-charcoal">
                  {guest.first_name} {guest.last_name}
                </span>
                <span
                  className={
                    guest.rsvp_status === "accepted"
                      ? "font-medium text-sage"
                      : "text-warm-gray"
                  }
                >
                  {guest.rsvp_status === "accepted"
                    ? "Attending"
                    : "Not Attending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <Heart className="h-5 w-5 text-gold" />
        <Link
          href="/"
          className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-sage transition-colors hover:text-gold"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
