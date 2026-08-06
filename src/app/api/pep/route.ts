import { NextResponse } from "next/server";
import { buildPepFallback } from "@/lib/pep/fallback";
import type { PepChatRequest } from "@/lib/pep/types";

export async function POST(request: Request) {
  let body: PepChatRequest;
  try {
    body = (await request.json()) as PepChatRequest;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return NextResponse.json({ error: "Escribe una pregunta para Pep." }, { status: 400 });
  if (message.length > 1200) return NextResponse.json({ error: "La pregunta es demasiado larga." }, { status: 400 });

  const apiUrl = process.env.PEP_AI_API_URL;
  const apiKey = process.env.PEP_AI_API_KEY;
  if (apiUrl && apiKey) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ message, history: body.history ?? [] }),
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) return NextResponse.json(await response.json());
    } catch {
      // The educational fallback keeps the homepage usable when the optional backend is unavailable.
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 280));
  return NextResponse.json(buildPepFallback(message));
}
