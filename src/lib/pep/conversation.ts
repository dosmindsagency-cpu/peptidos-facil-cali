import { z } from "zod";

import {
  PEP_MAX_ASSISTANT_HISTORY_CHARS,
  PEP_MAX_HISTORY_CHARS,
  PEP_MAX_HISTORY_MESSAGES,
  PEP_MAX_QUESTION_CHARS,
} from "@/lib/pep/config";

const userMessageSchema = z
  .object({
    role: z.literal("user"),
    content: z.string().trim().min(1).max(PEP_MAX_QUESTION_CHARS),
  })
  .strict();

const assistantMessageSchema = z
  .object({
    role: z.literal("assistant"),
    content: z.string().trim().min(1).max(PEP_MAX_ASSISTANT_HISTORY_CHARS),
  })
  .strict();

export const pepConversationMessageSchema = z.discriminatedUnion("role", [
  userMessageSchema,
  assistantMessageSchema,
]);

export const pepRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(PEP_MAX_QUESTION_CHARS),
    history: z
      .array(pepConversationMessageSchema)
      .max(PEP_MAX_HISTORY_MESSAGES)
      .default([]),
    stream: z.boolean().default(true),
  })
  .strict()
  .superRefine((request, context) => {
    const historyCharacters = request.history.reduce(
      (total, historyMessage) => total + historyMessage.content.length,
      0,
    );

    if (historyCharacters > PEP_MAX_HISTORY_CHARS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "History is too large",
        path: ["history"],
        params: { rule: "history_total", limit: PEP_MAX_HISTORY_CHARS },
      });
    }
  });

export type PepConversationMessage = z.infer<
  typeof pepConversationMessageSchema
>;
export type PepRequestPayload = z.infer<typeof pepRequestSchema>;

function normalizedMessage(value: unknown): PepConversationMessage | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as { role?: unknown; content?: unknown };
  if (
    (candidate.role !== "user" && candidate.role !== "assistant") ||
    typeof candidate.content !== "string"
  ) {
    return null;
  }

  const content = candidate.content.trim();
  if (!content) return null;

  const limit =
    candidate.role === "user"
      ? PEP_MAX_QUESTION_CHARS
      : PEP_MAX_ASSISTANT_HISTORY_CHARS;

  return {
    role: candidate.role,
    content: content.slice(0, limit),
  };
}

/**
 * Converts UI/session messages into the exact, bounded history accepted by the
 * API. Unknown and UI-only fields are intentionally not copied.
 */
export function serializePepHistory(
  input: readonly unknown[],
): PepConversationMessage[] {
  const normalized = input
    .map(normalizedMessage)
    .filter((message): message is PepConversationMessage => message !== null);
  const history: PepConversationMessage[] = [];
  let characters = 0;

  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const message = normalized[index];
    if (
      history.length === PEP_MAX_HISTORY_MESSAGES ||
      characters + message.content.length > PEP_MAX_HISTORY_CHARS
    ) {
      break;
    }

    history.unshift(message);
    characters += message.content.length;
  }

  return history;
}

export function createPepRequestPayload(
  message: string,
  conversation: readonly unknown[],
): PepRequestPayload {
  return {
    message: message.trim(),
    history: serializePepHistory(conversation),
    stream: true,
  };
}
