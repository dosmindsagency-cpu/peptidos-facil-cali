import { z } from "zod";

import {
  PEP_MAX_HISTORY_CHARS,
  PEP_MAX_HISTORY_MESSAGES,
  PEP_MAX_QUESTION_CHARS,
  PEP_MAX_REQUEST_BYTES,
} from "@/lib/pep/config";

const historyMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(PEP_MAX_QUESTION_CHARS),
});

export const pepRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(PEP_MAX_QUESTION_CHARS),
    history: z
      .array(historyMessageSchema)
      .max(PEP_MAX_HISTORY_MESSAGES)
      .default([]),
    stream: z.boolean().default(true),
  })
  .strict()
  .superRefine((request, context) => {
    const historyCharacters = request.history.reduce(
      (total, message) => total + message.content.length,
      0,
    );

    if (historyCharacters > PEP_MAX_HISTORY_CHARS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "History is too large",
        path: ["history"],
      });
    }
  });

export type ValidatedPepRequest = z.infer<typeof pepRequestSchema>;

type PepRequestParseResult =
  | { success: true; data: ValidatedPepRequest }
  | {
      success: false;
      status: 400 | 413;
      code: "INVALID_REQUEST" | "PAYLOAD_TOO_LARGE";
      message: string;
    };

const invalidRequest: PepRequestParseResult = {
  success: false,
  status: 400,
  code: "INVALID_REQUEST",
  message: "Solicitud inválida.",
};

const oversizedRequest: PepRequestParseResult = {
  success: false,
  status: 413,
  code: "PAYLOAD_TOO_LARGE",
  message: "La solicitud es demasiado grande.",
};

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
    return invalidRequest;
  }

  if (new TextEncoder().encode(rawBody).byteLength > PEP_MAX_REQUEST_BYTES) {
    return oversizedRequest;
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return invalidRequest;
  }

  const result = pepRequestSchema.safeParse(body);
  return result.success ? { success: true, data: result.data } : invalidRequest;
}
