"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { primaryNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-pf-navy-immersive/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label={`Ir al inicio · ${siteConfig.name}`} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pf-petroleum to-pf-navy ring-1 ring-white/[0.12]" aria-hidden="true"><svg viewBox="0 0 32 32" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 22C12 16 20 16 24 22" /><circle cx="16" cy="13" r="3" /><path d="M16 4v3M16 25v3M4 16h3M25 16h3" /></svg></span>
          <span className="leading-tight text-sm font-semibold text-white">Péptidos Fácil Cali</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">{primaryNav.map((item) => { const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")); return <Link key={item.href} href={item.href} className={cn("rounded-full px-3 py-2 text-sm transition-colors", active ? "bg-white/[0.08] text-white" : "text-pf-ice/80 hover:bg-white/[0.04] hover:text-white")}>{item.label}</Link>; })}</nav>
        <div className="flex items-center gap-2"><Link href="/pep" className="button-secondary hidden h-10 px-3 text-xs sm:inline-flex"><MessageCircle className="h-4 w-4" />Hablar con Pep</Link><button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.04] text-white lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((value) => !value)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      {open && <div id="mobile-menu" className="border-t border-white/[0.06] bg-pf-navy-immersive/95 backdrop-blur-xl lg:hidden"><nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4" aria-label="Menú móvil">{primaryNav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base text-pf-ice hover:bg-white/[0.04] hover:text-white">{item.label}</Link>)}<Link href="/pep" onClick={() => setOpen(false)} className="button-primary mt-2 justify-center">Hablar con Pep <MessageCircle className="h-4 w-4" /></Link></nav></div>}
    </header>
  );
}
