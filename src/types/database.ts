/**
 * Database types — mirrors the schema in /docs/database.md.
 * Will be expanded after Supabase CLI generates types from the live DB.
 */

export type ProfilesRow = {
  id: string;
  email: string;
  preferred_language: string | null;
  california_region: string | null;
  created_at: string;
  updated_at: string;
};

export type Lead = {
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

export type ContentItem = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content_type:
    | "peptide"
    | "article"
    | "guide"
    | "faq"
    | "glp1"
    | "recovery"
    | "safety"
    | "longevity"
    | "weight"
    | "california_resource"
    | "provider_selection";
  status: "draft" | "in_review" | "published" | "archived";
  language: string;
  published_at: string | null;
  updated_at: string;
};

export type Provider = {
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
