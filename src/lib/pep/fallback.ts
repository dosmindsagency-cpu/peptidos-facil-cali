import type { PepResponse } from "@/lib/pep/types";

const source = { label: "Aviso médico de PF Cali", href: "/aviso-medico" };

export function buildPepFallback(message: string): PepResponse {
  const normalized = message.toLowerCase();
  if (normalized.includes("compar") || normalized.includes("diferencia")) {
    return {
      kind: "comparison",
      title: "Puedo ayudarte a comparar con contexto",
      answer: "Para comparar dos péptidos de forma responsable necesitamos sus nombres exactos y separar mecanismo, evidencia, uso aprobado y riesgos. No existe una opción universalmente mejor.",
      keyPoints: ["Comparamos mecanismo y objetivo de investigación.", "Separamos evidencia clínica de conversación sobre uso off-label.", "Revisamos seguridad y estado regulatorio antes de sacar conclusiones."],
      safetyNote: "Una comparación educativa no sustituye la evaluación de un profesional de salud.",
      sources: [source, { label: "Biblioteca educativa", href: "/peptidos" }],
      nextActions: [{ label: "Escribir los dos nombres", prompt: "Quiero comparar " }, { label: "Abrir biblioteca", href: "/peptidos" }],
      status: "fallback",
    };
  }
  if (normalized.includes("reconstit") || normalized.includes("dosis") || normalized.includes("calcular")) {
    return {
      kind: "calculator",
      title: "Podemos organizar el cálculo educativo",
      answer: "La reconstitución y las conversiones de unidades requieren concentración, volumen final y unidades consistentes. Pep puede ayudarte a revisar la estructura del cálculo, pero no prescribe una dosis individual.",
      keyPoints: ["Confirma las unidades antes de operar.", "Distingue concentración, volumen total y cantidad por aplicación.", "Verifica cualquier resultado con un profesional y la documentación del producto."],
      safetyNote: "Esta herramienta es educativa; no indica cuánto debe usar una persona.",
      sources: [source, { label: "Calculadoras educativas", href: "/calculadoras" }],
      nextActions: [{ label: "Abrir calculadoras", href: "/calculadoras" }, { label: "Revisar seguridad", href: "/aviso-medico" }],
      status: "fallback",
    };
  }
  return {
    kind: "educational",
    title: "Empecemos por el contexto",
    answer: `Puedo ayudarte a explorar “${message.trim()}” desde una perspectiva educativa: qué significa, qué evidencia existe, qué riesgos se discuten y dónde encontrar fuentes confiables. Para darte una respuesta más precisa, dime el nombre del péptido o el concepto que quieres entender.`,
    keyPoints: ["Primero definimos el término o péptido.", "Después revisamos evidencia, seguridad y estado regulatorio.", "Finalmente elegimos una fuente o herramienta para profundizar."],
    safetyNote: "Pep AI ofrece información educativa y no sustituye la evaluación de un profesional de salud.",
    sources: [source, { label: "Aprende", href: "/aprende" }],
    nextActions: [{ label: "Explorar biblioteca", href: "/peptidos" }, { label: "Revisar seguridad", href: "/aviso-medico" }],
    status: "fallback",
  };
}
