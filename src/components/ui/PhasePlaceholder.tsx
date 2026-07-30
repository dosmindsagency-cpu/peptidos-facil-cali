import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

type Phase = "Phase 1 (foundation)" | "Phase 2 (product)" | "Phase 3 (launch)";

const phaseColors: Record<Phase, string> = {
  "Phase 1 (foundation)": "border-pf-petroleum/40 bg-pf-petroleum/[0.06] text-pf-ice",
  "Phase 2 (product)": "border-white/[0.10] bg-pf-ice/[0.04] text-pf-ice",
  "Phase 3 (launch)": "border-white/[0.10] bg-pf-ice/[0.04] text-pf-ice/70",
};

export function PhasePlaceholder({
  title,
  description,
  features,
  phase = "Phase 2 (product)",
  className,
}: {
  title: string;
  description?: ReactNode;
  features?: string[];
  phase?: Phase;
  className?: string;
}) {
  return (
    <section className={cn("py-16 sm:py-24", className)} aria-label={title}>
      <Container width="default">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl text-balance">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-pf-ice/80 text-pretty">
                {description}
              </p>
            ) : null}
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
              phaseColors[phase],
            )}
          >
            {phase}
          </span>
        </header>

        {features && features.length > 0 ? (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li
                key={f}
                className="rounded-2xl border border-white/[0.06] bg-pf-navy-elevated/40 p-5 text-sm text-pf-ice/85"
              >
                {f}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-10 rounded-2xl border border-dashed border-white/[0.14] bg-pf-navy-immersive/60 p-6 text-sm text-pf-ice/65">
          Esta ruta es un shell funcional: renderiza, comparte layout global y aplica
          metadata. La lógica y el contenido completo se entregan después de la Fase 1.
        </div>
      </Container>
    </section>
  );
}
