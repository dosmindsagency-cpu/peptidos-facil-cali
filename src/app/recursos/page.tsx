import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/ui/PhasePlaceholder";

export const metadata: Metadata = {
  title: "Recursos para California",
  description: "Recursos regionales verificables en California.",
  alternates: { canonical: "/recursos" },
};

export default function RecursosPage() {
  return (
    <PhasePlaceholder
      title="Recursos para California"
      description="Estructura regional escalable. Las páginas de ciudades sólo se publican con contenido único o proveedores verificados."
      features={[
        "Taxonomía de regiones",
        "Cada región tiene su propia ruta",
        "Poblada sólo con contenido único — sin thin pages",
      ]}
      phase="Phase 2 (product)"
    />
  );
}
