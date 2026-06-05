// ============================================
// Database types matching Supabase schema
// ============================================

export type RsvpStatus = "pending" | "accepted" | "declined";

export interface Party {
  id: string;
  party_name: string;
  max_guests: number;
  address: string | null;
  invite_sent: boolean;
  invite_sent_date: string | null;
  created_at: string;
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  party_id: string;
  rsvp_status: RsvpStatus;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  notes: string | null;
  responded_at: string | null;
  created_at: string;
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
      parties: {
        Row: Party;
        Insert: Omit<Party, "id" | "created_at">;
        Update: Partial<Omit<Party, "id" | "created_at">>;
      };
      guests: {
        Row: Guest;
        Insert: Omit<Guest, "id" | "created_at">;
        Update: Partial<Omit<Guest, "id" | "created_at">>;
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
    Enums: {
      rsvp_status: RsvpStatus;
    };
  };
}
