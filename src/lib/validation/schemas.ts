import { z } from "zod";

/**
 * Reusable input validation. Every public form / API handler should run
 * through these schemas before touching Supabase.
 */

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .email("Email inválido");

export const leadFormSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: emailSchema,
  optional_phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s().-]+$/, "Teléfono inválido")
    .optional()
    .or(z.literal("")),
  region: z.string().trim().max(80).optional().or(z.literal("")),
  goal: z.string().trim().max(80).optional().or(z.literal("")),
  preferred_language: z.enum(["es", "en"]).default("es"),
  source: z.string().trim().max(120).optional(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(120).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, "Se requiere consentimiento para continuar"),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;
