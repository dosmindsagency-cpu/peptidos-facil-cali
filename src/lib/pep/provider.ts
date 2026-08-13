import "server-only";

import {
  PEP_MAX_HISTORY_MESSAGES,
  PEP_MAX_OUTPUT_TOKENS,
  resolvePepModel,
} from "@/lib/pep/config";
import { PEP_SYSTEM_PROMPT } from "@/lib/pep/system";
import type { PepChatMessage } from "@/lib/pep/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export function hasPepProvider() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export function providerMessages(history: PepChatMessage[], message: string) {
  return [
    { role: "system", content: PEP_SYSTEM_PROMPT },
    ...history
      .slice(-PEP_MAX_HISTORY_MESSAGES)
      .map(({ role, content }) => ({ role, content })),
    { role: "user" as const, content: message },
  ];
}

export async function requestPepProvider(
  history: PepChatMessage[],
  message: string,
  stream: boolean,
  signal: AbortSignal,
) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("PEP_PROVIDER_NOT_CONFIGURED");
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: resolvePepModel(process.env.OPENROUTER_MODEL),
      messages: providerMessages(history, message),
      stream,
      temperature: 0.2,
      max_tokens: PEP_MAX_OUTPUT_TOKENS,
    }),
    signal,
  });
  return response;
}

export function providerError(status: number) {
  if (status === 401 || status === 403)
    return "Pep no está disponible temporalmente.";
  if (status === 429)
    return "Pep está recibiendo muchas preguntas. Inténtalo de nuevo en unos minutos.";
  if (status >= 500)
    return "Pep no pudo conectarse con su servicio de respuestas.";
  return "Pep no pudo completar esta respuesta.";
}
