import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PepPreview } from "@/components/home/PepPreview";

export function HeroSection() {
  return <section className="hero-grid relative overflow-hidden border-b border-white/[0.06]" aria-labelledby="hero-title">
    <div className="hero-network" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
    <Container width="wide" className="relative grid gap-12 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-20 lg:pt-28">
      <div className="max-w-2xl">
        <div className="eyebrow"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.8)]" />Tu plataforma de confianza sobre péptidos</div>
        <h1 id="hero-title" className="mt-7 max-w-xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">Péptidos <span className="hero-gradient-text">explicados fácil.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">Información clara, herramientas inteligentes y recursos confiables para ayudarte a entender mejor el mundo de los péptidos.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/aprende" className="button-primary"><span>Explorar ahora</span><ArrowRight className="h-4 w-4" /></Link><Link href="/pep" className="button-secondary"><MessageCircle className="h-4 w-4" />Hablar con Pep</Link></div>
        <p className="mt-6 flex max-w-md items-start gap-2 text-xs leading-5 text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />Contenido educativo. Sin diagnósticos ni recomendaciones médicas personalizadas.</p>
      </div>
      <PepPreview />
    </Container>
  </section>;
}
