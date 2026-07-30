import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container width="default" className="py-32 text-center">
      <p className="text-xs uppercase tracking-[0.20em] text-pf-ice/55">404</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight text-white">
        No encontramos esa ruta.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-pf-ice/75">
        La página puede haberse movido o aún no estar publicada. Vuelve al inicio o explora
        los módulos disponibles.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-pf-white px-6 text-sm font-medium text-pf-navy hover:bg-pf-ice-soft"
      >
        Volver al inicio
      </Link>
    </Container>
  );
}
