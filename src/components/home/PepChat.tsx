"use client";

import Link from "next/link";
import { ArrowUp, BookOpen, Bot, Calculator, CheckCircle2, LoaderCircle, Send, ShieldAlert, Sparkles } from "lucide-react";
import { FormEvent, KeyboardEvent, useState } from "react";
import { PepSphere } from "@/components/home/PepSphere";
import type { PepResponse } from "@/lib/pep/types";

const prompts = ["Quiero entender un péptido", "Comparar dos péptidos", "Calcular una reconstitución", "Revisar posibles riesgos"];

type Message = { role: "user" | "assistant"; content: string; response?: PepResponse };

export function PepChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function submit(message = value) {
    const text = message.trim();
    if (!text || processing) return;
    setValue("");
    setError("");
    setMessages((current) => [...current, { role: "user", content: text }]);
    setProcessing(true);
    try {
      const response = await fetch("/api/pep", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history: messages.map(({ role, content }) => ({ role, content })) }) });
      const data = (await response.json()) as PepResponse & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Pep no pudo responder en este momento.");
      setMessages((current) => [...current, { role: "assistant", content: data.answer, response: data }]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Pep no pudo responder en este momento.");
    } finally {
      setProcessing(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); }
  }

  return <div className="pep-chat-shell">
    <div className="pep-chat-topline"><div className="flex items-center gap-3"><div className="pep-avatar"><Bot className="h-5 w-5" /></div><div><p className="font-semibold text-white">Pep AI</p><p className="flex items-center gap-1.5 text-xs text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Educativo y contextual</p></div></div><PepSphere processing={processing} /></div>
    <div className="pep-chat-body" aria-live="polite">
      {messages.length === 0 ? <div className="pep-empty"><Sparkles className="h-5 w-5 text-cyan-300" /><p className="mt-3 font-medium text-white">¿Qué quieres entender hoy?</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Explora conceptos, compara información o encuentra el recurso educativo adecuado.</p></div> : messages.map((message, index) => <div key={`${message.role}-${index}`} className={`pep-message ${message.role === "user" ? "pep-message-user" : "pep-message-assistant"}`}><p>{message.content}</p>{message.response && <PepResponseCard response={message.response} onPrompt={(prompt) => void submit(prompt)} />}</div>)}
      {processing && <div className="pep-processing"><LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />Pep está organizando una respuesta…</div>}
      {error && <div className="pep-error" role="alert"><ShieldAlert className="h-4 w-4 shrink-0" />{error}</div>}
    </div>
    <div className="pep-prompt-row" aria-label="Sugerencias para comenzar">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => void submit(prompt)} disabled={processing} className="pep-prompt-chip">{prompt}</button>)}</div>
    <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void submit(); }} className="pep-composer"><textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} rows={1} maxLength={1200} aria-label="Escribe una pregunta para Pep" placeholder="Escribe una pregunta para Pep…" /><button type="submit" disabled={!value.trim() || processing} aria-label="Enviar pregunta"><Send className="h-4 w-4" /></button></form>
    <div className="pep-chat-footnote"><ShieldAlert className="h-3.5 w-3.5" />Pep AI ofrece información educativa y no sustituye la evaluación de un profesional de salud.</div>
  </div>;
}

function PepResponseCard({ response, onPrompt }: { response: PepResponse; onPrompt: (prompt: string) => void }) {
  return <div className="pep-response-card"><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /><div><h3 className="text-sm font-semibold text-white">{response.title}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{response.keyPoints.map((point) => <li key={point}>• {point}</li>)}</ul></div></div><div className="pep-safety"><ShieldAlert className="h-4 w-4 shrink-0 text-cyan-300" />{response.safetyNote}</div><div className="mt-4 flex flex-wrap gap-2">{response.sources.map((source) => <Link key={source.href} href={source.href} className="pep-source"><BookOpen className="h-3.5 w-3.5" />{source.label}</Link>)}{response.nextActions.map((action) => action.href ? <Link key={action.label} href={action.href} className="pep-action">{action.label}<ArrowUp className="h-3.5 w-3.5" /></Link> : <button key={action.label} type="button" onClick={() => onPrompt(action.prompt ?? action.label)} className="pep-action">{action.label}<Calculator className="h-3.5 w-3.5" /></button>)}</div></div>;
}
