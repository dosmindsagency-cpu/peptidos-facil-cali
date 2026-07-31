import { ArrowUp, Bot, Check, Sparkles } from "lucide-react";

const suggestions = ["¿Qué es un péptido?", "¿Cómo comparo proveedores?", "Quiero aprender lo básico"];

export function PepPreview() {
  return (
    <div className="pep-preview relative mx-auto w-full max-w-[31rem] overflow-hidden rounded-[1.75rem] border border-cyan-200/20 bg-[#10263d]/95 p-4 shadow-[0_28px_80px_-32px_rgba(45,212,191,.5)] sm:p-5" aria-label="Vista previa visual de Pep">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden />
      <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-400/20"><Bot className="h-6 w-6" /></div>
          <div><p className="font-semibold text-white">Habla con Pep</p><p className="mt-0.5 flex items-center gap-1.5 text-xs text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />En línea · educativo</p></div>
        </div>
        <Sparkles className="h-5 w-5 text-cyan-200/70" aria-hidden />
      </div>
      <div className="relative space-y-3 py-5">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.07] px-4 py-3 text-sm leading-relaxed text-blue-50">Hola, soy Pep. Puedo ayudarte a entender conceptos sobre péptidos con información clara y responsable.</div>
        <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-blue-500/20 px-4 py-3 text-sm text-blue-50">¿Por dónde empiezo?</div>
        <div className="grid gap-2 pt-1">{suggestions.map((suggestion) => <button type="button" key={suggestion} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-blue-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus-visible:ring-2 focus-visible:ring-cyan-300">{suggestion}</button>)}</div>
      </div>
      <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/30 p-2"><span className="flex-1 px-2 text-sm text-blue-100/45">Escribe una pregunta…</span><button type="button" aria-label="Enviar pregunta de vista previa" className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-200"><ArrowUp className="h-4 w-4" /></button></div>
      <p className="relative mt-3 flex items-center gap-1.5 text-[11px] text-blue-100/45"><Check className="h-3.5 w-3.5 text-cyan-300" />Vista previa · Pep no está conectado todavía</p>
    </div>
  );
}
