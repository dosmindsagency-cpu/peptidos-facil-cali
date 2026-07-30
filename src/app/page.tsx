import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { websiteJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: `${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  },
};

const modules = [
  { label: "Pep AI", href: "/pep", note: "entry point conversacional" },
  { label: "Calculadora de dosis", href: "/calculadoras/dosis", note: "lógica revisada — Fase 2" },
  { label: "Calculadora de reconstitución", href: "/calculadoras/reconstitucion", note: "lógica revisada — Fase 2" },
  { label: "Calendario personalizado", href: "/calendario", note: "generación — Fase 2" },
  { label: "Biblioteca de péptidos", href: "/peptidos", note: "contenido editorial" },
  { label: "Aprende", href: "/aprende", note: "blog y guías SEO" },
  { label: "Recursos California", href: "/recursos", note: "modelo regional" },
  { label: "Dónde comprar", href: "/donde-comprar", note: "proveedores y afiliados" },
];

export default function HomePage() {
  return (
    <Container width="wide" className="py-20">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.20em] text-pf-ice">
          <span className="h-1.5 w-1.5 rounded-full bg-pf-petroleum" aria-hidden />
          Fundación técnica · Fase 1
        </span>
        <h1 className="mt-6 font-display text-6xl leading-[1.02] tracking-tight text-white text-balance">
          {siteConfig.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pf-ice/85 text-pretty">
          Plataforma modular en español para educación sobre péptidos, Pep AI, calculadoras,
          calendarios y descubrimiento de proveedores en {siteConfig.region}.
        </p>
      </header>

      <section aria-labelledby="foundation-modules" className="mt-16">
        <h2 id="foundation-modules" className="text-xs font-semibold uppercase tracking-[0.18em] text-pf-ice/60">
          Módulos en ruta
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="group flex h-full flex-col gap-2 rounded-2xl border border-white/[0.08] bg-pf-navy-elevated/40 p-5 transition-colors hover:border-white/[0.18]"
              >
                <span className="text-sm font-medium text-white group-hover:text-pf-ice">{m.label}</span>
                <span className="text-xs text-pf-ice/60">{m.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border border-dashed border-white/[0.14] bg-pf-navy-immersive/60 p-6 text-sm text-pf-ice/65">
        Esto es la <strong className="text-pf-ice">fundación técnica</strong>: renderiza, aplica
        metadata, seguridad y layouts compartidos. El homepage final se entrega después de la
        aprobación de Fase 1.
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
    </Container>
  );
}
