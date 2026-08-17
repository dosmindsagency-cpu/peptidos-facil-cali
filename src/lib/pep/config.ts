export const PEP_DEFAULT_MODEL = "openai/gpt-4o-mini";

export const PEP_ALLOWED_MODELS = [PEP_DEFAULT_MODEL] as const;

export const PEP_MAX_OUTPUT_TOKENS = 900;
export const PEP_REQUEST_TIMEOUT_MS = 30_000;
export const PEP_MAX_QUESTION_CHARS = 1_200;
export const PEP_MAX_ASSISTANT_HISTORY_CHARS = 4_000;
export const PEP_MAX_HISTORY_MESSAGES = 12;
export const PEP_MAX_HISTORY_CHARS = 6_000;
export const PEP_MAX_REQUEST_BYTES = 16_384;

const allowedModels = new Set<string>(PEP_ALLOWED_MODELS);

export function resolvePepModel(candidate?: string): string {
  const model = candidate?.trim();
  return model && allowedModels.has(model) ? model : PEP_DEFAULT_MODEL;
}
