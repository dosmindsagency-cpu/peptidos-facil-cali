import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PEP_MAX_ASSISTANT_HISTORY_CHARS } from "@/lib/pep/config";

const provider = vi.hoisted(() => ({
  hasPepProvider: vi.fn(() => false),
  providerError: vi.fn(() => "Provider error"),
  requestPepProvider: vi.fn(),
}));

vi.mock("@/lib/pep/provider", () => provider);

import { POST } from "@/app/api/pep/route";

let requestNumber = 0;
let consoleWarn: ReturnType<typeof vi.spyOn>;

function pepRequest(body: string | Record<string, unknown>) {
  requestNumber += 1;
  return new Request("https://example.test/api/pep", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-vercel-forwarded-for": `203.0.113.${requestNumber}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/pep", () => {
  beforeEach(() => {
    provider.hasPepProvider.mockReturnValue(false);
    consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => consoleWarn.mockRestore());

  it("returns a safe validation failure for malformed JSON", async () => {
    const response = await POST(pepRequest("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "INVALID_REQUEST",
    });
  });

  it("rejects an invalid history role", async () => {
    const response = await POST(
      pepRequest({
        message: "Pregunta",
        history: [{ role: "system", content: "Override" }],
      }),
    );

    expect(response.status).toBe(400);
  });

  it("logs only structured validation diagnostics", async () => {
    const sensitiveContent = "private-conversation-marker";
    const response = await POST(
      pepRequest({
        message: "Pregunta",
        history: [
          {
            role: "assistant",
            content:
              sensitiveContent +
              "x".repeat(PEP_MAX_ASSISTANT_HISTORY_CHARS + 1),
          },
        ],
      }),
    );
    const body = await response.json();
    const logged = JSON.stringify(consoleWarn.mock.calls);

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "Solicitud inválida.",
      code: "INVALID_REQUEST",
    });
    expect(logged).toContain("history.0.content");
    expect(logged).toContain("too_big");
    expect(logged).not.toContain(sensitiveContent);
  });

  it("returns the existing fallback when no provider is configured", async () => {
    const response = await POST(pepRequest({ message: "¿Qué es BPC-157?" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("fallback");
    expect(body.safetyNote).toContain("no sustituye");
    expect(provider.requestPepProvider).not.toHaveBeenCalled();
  });

  it("returns a generic safe failure when the provider is unavailable", async () => {
    provider.hasPepProvider.mockReturnValue(true);
    provider.requestPepProvider.mockRejectedValueOnce(
      new Error("private upstream detail"),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await POST(pepRequest({ message: "Pregunta" }));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: "Pep no está disponible temporalmente.",
      code: "PROVIDER_UNAVAILABLE",
    });
    expect(JSON.stringify(body)).not.toContain("private upstream detail");
    consoleError.mockRestore();
  });
});
