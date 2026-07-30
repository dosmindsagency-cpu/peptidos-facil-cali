import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Péptidos Fácil Cali.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <Container width="default" className="py-16">
      <article className="prose-invert max-w-3xl space-y-5 text-base leading-relaxed text-pf-ice/85">
        <h1 className="font-display text-5xl tracking-tight text-white">
          Política de privacidad
        </h1>
        <p>
          Péptidos Fácil Cali es una plataforma educativa. Sólo recopilamos la información
          necesaria para responder a tus consultas y nunca vendemos datos personales.
        </p>
        <p>
          Esta página es un shell estructural — el texto legal final se publica tras la
          revisión correspondiente.
        </p>
      </article>
    </Container>
  );
}
