import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Calendario",
  description: "Calendario personalizado para protocolos — Péptidos Fácil Cali.",
  alternates: { canonical: "/calendario" },
  robots: { index: false, follow: true },
};

export default function CalendarioPage() {
  return (
    <PhasePlaceholder
      title="Calendario personalizado"
      description="Generador de calendarios referenciales para protocolos. Entrega Fase 2. Permite almacenamiento privado por usuario autenticado."
      features={[
        "Generación de calendario desde objetivo",
        "Exportar a PDF / añadir a Google Calendar",
        "Almacenamiento privado en bucket user-private",
      ]}
    />
  );
}
