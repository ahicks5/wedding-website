"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Loader2,
  StickyNote,
  CalendarCheck,
} from "lucide-react";
import {
  CHECKLIST,
  CHECKLIST_TOTAL,
  parseTag,
  type ChecklistSection,
} from "@/lib/checklist-data";

type ItemState = { checked: boolean; notes: string };
type StateMap = Record<string, ItemState>;

const LOCAL_KEY = "wedding-checklist-state";

function loadLocal(): StateMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as StateMap) : {};
  } catch {
    return {};
  }
}

function saveLocal(state: StateMap) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export default function ChecklistTab({ password }: { password: string }) {
  const [state, setState] = useState<StateMap>({});
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Load saved state once on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/checklist", {
          headers: { "x-admin-password": password },
        });
        const json = await res.json();
        if (!active) return;

        if (json.demo) {
          setDemo(true);
          setState(loadLocal());
        } else {
          setState(json.items ?? {});
        }
      } catch {
        // Network fell over — still let them work locally.
        if (active) {
          setDemo(true);
          setState(loadLocal());
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [password]);

  const itemState = useCallback(
    (id: string): ItemState => state[id] ?? { checked: false, notes: "" },
    [state]
  );

  // Persist a single item: optimistic local update, then sync.
  const persist = useCallback(
    (id: string, next: ItemState) => {
      setState((prev) => {
        const updated = { ...prev, [id]: next };
        if (demo) saveLocal(updated);
        return updated;
      });

      if (!demo) {
        fetch("/api/admin/checklist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify({
            item_id: id,
            checked: next.checked,
            notes: next.notes,
          }),
        }).catch(() => {
          /* best-effort; local state already updated */
        });
      }
    },
    [demo, password]
  );

  const toggle = useCallback(
    (id: string) => {
      const current = itemState(id);
      persist(id, { ...current, checked: !current.checked });
    },
    [itemState, persist]
  );

  const setNote = useCallback(
    (id: string, notes: string) => {
      const current = itemState(id);
      persist(id, { ...current, notes });
    },
    [itemState, persist]
  );

  const completedCount = useMemo(
    () => Object.values(state).filter((s) => s.checked).length,
    [state]
  );
  const pct =
    CHECKLIST_TOTAL > 0
      ? Math.round((completedCount / CHECKLIST_TOTAL) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div>
      {/* Overall progress */}
      <div className="rounded-2xl border border-linen bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-sage" />
              <h2 className="font-serif text-2xl text-charcoal">
                Wedding To-Do List
              </h2>
            </div>
            <p className="mt-1 font-sans text-sm text-warm-gray">
              From your Mockingbird Lane planning checklist.
              {demo && " Saved on this device until the database is connected."}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl text-charcoal">
              {completedCount}
              <span className="text-warm-gray">/{CHECKLIST_TOTAL}</span>
            </p>
            <p className="font-sans text-xs uppercase tracking-wider text-warm-gray">
              {pct}% complete
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-linen">
          <motion.div
            className="h-full rounded-full bg-sage"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-4">
        {CHECKLIST.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            itemState={itemState}
            onToggle={toggle}
            onNote={setNote}
            collapsed={!!collapsed[section.id]}
            onToggleCollapse={() =>
              setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  itemState,
  onToggle,
  onNote,
  collapsed,
  onToggleCollapse,
}: {
  section: ChecklistSection;
  itemState: (id: string) => ItemState;
  onToggle: (id: string) => void;
  onNote: (id: string, notes: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const done = section.items.filter((i) => itemState(i.id).checked).length;
  const total = section.items.length;
  const complete = done === total;

  return (
    <div className="overflow-hidden rounded-2xl border border-linen bg-white shadow-sm">
      <button
        onClick={onToggleCollapse}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ivory/60"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg text-charcoal">
              {section.timing}
            </h3>
            {section.note && (
              <span className="rounded-full bg-gold/10 px-2.5 py-0.5 font-sans text-xs font-medium text-gold-dark">
                {section.note}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`font-sans text-sm font-semibold ${
              complete ? "text-sage" : "text-warm-gray"
            }`}
          >
            {done}/{total}
          </span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-linen sm:w-24">
            <div
              className="h-full rounded-full bg-sage transition-all duration-500"
              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <ChevronDown
            className={`h-5 w-5 text-warm-gray transition-transform duration-300 ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="divide-y divide-linen border-t border-linen">
              {section.items.map((item) => (
                <ChecklistRow
                  key={item.id}
                  text={item.text}
                  state={itemState(item.id)}
                  onToggle={() => onToggle(item.id)}
                  onNote={(notes) => onNote(item.id, notes)}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChecklistRow({
  text,
  state,
  onToggle,
  onNote,
}: {
  text: string;
  state: ItemState;
  onToggle: () => void;
  onNote: (notes: string) => void;
}) {
  const { tag, text: label } = parseTag(text);
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState(state.notes);

  // Keep the local draft in sync if state arrives/changes from outside.
  useEffect(() => {
    setDraft(state.notes);
  }, [state.notes]);

  const hasNote = state.notes.trim().length > 0;

  return (
    <li className="px-5 py-3 transition-colors hover:bg-ivory/40">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          role="checkbox"
          aria-checked={state.checked}
          aria-label={state.checked ? "Mark as not done" : "Mark as done"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
            state.checked
              ? "border-sage bg-sage text-white"
              : "border-warm-gray/40 bg-white hover:border-sage"
          }`}
        >
          {state.checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {tag && (
              <span
                className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide ${
                  tag === "Bride"
                    ? "bg-blush/50 text-sage-dark"
                    : "bg-sage/15 text-sage-dark"
                }`}
              >
                {tag}
              </span>
            )}
            <span
              className={`font-sans text-sm leading-snug transition-colors ${
                state.checked
                  ? "text-warm-gray line-through"
                  : "text-charcoal"
              }`}
            >
              {label}
            </span>
          </div>

          {/* Existing note preview (when collapsed) */}
          {hasNote && !noteOpen && (
            <p className="mt-1 whitespace-pre-wrap rounded-md bg-ivory px-2.5 py-1.5 font-sans text-xs italic text-charcoal-light">
              {state.notes}
            </p>
          )}

          {/* Note editor */}
          {noteOpen && (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                if (draft !== state.notes) onNote(draft);
                setNoteOpen(false);
              }}
              autoFocus
              rows={2}
              placeholder="Add a note (vendor, price, who's handling it…)"
              className="mt-1.5 w-full resize-y rounded-md border border-linen bg-white px-2.5 py-1.5 font-sans text-xs text-charcoal outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          )}
        </div>

        <button
          onClick={() => setNoteOpen((o) => !o)}
          aria-label={hasNote ? "Edit note" : "Add note"}
          title={hasNote ? "Edit note" : "Add note"}
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
            hasNote || noteOpen
              ? "bg-gold/15 text-gold-dark"
              : "text-warm-gray/60 hover:bg-ivory hover:text-sage"
          }`}
        >
          <StickyNote className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
