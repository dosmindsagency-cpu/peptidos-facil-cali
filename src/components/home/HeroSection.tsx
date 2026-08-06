import Image from "next/image";
import Link from "next/link";
import { ArrowDown, BookOpen, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PepChat } from "@/components/home/PepChat";

export function HeroSection() {
  return <section className="pep-hero relative overflow-hidden border-b border-white/[0.06]" aria-labelledby="hero-title">
    <div className="hero-art" aria-hidden="true"><Image src="/bioverso/hero/hero-bg-desktop-final.webp" alt="" fill priority sizes="100vw" className="hero-art-image" /></div>
    <div className="hero-network" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
    <Container width="wide" className="relative grid min-w-0 gap-8 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:gap-14 lg:pt-20">
      <div className="min-w-0 max-w-xl">
        <div className="eyebrow"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.8)]" />La inteligencia educativa de PF Cali</div>
        <h1 id="hero-title" className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">Entiende tus péptidos. <span className="hero-gradient-text">Decide mejor.</span></h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">Habla con Pep AI para explorar péptidos, comparar información, usar calculadoras educativas y encontrar recursos confiables.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="#pep-chat" className="button-primary"><span>Hablar con Pep</span><ArrowDown className="h-4 w-4" /></a><Link href="/peptidos" className="button-secondary"><BookOpen className="h-4 w-4" />Explorar biblioteca</Link></div>
        <p className="mt-5 flex max-w-md items-start gap-2 text-xs leading-5 text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />Educación clara, contexto de seguridad y fuentes para formular mejores preguntas.</p>
      </div>
      <div id="pep-chat" className="min-w-0 scroll-mt-24"><PepChat /></div>
    </Container>
  </section>;
}
