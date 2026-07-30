import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Biblioteca de péptidos",
  description: "Biblioteca de péptidos — Péptidos Fácil Cali.",
  alternates: { canonical: "/peptidos" },
};

export default function PeptidosIndex() {
  return (
    <PhasePlaceholder
      title="Biblioteca de péptidos"
      description="Catálogo editorial respaldado por la tabla content_items en Supabase. Cada entrada combina mecanismo, evidencia y estado regulatorio."
      features={[
        "Schema Article con fuentes, autor, fecha",
        "Etiquetas por péptido, objetivo, región",
        "Estado regulatorio explícito (research / regulatory / wellness)",
      ]}
      phase="Phase 2 (product)"
    />
  );
}
