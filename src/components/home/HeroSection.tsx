import Image from "next/image";
import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PepChat } from "@/components/home/PepChat";
import { PepSphere } from "@/components/home/PepSphere";

export function HeroSection() {
  return <section className="pep-hero relative overflow-hidden border-b border-white/[0.06]" aria-labelledby="hero-title">
    <div className="hero-art" aria-hidden="true"><Image src="/bioverso/hero/hero-bg-desktop-final.webp" alt="" fill priority sizes="100vw" className="hero-art-image" /></div>
    <div className="hero-network" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
    <Container width="wide" className="relative flex min-w-0 flex-col items-center pb-16 pt-12 text-center sm:pb-20 sm:pt-16 lg:pt-20">
      <div className="pep-hero-identity"><PepSphere /><div><p className="text-sm font-semibold text-white">Pep AI</p><p className="text-xs text-cyan-200">Inteligencia educativa</p></div></div>
      <h1 id="hero-title" className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">¿Qué quieres <span className="hero-gradient-text">entender hoy?</span></h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Explora péptidos, compara información y utiliza herramientas educativas con contexto, evidencia y seguridad.</p>
      <div id="pep-chat" className="mt-8 w-full max-w-4xl scroll-mt-24"><PepChat /></div>
      <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm"><Link href="/peptidos" className="hero-secondary-link"><BookOpen className="h-4 w-4" />Explorar biblioteca</Link><span className="hero-safety"><ShieldCheck className="h-4 w-4 text-cyan-300" />Educación, no diagnóstico</span></div>
    </Container>
  </section>;
}

export function HeroSupport() {
  return <p className="sr-only">Pep AI ofrece información educativa y no sustituye la evaluación de un profesional de salud.</p>;
}
