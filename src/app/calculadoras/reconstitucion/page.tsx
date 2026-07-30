import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Calculadora de reconstitución",
  description: "Calculadora de reconstitución — módulo Péptidos Fácil Cali.",
  alternates: { canonical: "/calculadoras/reconstitucion" },
  robots: { index: false, follow: true },
};

export default function CalculadoraReconstitucionPage() {
  return (
    <PhasePlaceholder
      title="Calculadora de reconstitución"
      description="Concentración objetivo, diluyente y volumen de referencia. Lógica entregada en Fase 2."
      features={[
        "Concentración objetivo",
        "Volumen final por vial",
        "Tabla de diluyentes (referencia validada)",
      ]}
    />
  );
}
