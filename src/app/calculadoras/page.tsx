import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Calculadoras",
  description: "Suite de calculadoras del módulo de Péptidos Fácil Cali.",
  alternates: { canonical: "/calculadoras" },
};

const calculators = [
  { title: "Calculadora de dosis", href: "/calculadoras/dosis", note: "Conversión entre mcg, mg y mL." },
  { title: "Calculadora de reconstitución", href: "/calculadoras/reconstitucion", note: "Concentración y diluyente de referencia." },
];

export default function CalculadorasIndex() {
  return (
    <Container width="wide" className="py-16">
      <header>
        <h1 className="font-display text-5xl tracking-tight text-white">Calculadoras</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pf-ice/80">
          Suite modular. Cada calculadora es una ruta aislada para poder exponerse de forma
          independiente (preparada para <code className="font-mono text-pf-ice/70">calculadora.peptidosfacilcali.com</code>).
        </p>
      </header>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group flex h-full flex-col gap-2 rounded-2xl border border-white/[0.08] bg-pf-navy-elevated/40 p-6 hover:border-white/[0.20]"
            >
              <span className="font-display text-xl text-white">{c.title}</span>
              <span className="text-sm text-pf-ice/75">{c.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
