"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import type { Guest, Household, Rsvp } from "@/lib/database.types";

interface GuestResult {
  guest_id: string;
  display_name: string;
  household_id: number;
}

interface StepSearchProps {
  onHouseholdFound: (household: Household, guests: Guest[], rsvps: Rsvp[]) => void;
}

export default function StepSearch({ onHouseholdFound }: StepSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GuestResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/households/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectGuest = async (guest: GuestResult) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/households/${guest.household_id}`);
      if (!res.ok) throw new Error("Household not found");
      const data = await res.json();
      onHouseholdFound(data.household, data.guests, data.rsvps ?? []);
    } catch {
      setError("Could not find your invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
        Find Your Invitation
      </h2>
      <p className="mt-3 font-sans text-sm text-charcoal-light">
        Search for the name on your invitation to get started.
      </p>

      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-gray" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your first or last name..."
          className="w-full rounded-lg border border-linen bg-white py-4 pl-12 pr-4 font-sans text-sm text-charcoal outline-none transition-colors placeholder:text-warm-gray/60 focus:border-sage focus:ring-2 focus:ring-sage/20"
          autoFocus
        />
        {searching && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-sage" />
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-lg border border-linen bg-white text-left shadow-soft">
          {results.map((g) => (
            <button
              key={g.guest_id}
              onClick={() => selectGuest(g)}
              disabled={loading}
              className="flex w-full items-center justify-between px-5 py-4 font-sans text-sm text-charcoal transition-colors hover:bg-ivory disabled:opacity-50"
            >
              <span>{g.display_name}</span>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-sage" />
              ) : (
                <span className="text-xs text-sage">Select</span>
              )}
            </button>
          ))}
        </div>
      )}

      {query.length >= 2 && !searching && results.length === 0 && (
        <p className="mt-4 font-sans text-sm text-warm-gray">
          No invitation found under that name. Try the other person&apos;s name on
          your invitation, or check the spelling.
        </p>
      )}

      {error && <p className="mt-4 font-sans text-sm text-red-500">{error}</p>}
    </div>
  );
}
