import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Aprende",
  description: "Centro de aprendizaje y artículos SEO — Péptidos Fácil Cali.",
  alternates: { canonical: "/aprende" },
};

export default function AprendePage() {
  return (
    <PhasePlaceholder
      title="Aprende"
      description="Centro editorial: guías, comparaciones, mecanismos, seguridad, recursos de California. Indexable y optimizado para AI search."
      features={[
        "Schema Article y FAQPage",
        "Editorial workflow (draft → in_review → published)",
        "Sin generación automática sin aprobación",
      ]}
      phase="Phase 2 (product)"
    />
  );
}
