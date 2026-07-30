import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Aviso médico",
  description: "Aviso médico — Péptidos Fácil Cali.",
  alternates: { canonical: "/aviso-medico" },
};

export default function AvisoMedicoPage() {
  return (
    <Container width="default" className="py-16">
      <article className="prose-invert max-w-3xl space-y-5 text-base leading-relaxed text-pf-ice/85">
        <h1 className="font-display text-5xl tracking-tight text-white">Aviso médico</h1>
        <p>
          Péptidos Fácil Cali es un recurso educativo. El contenido no reemplaza consejo
          médico, diagnóstico ni tratamiento. Antes de tomar decisiones sobre tu salud,
          consulta a un profesional licenciado.
        </p>
        <p>
          No almacenamos historiales clínicos ni información de salud sensible en los
          formularios básicos de captura.
        </p>
      </article>
    </Container>
  );
}
