/** Site-wide configuration. No PII, no secrets. */
export const siteConfig = {
  name: "Péptidos Fácil Cali",
  shortName: "PFC",
  region: "Cali",
  tagline: "Información y herramientas sobre péptidos.",
  locale: "es",
  description:
    "Información clara, herramientas educativas y recursos confiables para entender mejor el mundo de los péptidos.",
} as const;

export const primaryNav = [
  { label: "Inicio", href: "/" },
  { label: "Aprende", href: "/aprende" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Pep", href: "/pep" },
  { label: "Dónde comprar", href: "/donde-comprar" },
  { label: "Recursos", href: "/recursos" },
] as const;

export const footerNav = [
  {
    title: "Plataforma",
    links: [
      { label: "Pep AI", href: "/pep" },
      { label: "Calculadoras", href: "/calculadoras" },
      { label: "Calendario", href: "/calendario" },
      { label: "Biblioteca", href: "/peptidos" },
      { label: "Aprende", href: "/aprende" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Recursos California", href: "/recursos" },
      { label: "Dónde comprar", href: "/donde-comprar" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Aviso médico", href: "/aviso-medico" },
      { label: "Divulgación de afiliados", href: "/divulgacion-afiliados" },
    ],
  },
] as const;
