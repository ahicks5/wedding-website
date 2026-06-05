"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Loader2,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import type { Guest, Party } from "@/lib/database.types";
import ChecklistTab from "@/components/admin/ChecklistTab";

type Tab = "rsvps" | "checklist";

type AdminData = {
  guests: Guest[];
  parties: Party[];
  demo?: boolean;
};

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
        headers: { "x-admin-password": password },
      });

      if (!res.ok) {
        setError("Incorrect password.");
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

  // Admin auth is temporarily disabled — load the dashboard automatically so
  // /admin opens without a password. Restore the login gate by re-enabling
  // ADMIN_AUTH_DISABLED in the admin API routes and removing this effect.
  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportCsv = () => {
    if (!data) return;

    const headers = [
      "First Name",
      "Last Name",
      "Party",
      "RSVP Status",
      "Meal Choice",
      "Dietary Restrictions",
      "Notes",
      "Responded At",
    ];

    const rows = data.guests.map((g) => {
      const party = data.parties.find((p) => p.id === g.party_id);
      return [
        g.first_name,
        g.last_name,
        party?.party_name ?? "",
        g.rsvp_status,
        g.meal_choice ?? "",
        g.dietary_restrictions ?? "",
        g.notes ?? "",
        g.responded_at ?? "",
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
          <h1 className="mt-5 font-serif text-3xl text-charcoal">
            Admin Access
          </h1>
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
            <button
              type="submit"
              className="btn-primary mt-4 w-full"
              disabled={loading}
            >
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
    <div className="min-h-screen bg-ivory pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl text-charcoal">
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

        {/* Tabs */}
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
  const parties = data?.parties ?? [];

  const accepted = guests.filter((g) => g.rsvp_status === "accepted");
  const declined = guests.filter((g) => g.rsvp_status === "declined");
  const pending = guests.filter((g) => g.rsvp_status === "pending");
  const responded = guests.filter((g) => g.responded_at);

  return (
    <>
      {/* Stats */}
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

        {/* Response Rate */}
        <div className="mt-6 rounded-lg border border-linen bg-white p-5">
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

        {/* Table */}
        <div className="mt-8 overflow-x-auto rounded-lg border border-linen bg-white">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-linen bg-ivory">
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Guest
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Party
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Meal
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Dietary
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {guests.map((guest) => {
                const party = parties.find((p) => p.id === guest.party_id);
                return (
                  <tr key={guest.id} className="hover:bg-ivory/50">
                    <td className="px-4 py-3 font-sans text-sm text-charcoal">
                      {guest.first_name} {guest.last_name}
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                      {party?.party_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={guest.rsvp_status} />
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                      {guest.meal_choice ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-charcoal-light">
                      {guest.dietary_restrictions ?? "—"}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 font-sans text-sm text-charcoal-light">
                      {guest.notes ?? "—"}
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
    accepted:
      "bg-sage/10 text-sage",
    declined:
      "bg-charcoal-light/10 text-charcoal-light",
    pending:
      "bg-gold/10 text-gold",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-medium capitalize ${styles[status as keyof typeof styles] ?? styles.pending}`}
    >
      {status}
    </span>
  );
}
