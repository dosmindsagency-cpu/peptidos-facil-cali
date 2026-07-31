import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2, FlaskConical, Info, LockKeyhole, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { featuredContent, goalItems, quickAccessItems, toolItems, trustItems } from "@/data/homepage";

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-intro"><p className="section-eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{description}</p>}</div>;
}

export function QuickAccess() {
  return <section className="py-20 sm:py-28" aria-labelledby="quick-access-title"><Container width="wide"><SectionIntro eyebrow="Tu siguiente paso" title="Todo lo que necesitas, más cerca" description="Empieza por el recurso que mejor se adapte a tu pregunta de hoy." /><div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{quickAccessItems.map(({ title, description, href, icon: Icon }) => <Link key={title} href={href} className="home-card group flex min-h-48 flex-col justify-between p-5 sm:p-6"><span className="icon-box"><Icon className="h-5 w-5" /></span><span><span className="mt-7 block text-lg font-semibold text-white">{title}</span><span className="mt-2 block text-sm leading-6 text-slate-400">{description}</span></span><ArrowUpRight className="mt-5 h-4 w-4 text-cyan-300 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>)}</div></Container></section>;
}

export function GoalExplorer() {
  return <section className="border-y border-white/[0.06] bg-[#0b1e32]/55 py-20 sm:py-28" aria-labelledby="goal-title"><Container width="wide"><SectionIntro eyebrow="Explora con contexto" title="Explora según tu objetivo" description="Categorías educativas para orientarte. No son promesas de tratamiento ni recomendaciones médicas." /><div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{goalItems.map(({ title, description, href, icon: Icon }) => <Link key={title} href={href} className="goal-card group"><Icon className="h-5 w-5 text-cyan-300" /><span className="mt-5 block text-sm font-semibold text-white">{title}</span><span className="mt-2 block text-xs leading-5 text-slate-400">{description}</span></Link>)}</div></Container></section>;
}

export function TrustSection() {
  return <section className="py-20 sm:py-28" aria-labelledby="trust-title"><Container width="wide"><div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start"><SectionIntro eyebrow="Una base confiable" title="Información diseñada para ayudarte a decidir mejor" description="La claridad también es una forma de cuidado. Construimos cada recurso para que puedas avanzar con mejores preguntas." /><div className="grid gap-3 sm:grid-cols-2 sm:gap-4">{trustItems.map(({ title, description, icon: Icon }) => <div key={title} className="trust-card"><Icon className="h-5 w-5 text-cyan-300" /><h3 className="mt-5 text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div>)}</div></div></Container></section>;
}

export function FeaturedContent() {
  return <section className="border-t border-white/[0.06] bg-[#0b1e32]/35 py-20 sm:py-28" aria-labelledby="featured-title"><Container width="wide"><SectionIntro eyebrow="Biblioteca guiada" title="Aprende paso a paso" description="Lecturas breves para construir una base sólida, sin lenguaje innecesariamente complejo." /><div className="mt-10 grid gap-4 lg:grid-cols-3">{featuredContent.map((item) => <article key={item.title} className="home-card flex flex-col p-6"><div className="flex items-center justify-between"><span className="badge">{item.category}</span><span className="text-xs text-slate-500">{item.readingTime}</span></div><BookOpen className="mt-10 h-6 w-6 text-cyan-300" /><h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{item.summary}</p><Link href={item.href} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">Leer guía <ArrowUpRight className="h-4 w-4" /></Link></article>)}</div></Container></section>;
}

export function ToolsSection() {
  return <section className="py-20 sm:py-28" aria-labelledby="tools-title"><Container width="wide"><SectionIntro eyebrow="Organiza mejor" title="Herramientas simples para temas complejos" /><div className="mt-10 grid gap-4 lg:grid-cols-2">{toolItems.map(({ title, description, href, button, icon: Icon }) => <div key={title} className="tool-card"><div className="flex items-start justify-between gap-4"><span className="icon-box"><Icon className="h-5 w-5" /></span><span className="badge">Próximamente</span></div><h3 className="mt-8 text-2xl font-semibold text-white">{title}</h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{description}</p><Link href={href} className="button-secondary mt-8 w-fit">{button}<ArrowUpRight className="h-4 w-4" /></Link></div>)}</div></Container></section>;
}

export function ProviderGuide() {
  return <section className="border-y border-white/[0.06] bg-gradient-to-br from-[#102a43] to-[#0b1e32] py-20 sm:py-28" aria-labelledby="provider-title"><Container width="wide"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="section-eyebrow">Compra con criterio</p><h2>Cómo evaluar dónde comprar</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Te ayudamos a entender qué señales revisar antes de tomar una decisión, sin rankear ni recomendar proveedores reales.</p><Link href="/donde-comprar" className="button-primary mt-8 w-fit">Ver guía de proveedores <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid gap-3 sm:grid-cols-2">{["Transparencia del producto", "Documentación de pruebas", "Reputación del proveedor", "Envíos y atención al cliente"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200"><CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-300" />{item}</div>)}<p className="sm:col-span-2 flex items-start gap-2 pt-2 text-xs leading-5 text-slate-500"><Info className="mt-0.5 h-4 w-4 shrink-0" />Incluimos una divulgación de afiliados clara cuando corresponda.</p></div></div></Container></section>;
}

export function LegalTrustStrip() {
  return <section className="border-b border-white/[0.06] py-8" aria-label="Avisos legales"><Container width="wide" className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl leading-6 text-slate-400">Péptidos Fácil Cali ofrece contenido educativo y no sustituye la evaluación de un profesional de salud.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/aviso-medico" className="text-slate-300 hover:text-white">Aviso médico</Link><Link href="/privacidad" className="text-slate-300 hover:text-white">Privacidad</Link><Link href="/terminos" className="text-slate-300 hover:text-white">Términos</Link><Link href="/divulgacion-afiliados" className="text-slate-300 hover:text-white">Afiliados</Link></div></Container></section>;
}

export function SectionDivider() { return <div className="sr-only" />; }
export const decorativeIcons = { LockKeyhole, ShieldCheck, FlaskConical };
