"use client";

import Link from "next/link";
import { MessageCircle, Calculator, BookOpen, ShoppingBag, House } from "lucide-react";

const items = [
  { label: "Inicio", href: "/", icon: House },
  { label: "Aprende", href: "/aprende", icon: BookOpen },
  { label: "Pep", href: "/pep", icon: MessageCircle },
  { label: "Calculadoras", href: "/calculadoras", icon: Calculator },
  { label: "Comprar", href: "/donde-comprar", icon: ShoppingBag },
];

export function MobileQuickNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-pf-navy-immersive/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl md:hidden"
      aria-label="Acceso rápido móvil"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around gap-1">
        {items.map((it) => (
          <li key={it.href} className="flex-1">
            <Link
              href={it.href}
              aria-label={it.label}
              className="group flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-medium uppercase tracking-wide text-pf-ice/75 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              <span className="grid h-7 w-7 place-items-center">
                <it.icon className="h-5 w-5" aria-hidden />
              </span>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
