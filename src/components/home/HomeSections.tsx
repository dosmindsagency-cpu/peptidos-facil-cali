import Link from "next/link";
import { ArrowUpRight, BookOpen, Calculator, CheckCircle2, FlaskConical, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-intro"><p className="section-eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">{description}</p>}</div>;
}

const tools = [
  { title: "Biblioteca", description: "Explora conceptos, péptidos y contexto regulatorio.", href: "/peptidos", icon: BookOpen },
  { title: "Calculadoras", description: "Organiza unidades y concentraciones de forma educativa.", href: "/calculadoras", icon: Calculator },
  { title: "Seguridad", description: "Revisa preguntas importantes antes de tomar decisiones.", href: "/aviso-medico", icon: ShieldCheck },
  { title: "Proveedores", description: "Aprende qué señales revisar al evaluar dónde comprar.", href: "/donde-comprar", icon: HeartPulse },
];

export function PepCapabilities() {
  const items = [["Explica", "Convierte conceptos complejos en respuestas claras.", BookOpen], ["Compara", "Organiza similitudes, diferencias y nivel de evidencia.", Sparkles], ["Calcula", "Te guía por unidades y operaciones educativas.", Calculator], ["Contextualiza", "Presenta seguridad, regulación y fuentes visibles.", ShieldCheck]] as const;
  return <section className="py-16 sm:py-20" aria-labelledby="capabilities-title"><Container width="wide"><SectionIntro eyebrow="Una conversación útil" title="Qué puede hacer Pep" description="Pep conecta tus preguntas con recursos educativos; no reemplaza la evaluación de un profesional de salud." /><div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{items.map(([title, description, Icon]) => <div key={title} className="capability-card"><Icon className="h-5 w-5 text-cyan-300" /><h3 className="mt-4 text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div>)}</div></Container></section>;
}

export function QuickTools() {
  return <section className="border-y border-white/[0.06] bg-[#0b1e32]/55 py-16 sm:py-20" aria-labelledby="tools-title"><Container width="wide"><SectionIntro eyebrow="Sigue explorando" title="Herramientas rápidas" description="Accesos directos para cuando ya sabes qué quieres revisar." /><div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{tools.map(({ title, description, href, icon: Icon }) => <Link key={title} href={href} className="tool-link group"><span className="icon-box"><Icon className="h-5 w-5" /></span><span className="mt-5 block font-semibold text-white">{title}</span><span className="mt-2 block text-sm leading-6 text-slate-400">{description}</span><ArrowUpRight className="mt-5 h-4 w-4 text-cyan-300 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>)}</div></Container></section>;
}

export function ContextSection() {
  return <section className="py-16 sm:py-20" aria-labelledby="context-title"><Container width="wide"><div className="context-panel"><div className="max-w-xl"><p className="section-eyebrow">Información con contexto</p><h2 id="context-title" className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">No sólo respuestas. Mejores preguntas.</h2><p className="mt-4 text-base leading-7 text-slate-300">Pep está diseñado para separar evidencia, seguridad y regulación para que puedas explorar sin perder de vista lo que todavía no se sabe.</p></div><div className="grid gap-3 sm:grid-cols-3"><div><p className="context-label">Evidencia</p><p className="mt-2 text-sm text-slate-400">Qué tan sólida es la información disponible.</p></div><div><p className="context-label">Seguridad</p><p className="mt-2 text-sm text-slate-400">Qué riesgos y límites conviene revisar.</p></div><div><p className="context-label">Fuentes</p><p className="mt-2 text-sm text-slate-400">De dónde viene cada punto importante.</p></div></div></div></Container></section>;
}

export function FinalChatCta() {
  return <section className="border-t border-white/[0.06] py-16 sm:py-20" aria-labelledby="final-cta-title"><Container width="narrow" className="text-center"><Sparkles className="mx-auto h-6 w-6 text-cyan-300" /><h2 id="final-cta-title" className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">¿Qué quieres entender hoy?</h2><p className="mx-auto mt-3 max-w-lg text-slate-400">Vuelve a Pep y continúa explorando desde tu próxima pregunta.</p><a href="#pep-chat" className="button-primary mx-auto mt-7 w-fit">Volver a Pep <ArrowUpRight className="h-4 w-4" /></a></Container></section>;
}

export const responseIcon = CheckCircle2;
export const calculatorIcon = FlaskConical;
