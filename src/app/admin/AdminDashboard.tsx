"use client";

import { useState } from "react";
import {
  Lock,
  Loader2,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Wine,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import type { Guest, Household, Rsvp } from "@/lib/database.types";
import { ADULT_ENTREES, KIDS_MEALS } from "@/lib/constants";
import ChecklistTab from "@/components/admin/ChecklistTab";

type Tab = "rsvps" | "checklist";

type AdminData = {
  households: Household[];
  guests: Guest[];
  rsvps: Rsvp[];
  demo?: boolean;
  dbError?: boolean;
  detail?: string;
};

const MEAL_LABELS: Record<string, string> = Object.fromEntries(
  [...ADULT_ENTREES, ...KIDS_MEALS].map((m) => [m.value, m.label])
);

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<Tab>("rsvps");

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/rsvps", {
        headers: { "x-admin-password": password.trim() },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Incorrect password.");
        } else {
          const body = await res.json().catch(() => ({}));
          setError(
            `Server error (${res.status}): ${body.detail ?? body.error ?? "unknown"}`
          );
        }
        return;
      }

      const json = await res.json();
      setData(json);
      setAuthenticated(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    if (!data) return;
    const rsvpById = new Map(data.rsvps.map((r) => [r.guest_id, r]));
    const householdById = new Map(data.households.map((h) => [h.household_id, h]));

    const headers = [
      "Guest",
      "Household",
      "Side",
      "Type",
      "Wedding",
      "Meal",
      "Rehearsal Invited",
      "Rehearsal",
      "Dietary",
      "Plus-One Name",
      "Email",
      "Phone",
      "Notes",
      "Responded At",
    ];

    const rows = data.guests.map((g) => {
      const r = rsvpById.get(g.guest_id);
      const household = householdById.get(g.household_id);
      const weddingStatus =
        r?.attending_wedding == null
          ? "pending"
          : r.attending_wedding
            ? "accepted"
            : "declined";
      const rehearsalStatus = !g.invited_rehearsal_dinner
        ? ""
        : r?.attending_rehearsal == null
          ? "pending"
          : r.attending_rehearsal
            ? "accepted"
            : "declined";
      return [
        g.display_name,
        household?.search_name ?? "",
        g.side ?? "",
        g.guest_type,
        weddingStatus,
        r?.meal_preference ? MEAL_LABELS[r.meal_preference] ?? r.meal_preference : "",
        g.invited_rehearsal_dinner ? "yes" : "no",
        rehearsalStatus,
        r?.dietary_notes ?? "",
        r?.plus_one_name ?? "",
        r?.rsvp_email ?? "",
        r?.rsvp_phone ?? "",
        r?.notes ?? "",
        r?.updated_at ?? "",
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvp-responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10">
            <Lock className="h-6 w-6 text-sage" />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-charcoal">Admin Access</h1>
          <p className="mt-2 font-sans text-sm text-charcoal-light">
            Enter the admin password to view RSVPs.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="mt-6"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-linen bg-white px-4 py-3 text-center font-sans text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
              autoFocus
            />
            {error && (
              <p className="mt-2 font-sans text-sm text-red-500">{error}</p>
            )}
            <button type="submit" className="btn-primary mt-4 w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-2xl text-charcoal sm:text-3xl">
              Wedding Admin
            </h1>
            {data?.demo && (
              <span className="mt-1 inline-block rounded-full bg-gold/10 px-3 py-1 font-sans text-xs font-medium text-gold">
                Demo Mode
              </span>
            )}
          </div>
          {tab === "rsvps" && (
            <button
              onClick={exportCsv}
              className="btn-outline flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>

        {data?.dbError && (
          <div className="mt-4 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 font-sans text-sm text-charcoal-light">
            Couldn&apos;t reach the database, so the RSVP list is empty and the
            checklist is saving to this device only. Everything else works — once
            Supabase is connected it&apos;ll sync automatically.
          </div>
        )}

        <div className="mt-6 flex gap-1 border-b border-linen">
          <TabButton
            active={tab === "rsvps"}
            onClick={() => setTab("rsvps")}
            icon={<ClipboardList className="h-4 w-4" />}
            label="RSVPs"
          />
          <TabButton
            active={tab === "checklist"}
            onClick={() => setTab("checklist")}
            icon={<ListChecks className="h-4 w-4" />}
            label="Checklist"
          />
        </div>

        {tab === "checklist" ? (
          <div className="mt-8">
            <ChecklistTab password={password} />
          </div>
        ) : (
          <RsvpPanel data={data} />
        )}
      </div>
    </div>
  );
}

function RsvpPanel({ data }: { data: AdminData | null }) {
  const guests = data?.guests ?? [];
  const households = data?.households ?? [];
  const rsvps = data?.rsvps ?? [];

  const rsvpById = new Map(rsvps.map((r) => [r.guest_id, r]));
  const householdById = new Map(households.map((h) => [h.household_id, h]));

  const statusOf = (g: Guest): "accepted" | "declined" | "pending" => {
    const r = rsvpById.get(g.guest_id);
    if (!r || r.attending_wedding == null) return "pending";
    return r.attending_wedding ? "accepted" : "declined";
  };

  const accepted = guests.filter((g) => statusOf(g) === "accepted");
  const declined = guests.filter((g) => statusOf(g) === "declined");
  const pending = guests.filter((g) => statusOf(g) === "pending");
  const responded = guests.filter((g) => rsvpById.has(g.guest_id));

  // Rehearsal dinner tallies.
  const rehearsalInvited = guests.filter((g) => g.invited_rehearsal_dinner);
  const rehearsalYes = rehearsalInvited.filter(
    (g) => rsvpById.get(g.guest_id)?.attending_rehearsal === true
  );

  // Meal counts among attending guests.
  const mealCounts = new Map<string, number>();
  for (const g of accepted) {
    const meal = rsvpById.get(g.guest_id)?.meal_preference;
    if (meal) mealCounts.set(meal, (mealCounts.get(meal) ?? 0) + 1);
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-sage" />}
          label="Total Guests"
          value={guests.length}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-sage" />}
          label="Accepted"
          value={accepted.length}
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-charcoal-light" />}
          label="Declined"
          value={declined.length}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-gold" />}
          label="Pending"
          value={pending.length}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Response Rate */}
        <div className="rounded-lg border border-linen bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm font-medium text-charcoal">
              Response Rate
            </span>
            <span className="font-sans text-sm font-semibold text-sage">
              {guests.length > 0
                ? Math.round((responded.length / guests.length) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-linen">
            <div
              className="h-full bg-sage transition-all"
              style={{
                width: `${guests.length > 0 ? (responded.length / guests.length) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 font-sans text-xs text-warm-gray">
            {responded.length} of {guests.length} guests have responded
          </p>
        </div>

        {/* Rehearsal + meals summary */}
        <div className="rounded-lg border border-linen bg-white p-5">
          <div className="flex items-center gap-2">
            <Wine className="h-4 w-4 text-gold" />
            <span className="font-sans text-sm font-medium text-charcoal">
              Rehearsal Dinner
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-warm-gray">
            {rehearsalYes.length} attending of {rehearsalInvited.length} invited
          </p>
          {mealCounts.size > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {Array.from(mealCounts.entries()).map(([meal, count]) => (
                <span key={meal} className="font-sans text-xs text-charcoal-light">
                  <span className="font-semibold text-charcoal">{count}</span>{" "}
                  {MEAL_LABELS[meal] ?? meal}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-lg border border-linen bg-white">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-linen bg-ivory">
              {["Guest", "Household", "Wedding", "Meal", "Rehearsal", "Dietary", "Contact"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-linen">
            {guests.map((guest) => {
              const r = rsvpById.get(guest.guest_id);
              const household = householdById.get(guest.household_id);
              const name =
                guest.name_status === "PLACEHOLDER_UNKNOWN" && r?.plus_one_name
                  ? `${r.plus_one_name} (plus-one)`
                  : guest.display_name;
              const contact = [r?.rsvp_email, r?.rsvp_phone]
                .filter(Boolean)
                .join(" · ");
              return (
                <tr key={guest.guest_id} className="hover:bg-ivory/50">
                  <td className="px-4 py-3 font-sans text-sm text-charcoal">
                    {name}
                    {guest.guest_type !== "adult" && (
                      <span className="ml-1.5 text-xs text-warm-gray">
                        ({guest.guest_type})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                    {household?.search_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={statusOf(guest)} />
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                    {r?.meal_preference
                      ? MEAL_LABELS[r.meal_preference] ?? r.meal_preference
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                    {!guest.invited_rehearsal_dinner
                      ? "—"
                      : r?.attending_rehearsal == null
                        ? "pending"
                        : r.attending_rehearsal
                          ? "Yes"
                          : "No"}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                    {r?.dietary_notes ?? "—"}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-sans text-sm text-charcoal-light">
                    {contact || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 font-sans text-sm font-medium transition-colors ${
        active
          ? "border-sage text-sage"
          : "border-transparent text-warm-gray hover:text-charcoal"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-linen bg-white p-5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-sans text-xs uppercase tracking-wider text-warm-gray">
          {label}
        </span>
      </div>
      <p className="mt-2 font-serif text-3xl text-charcoal">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    accepted: "bg-sage/10 text-sage",
    declined: "bg-charcoal-light/10 text-charcoal-light",
    pending: "bg-gold/10 text-gold",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-medium capitalize ${styles[status as keyof typeof styles] ?? styles.pending}`}
    >
      {status}
    </span>
  );
}
