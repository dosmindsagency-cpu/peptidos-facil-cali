/**
 * Database schema types. Mirrors `/docs/database.md`.
 * Once the live Supabase project exists, regenerate with:
 *   supabase gen types typescript --project-id <ref> --schema public > src/types/database.generated.ts
 * For Phase 1 we hand-write the shape so the linter has something to bind against.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          preferred_language: string | null;
          california_region: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          preferred_language?: string | null;
          california_region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          optional_phone: string | null;
          region: string | null;
          goal: string | null;
          preferred_language: string | null;
          source: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          consent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          optional_phone?: string | null;
          region?: string | null;
          goal?: string | null;
          preferred_language?: string | null;
          source?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          consent_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      content_items: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          content_type: string;
          status: "draft" | "in_review" | "published" | "archived";
          language: string;
          published_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          content_type: string;
          status?: "draft" | "in_review" | "published" | "archived";
          language?: string;
          published_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_items"]["Insert"]>;
        Relationships: [];
      };
      providers: {
        Row: {
          id: string;
          name: string;
          region: string | null;
          website: string | null;
          referral_url: string | null;
          discount_code: string | null;
          verification_status: "unverified" | "pending" | "verified" | "rejected";
          last_reviewed_at: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["providers"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["providers"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
