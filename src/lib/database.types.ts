// ============================================
// Database types matching Supabase schema
// ============================================
// Two layers (see supabase/migrations/003_rsvp_guest_list.sql):
//   * Household + Guest are imported from the spreadsheet.
//   * Rsvp is the response table, written only by the website and keyed on the
//     stable guest_id so responses survive re-imports.

export type NameStatus = "confirmed" | "PLACEHOLDER_UNKNOWN";
export type GuestType = "adult" | "child" | "toddler" | "infant";

export interface Household {
  household_id: number;
  search_name: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  created_at: string;
}

export interface Guest {
  guest_id: string; // G###
  household_id: number;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  name_status: NameStatus;
  is_primary_contact: boolean;
  relationship_to_couple: string | null;
  side: string | null;
  invite_group: string | null;
  guest_type: GuestType;
  tier: string | null;
  plus_one_allowed: string | null;
  invited_rehearsal_dinner: boolean;
  needs_review: boolean;
  review_reason: string | null;
  removed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rsvp {
  guest_id: string;
  attending_wedding: boolean | null;
  attending_rehearsal: boolean | null;
  meal_preference: string | null;
  dietary_notes: string | null;
  rsvp_email: string | null;
  rsvp_phone: string | null;
  notes: string | null;
  plus_one_name: string | null;
  plus_one_type: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface ImportLog {
  id: string;
  created_at: string;
  filename: string | null;
  inserted: number;
  updated: number;
  soft_removed: number;
  households: number;
  placeholders: number;
  warnings: string[];
  dry_run: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ChecklistItemState {
  item_id: string;
  checked: boolean;
  notes: string | null;
  updated_at: string;
}

// Supabase Database type for createClient generic
export interface Database {
  public: {
    Tables: {
      households: {
        Row: Household;
        Insert: Omit<Household, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Household, "household_id">>;
      };
      guests: {
        Row: Guest;
        Insert: Omit<Guest, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Guest, "guest_id">>;
      };
      rsvps: {
        Row: Rsvp;
        Insert: Omit<Rsvp, "submitted_at" | "updated_at"> & {
          submitted_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Rsvp, "guest_id">>;
      };
      import_log: {
        Row: ImportLog;
        Insert: Omit<ImportLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ImportLog, "id">>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, "id" | "created_at">;
        Update: Partial<Omit<ContactMessage, "id" | "created_at">>;
      };
      checklist_items: {
        Row: ChecklistItemState;
        Insert: Omit<ChecklistItemState, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Omit<ChecklistItemState, "item_id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
