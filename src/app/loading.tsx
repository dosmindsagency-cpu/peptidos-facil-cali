import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container width="default" className="py-24">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-pf-petroleum"
          aria-hidden
        />
        <p className="text-sm text-pf-ice/70" role="status" aria-live="polite">
          Cargando…
        </p>
      </div>
    </Container>
  );
}
