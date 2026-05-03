"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import type { Guest, Party } from "@/lib/database.types";

interface SearchResult {
  id: string;
  first_name: string;
  last_name: string;
  party_id: string;
}

interface StepSearchProps {
  onPartyFound: (party: Party, guests: Guest[]) => void;
}

export default function StepSearch({ onPartyFound }: StepSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
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
          `/api/guests/search?q=${encodeURIComponent(query)}`
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

  const selectGuest = async (guest: SearchResult) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/guests/party/${guest.party_id}`);
      if (!res.ok) throw new Error("Party not found");
      const data = await res.json();
      onPartyFound(data.party, data.guests);
    } catch {
      setError("Could not find your party. Please try again.");
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
        Search for your name to get started.
      </p>

      {/* Search Input */}
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

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-lg border border-linen bg-white text-left shadow-soft">
          {results.map((guest) => (
            <button
              key={guest.id}
              onClick={() => selectGuest(guest)}
              disabled={loading}
              className="flex w-full items-center justify-between px-5 py-4 font-sans text-sm text-charcoal transition-colors hover:bg-ivory disabled:opacity-50"
            >
              <span>
                {guest.first_name} {guest.last_name}
              </span>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-sage" />
              ) : (
                <span className="text-xs text-sage">Select</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {query.length >= 2 && !searching && results.length === 0 && (
        <p className="mt-4 font-sans text-sm text-warm-gray">
          No guests found. Please check the spelling or try a different name.
        </p>
      )}

      {error && (
        <p className="mt-4 font-sans text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
