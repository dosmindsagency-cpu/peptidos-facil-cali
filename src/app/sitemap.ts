import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/env";

const BASE = getSiteUrl();

const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const public_ = [
    "/",
    "/peptidos",
    "/aprende",
    "/recursos",
    "/privacidad",
    "/terminos",
    "/aviso-medico",
    "/divulgacion-afiliados",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  // Phase 1 surfaces — kept out of index until they ship.
  const draft = [
    "/pep",
    "/calculadoras",
    "/calculadoras/dosis",
    "/calculadoras/reconstitucion",
    "/calendario",
    "/donde-comprar",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));
  return [...public_, ...draft];
}
