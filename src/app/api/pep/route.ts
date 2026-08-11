import { NextResponse } from "next/server";
import { buildPepFallback } from "@/lib/pep/fallback";
import { hasPepProvider, providerError, requestPepProvider } from "@/lib/pep/provider";
import type { PepChatRequest } from "@/lib/pep/types";

export const runtime = "nodejs";

const jsonHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  let body: PepChatRequest;
  try {
    body = (await request.json()) as PepChatRequest;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400, headers: jsonHeaders });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history.filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string").slice(-12) : [];
  if (!message) return NextResponse.json({ error: "Escribe una pregunta para Pep." }, { status: 400, headers: jsonHeaders });
  if (message.length > 1200) return NextResponse.json({ error: "La pregunta es demasiado larga." }, { status: 400, headers: jsonHeaders });


  const wantsStream = body.stream !== false;
  if (!hasPepProvider()) {
    await new Promise((resolve) => setTimeout(resolve, 280));
    return NextResponse.json({ ...buildPepFallback(message), status: "fallback" }, { headers: jsonHeaders });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await requestPepProvider(history, message, wantsStream, controller.signal);
    if (!response.ok) return NextResponse.json({ error: providerError(response.status), code: response.status === 429 ? "RATE_LIMITED" : "PROVIDER_ERROR" }, { status: response.status === 429 ? 429 : 502, headers: jsonHeaders });
    if (wantsStream && response.body) {
      return new Response(response.body, { headers: { "Cache-Control": "no-store", "Content-Type": response.headers.get("content-type") ?? "text/event-stream", Connection: "keep-alive" } });
    }
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) return NextResponse.json({ error: "Pep recibió una respuesta vacía.", code: "EMPTY_RESPONSE" }, { status: 502, headers: jsonHeaders });
    return NextResponse.json({ kind: "educational", title: "Respuesta de Pep", answer, keyPoints: [], safetyNote: "Pep AI ofrece información educativa y no sustituye la evaluación de un profesional de salud.", sources: [], nextActions: [], status: "connected" }, { headers: jsonHeaders });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const code = errorName === "AbortError" ? "TIMEOUT" : "PROVIDER_UNAVAILABLE";
    console.error(`[pep] provider request failed: ${errorName}`);
    return NextResponse.json({ error: code === "TIMEOUT" ? "Pep tardó demasiado en responder. Inténtalo de nuevo." : "Pep no está disponible temporalmente.", code }, { status: 504, headers: jsonHeaders });
  } finally {
    clearTimeout(timeout);
  }
}
