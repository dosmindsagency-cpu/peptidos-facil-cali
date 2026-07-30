import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Divulgación de afiliados",
  description: "Divulgación de afiliados — Péptidos Fácil Cali.",
  alternates: { canonical: "/divulgacion-afiliados" },
};

export default function DivulgacionAfiliadosPage() {
  return (
    <Container width="default" className="py-16">
      <article className="prose-invert max-w-3xl space-y-5 text-base leading-relaxed text-pf-ice/85">
        <h1 className="font-display text-5xl tracking-tight text-white">
          Divulgación de afiliados
        </h1>
        <p>
          Algunas recomendaciones pueden incluir enlaces afiliados o remitirte a proveedores
          externos independientes. Las relaciones comerciales se divulgan claramente en cada
          interacción visible para el usuario.
        </p>
        <p>Texto legal final pendiente de revisión.</p>
      </article>
    </Container>
  );
}
