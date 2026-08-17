import { NextResponse } from "next/server";

import { PEP_REQUEST_TIMEOUT_MS } from "@/lib/pep/config";
import { buildPepFallback } from "@/lib/pep/fallback";
import {
  hasPepProvider,
  providerError,
  requestPepProvider,
} from "@/lib/pep/provider";
import { checkPepRateLimit } from "@/lib/pep/rate-limit";
import { parsePepRequest } from "@/lib/pep/request";

export const runtime = "nodejs";

const jsonHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const rateLimit = checkPepRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo de nuevo en un momento." },
      {
        status: 429,
        headers: {
          ...jsonHeaders,
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const parsedRequest = await parsePepRequest(request);
  if (!parsedRequest.success) {
    console.warn("[pep] request validation failed", parsedRequest.diagnostic);
    return NextResponse.json(
      { error: parsedRequest.message, code: parsedRequest.code },
      { status: parsedRequest.status, headers: jsonHeaders },
    );
  }

  const { message, history, stream } = parsedRequest.data;

  if (!hasPepProvider()) {
    await new Promise((resolve) => setTimeout(resolve, 280));
    return NextResponse.json(
      { ...buildPepFallback(message), status: "fallback" },
      { headers: jsonHeaders },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PEP_REQUEST_TIMEOUT_MS);
  try {
    const response = await requestPepProvider(
      history,
      message,
      stream,
      controller.signal,
    );
    if (!response.ok)
      return NextResponse.json(
        {
          error: providerError(response.status),
          code: response.status === 429 ? "RATE_LIMITED" : "PROVIDER_ERROR",
        },
        { status: response.status === 429 ? 429 : 502, headers: jsonHeaders },
      );
    if (stream && response.body) {
      return new Response(response.body, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type":
            response.headers.get("content-type") ?? "text/event-stream",
          Connection: "keep-alive",
        },
      });
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer)
      return NextResponse.json(
        { error: "Pep recibió una respuesta vacía.", code: "EMPTY_RESPONSE" },
        { status: 502, headers: jsonHeaders },
      );
    return NextResponse.json(
      {
        kind: "educational",
        title: "Respuesta de Pep",
        answer,
        keyPoints: [],
        safetyNote:
          "Pep AI ofrece información educativa y no sustituye la evaluación de un profesional de salud.",
        sources: [],
        nextActions: [],
        status: "connected",
      },
      { headers: jsonHeaders },
    );
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const code =
      errorName === "AbortError" ? "TIMEOUT" : "PROVIDER_UNAVAILABLE";
    console.error(`[pep] provider request failed: ${errorName}`);
    return NextResponse.json(
      {
        error:
          code === "TIMEOUT"
            ? "Pep tardó demasiado en responder. Inténtalo de nuevo."
            : "Pep no está disponible temporalmente.",
        code,
      },
      { status: code === "TIMEOUT" ? 504 : 503, headers: jsonHeaders },
    );
  } finally {
    clearTimeout(timeout);
  }
}
