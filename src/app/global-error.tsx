"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#081522] font-sans text-[#eaf3fa] antialiased">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.20em] text-pf-ice/55">Error</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight text-white">
            Algo salió mal.
          </h1>
          <p className="mt-4 text-base text-pf-ice/75">
            {error.message || "Por favor vuelve a intentarlo."}
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-pf-petroleum px-6 text-sm font-medium text-white hover:bg-[#347ea3]"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
