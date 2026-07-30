import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Dónde comprar",
  description: "Proveedores verificables y divulgaciones de afiliados — Péptidos Fácil Cali.",
  alternates: { canonical: "/donde-comprar" },
  robots: { index: false, follow: true },
};

export default function DondeComprarPage() {
  return (
    <PhasePlaceholder
      title="Dónde comprar o encontrar proveedores"
      description="Datos estructurados en la tabla providers. URLs de afiliados nunca se hardcodean en componentes de UI — se sirven desde el modelo de datos."
      features={[
        "Modelo de proveedor con verificación + última revisión",
        "Disclosure explícito por interacción",
        "Sólo URLs firmadas por servidor",
      ]}
      phase="Phase 2 (product)"
    />
  );
}
