import { z } from "zod";

import { PEP_MAX_REQUEST_BYTES } from "@/lib/pep/config";
import { pepRequestSchema } from "@/lib/pep/conversation";

export { pepRequestSchema } from "@/lib/pep/conversation";

export type ValidatedPepRequest = z.infer<typeof pepRequestSchema>;

type PepRequestParseResult =
  | { success: true; data: ValidatedPepRequest }
  | {
      success: false;
      status: 400 | 413;
      code: "INVALID_REQUEST" | "PAYLOAD_TOO_LARGE";
      message: string;
      diagnostic: PepRequestDiagnostic;
    };

export type PepRequestDiagnostic = {
  reason: "body_read" | "invalid_json" | "schema" | "payload_size";
  issues?: Array<{ rule: string; path: string; limit?: number }>;
};

function invalidRequest(
  diagnostic: PepRequestDiagnostic,
): PepRequestParseResult {
  return {
    success: false,
    status: 400,
    code: "INVALID_REQUEST",
    message: "Solicitud inválida.",
    diagnostic,
  };
}

const oversizedRequest: PepRequestParseResult = {
  success: false,
  status: 413,
  code: "PAYLOAD_TOO_LARGE",
  message: "La solicitud es demasiado grande.",
  diagnostic: { reason: "payload_size" },
};

function safeIssue(
  issue: z.ZodIssue,
): NonNullable<PepRequestDiagnostic["issues"]>[number] {
  const path = issue.path.length > 0 ? issue.path.join(".") : "$";

  if (issue.code === z.ZodIssueCode.too_big) {
    return { rule: "too_big", path, limit: Number(issue.maximum) };
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    return { rule: "too_small", path, limit: Number(issue.minimum) };
  }
  if (issue.code === z.ZodIssueCode.custom) {
    const params = issue.params as
      { rule?: unknown; limit?: unknown } | undefined;
    return {
      rule: typeof params?.rule === "string" ? params.rule : "custom",
      path,
      ...(typeof params?.limit === "number" ? { limit: params.limit } : {}),
    };
  }

  return { rule: issue.code, path };
}

export async function parsePepRequest(
  request: Request,
): Promise<PepRequestParseResult> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > PEP_MAX_REQUEST_BYTES
  ) {
    return oversizedRequest;
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return invalidRequest({ reason: "body_read" });
  }

  if (new TextEncoder().encode(rawBody).byteLength > PEP_MAX_REQUEST_BYTES) {
    return oversizedRequest;
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return invalidRequest({ reason: "invalid_json" });
  }

  const result = pepRequestSchema.safeParse(body);
  return result.success
    ? { success: true, data: result.data }
    : invalidRequest({
        reason: "schema",
        issues: result.error.issues.map(safeIssue),
      });
}
