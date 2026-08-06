"use client";

import Link from "next/link";
import { ArrowUp, BookOpen, Bot, CheckCircle2, ExternalLink, LoaderCircle, Plus, Send, ShieldAlert, Sparkles } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { PepSphere } from "@/components/home/PepSphere";

import type { PepChatMessage, PepResponse } from "@/lib/pep/types";

const prompts = ["Quiero entender un péptido", "Comparar dos péptidos", "Calcular una reconstitución", "Revisar posibles riesgos"];
type Message = PepChatMessage & { response?: PepResponse; streaming?: boolean };
const STORAGE_KEY = "pf-cali-pep-session";

export function PepWorkspace({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const timer = window.setTimeout(() => { try { const stored = sessionStorage.getItem(STORAGE_KEY); if (stored) setMessages(JSON.parse(stored) as Message[]); } catch { /* session storage unavailable */ } }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* session storage unavailable */ } bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function clearConversation() { setMessages([]); setValue(""); setError(""); try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ } }

  async function submit(message = value) {
    const text = message.trim(); if (!text || processing) return;
    setValue(""); setError("");
    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setProcessing(true);
    try {
      const response = await fetch("/api/pep", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history: messages.map(({ role, content }) => ({ role, content })), stream: true }) });
      if (!response.ok) { const data = (await response.json()) as { error?: string }; throw new Error(data.error ?? "Pep no pudo responder."); }
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("text/event-stream") && response.body) {
        const assistantIndex = nextHistory.length;
        setMessages((current) => [...current, { role: "assistant", content: "", streaming: true }]);
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
        while (true) { const { value: chunk, done } = await reader.read(); if (done) break; buffer += decoder.decode(chunk, { stream: true }); const lines = buffer.split("\n"); buffer = lines.pop() ?? ""; for (const line of lines) { if (!line.startsWith("data:")) continue; const payload = line.slice(5).trim(); if (payload === "[DONE]") continue; try { const parsed = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> }; const token = parsed.choices?.[0]?.delta?.content ?? ""; if (token) setMessages((current) => current.map((item, index) => index === assistantIndex ? { ...item, content: item.content + token } : item)); } catch { /* ignore provider keep-alives */ } } }
        setMessages((current) => current.map((item, index) => index === assistantIndex ? { ...item, streaming: false } : item));
      } else {
        const data = (await response.json()) as PepResponse; setMessages((current) => [...current, { role: "assistant", content: data.answer, response: data }]);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Pep no pudo responder en este momento.");

    } finally { setProcessing(false); }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }

  return <div className={compact ? "pep-chat-shell pep-chat-compact" : "pep-workspace-shell"}>
    <header className="pep-chat-topline"><div className="flex items-center gap-3"><div className="pep-avatar"><Bot className="h-5 w-5" /></div><div><p className="font-semibold text-white">Pep AI</p><p className="flex items-center gap-1.5 text-xs text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Educativo y contextual</p></div></div><div className="flex items-center gap-3"><PepSphere processing={processing} /><button type="button" onClick={clearConversation} className="pep-new-button" aria-label="Nueva conversación"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Nueva</span></button></div></header>
    <div className="pep-chat-body pep-workspace-body" aria-live="polite">
      {messages.length === 0 ? <div className="pep-empty"><Sparkles className="h-5 w-5 text-cyan-300" /><p className="mt-3 font-medium text-white">¿Qué quieres entender hoy?</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Explora conceptos, compara información o encuentra el recurso educativo adecuado.</p><div className="mt-6 flex flex-wrap justify-center gap-2">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => void submit(prompt)} className="pep-prompt-chip">{prompt}</button>)}</div></div> : messages.map((message, index) => <div key={`${message.role}-${index}`} className={`pep-message ${message.role === "user" ? "pep-message-user" : "pep-message-assistant"}`}><p>{message.content}{message.streaming && <span className="pep-cursor" />}</p>{message.response && <PepResponseCard response={message.response} />}</div>)}
      {processing && !messages.some((message) => message.streaming) && <div className="pep-processing"><LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />Pep está organizando una respuesta…</div>}
      {error && <div className="pep-error" role="alert"><ShieldAlert className="h-4 w-4 shrink-0" />{error}</div>}<div ref={bottomRef} />
    </div>
    {messages.length > 0 && <div className="pep-prompt-row" aria-label="Sugerencias para continuar">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => void submit(prompt)} disabled={processing} className="pep-prompt-chip">{prompt}</button>)}</div>}
    <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void submit(); }} className="pep-composer"><textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} rows={1} maxLength={1200} aria-label="Escribe una pregunta para Pep" placeholder="Escribe una pregunta para Pep…" /><button type="submit" disabled={!value.trim() || processing} aria-label="Enviar pregunta"><Send className="h-4 w-4" /></button></form>
    <div className="pep-chat-footnote"><ShieldAlert className="h-3.5 w-3.5" />Pep AI ofrece información educativa y no sustituye la evaluación de un profesional de salud.</div>
  </div>;
}

function PepResponseCard({ response }: { response: PepResponse }) {
  return <div className="pep-response-card"><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /><div><h3 className="text-sm font-semibold text-white">{response.title}</h3>{response.keyPoints.length > 0 && <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{response.keyPoints.map((point) => <li key={point}>• {point}</li>)}</ul>}</div></div>{response.safetyNote && <div className="pep-safety"><ShieldAlert className="h-4 w-4 shrink-0 text-cyan-300" />{response.safetyNote}</div>}{response.sources.length > 0 && <details className="pep-sources-details"><summary><BookOpen className="h-3.5 w-3.5" />Fuentes ({response.sources.length})</summary><div className="mt-2 grid gap-2">{response.sources.map((source) => <Link key={source.href} href={source.href} className="pep-source"><ExternalLink className="h-3.5 w-3.5" />{source.label}</Link>)}</div></details>}{response.nextActions.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{response.nextActions.map((action) => action.href ? <Link key={action.label} href={action.href} className="pep-action">{action.label}<ArrowUp className="h-3.5 w-3.5" /></Link> : null)}</div>}</div>;
}
