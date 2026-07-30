import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Calculadora de dosis",
  description: "Calculadora de dosis — módulo Péptidos Fácil Cali.",
  alternates: { canonical: "/calculadoras/dosis" },
  robots: { index: false, follow: true },
};

export default function CalculadoraDosisPage() {
  return (
    <PhasePlaceholder
      title="Calculadora de dosis"
      description="Conversión entre mcg, mg y mL con concentración objetivo. La lógica numérica se entrega en Fase 2, revisada contra referencias clínicas verificadas."
      features={[
        "Conversión mcg ↔ mg ↔ mL",
        "Validación cliente + servidor (Zod)",
        "Rate-limited en endpoint público",
      ]}
    />
  );
}
