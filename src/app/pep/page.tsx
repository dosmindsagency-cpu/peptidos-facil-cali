import type { Metadata } from "next";
import { PepWorkspace } from "@/components/pep/PepWorkspace";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Pep AI",
  description: "Explora péptidos con Pep AI, contexto de seguridad y fuentes educativas.",
  alternates: { canonical: "/pep" },
  robots: { index: false, follow: true },
};

export default function PepPage() {
  return <Container width="wide" className="py-8 sm:py-12"><div className="mx-auto max-w-5xl"><div className="mb-6"><p className="section-eyebrow">Conversación educativa</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Explora con Pep AI</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Pregunta, compara y revisa fuentes con una conversación diseñada para mantener el contexto de seguridad.</p></div><PepWorkspace /></div></Container>;
}
