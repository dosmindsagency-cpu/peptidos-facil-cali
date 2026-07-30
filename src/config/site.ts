/** Site-wide configuration. No PII, no secrets. */
export const siteConfig = {
  name: "Péptidos Fácil Cali",
  shortName: "PFC",
  region: "California",
  tagline: "Educación premium, herramientas claras.",
  locale: "es",
  description:
    "Plataforma modular en español para educación sobre péptidos, Pep AI, calculadoras, calendarios y descubrimiento de proveedores en California.",
} as const;

export const primaryNav = [
  { label: "Pep", href: "/pep" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Calendario", href: "/calendario" },
  { label: "Biblioteca", href: "/peptidos" },
  { label: "Aprende", href: "/aprende" },
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
