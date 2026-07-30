import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Términos de uso — Péptidos Fácil Cali.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <Container width="default" className="py-16">
      <article className="prose-invert max-w-3xl space-y-5 text-base leading-relaxed text-pf-ice/85">
        <h1 className="font-display text-5xl tracking-tight text-white">Términos de uso</h1>
        <p>
          El contenido es educativo. No constituye consejo médico ni diagnóstico. El uso del
          sitio implica aceptación de estos términos.
        </p>
        <p>Texto final pendiente de revisión.</p>
      </article>
    </Container>
  );
}
