import { getSiteUrl } from "@/env";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Péptidos Fácil Cali",
    url: getSiteUrl(),
    description:
      "Plataforma modular en español para educación sobre péptidos, Pep AI, calculadoras, calendarios y descubrimiento de proveedores en California.",
    areaServed: { "@type": "State", name: "California" },
    inLanguage: "es",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Péptidos Fácil Cali",
    url: getSiteUrl(),
    inLanguage: "es",
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/aprende?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
