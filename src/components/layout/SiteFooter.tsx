import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-pf-navy-immersive">
      <Container width="wide" className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pf-petroleum to-pf-navy ring-1 ring-white/[0.12]">
                <svg viewBox="0 0 32 32" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 22C12 16 20 16 24 22" />
                  <circle cx="16" cy="13" r="3" />
                  <path d="M16 4v3M16 25v3M4 16h3M25 16h3" />
                </svg>
              </span>
              <span className="leading-tight text-sm font-semibold text-white">{siteConfig.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-pf-ice/70">
              {siteConfig.description}
            </p>
            <p className="mt-6 text-xs text-pf-ice/50">
              {siteConfig.region} · Contenido educativo — no constituye consejo médico.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-pf-ice/60">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-pf-ice/80 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-pf-ice/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}.</p>
          <p>Contenido educativo para tomar decisiones informadas.</p>
        </div>
      </Container>
    </footer>
  );
}
