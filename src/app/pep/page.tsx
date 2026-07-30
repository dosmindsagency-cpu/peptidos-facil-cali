import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Pep",
  description:
    "Pep es el entry point conversacional de Péptidos Fácil Cali. Disponible como parte del módulo Pep.",
  alternates: { canonical: "/pep" },
  robots: { index: false, follow: true },
};

export default function PepPage() {
  return (
    <PhasePlaceholder
      title="Pep"
      description="Entry point conversacional. La integración backend se entrega en Fase 2 con un adaptador seguro y rate-limited."
      features={[
        "Explicar péptidos y compararlos en lenguaje claro",
        "Guiar hacia herramientas y contenido educativo",
        "Contextualizar regiones y proveedores verificables",
        "Limitarse estrictamente a educación — sin diagnósticos ni prescripciones",
      ]}
    />
  );
}
