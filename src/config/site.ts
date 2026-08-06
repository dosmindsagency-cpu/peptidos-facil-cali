/** Site-wide configuration. No PII, no secrets. */
export const siteConfig = {
  name: "Péptidos Fácil Cali",
  shortName: "PFC",
  region: "Cali",
  tagline: "Pep AI para entender mejor.",
  locale: "es",
  description: "Una plataforma educativa para explorar péptidos con contexto, seguridad y fuentes confiables.",
} as const;

export const primaryNav = [
  { label: "Pep AI", href: "/#pep-chat" },
  { label: "Biblioteca", href: "/peptidos" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Ciencia", href: "/aprende" },
  { label: "Seguridad", href: "/aviso-medico" },
  { label: "Proveedores", href: "/donde-comprar" },
] as const;

export const footerNav = [
  { title: "Explora", links: [{ label: "Pep AI", href: "/#pep-chat" }, { label: "Biblioteca", href: "/peptidos" }, { label: "Ciencia", href: "/aprende" }] },
  { title: "Herramientas", links: [{ label: "Calculadoras", href: "/calculadoras" }, { label: "Calendario", href: "/calendario" }, { label: "Proveedores", href: "/donde-comprar" }] },
  { title: "Confianza", links: [{ label: "Seguridad", href: "/aviso-medico" }, { label: "Privacidad", href: "/privacidad" }, { label: "Términos", href: "/terminos" }] },
] as const;
