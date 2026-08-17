export type PepResponseKind =
  "educational" | "summary" | "comparison" | "calculator" | "error";

export type PepSource = { label: string; href: string };
export type PepNextAction = { label: string; href?: string; prompt?: string };

export type PepResponse = {
  kind: PepResponseKind;
  title: string;
  answer: string;
  keyPoints: string[];
  safetyNote: string;
  sources: PepSource[];
  nextActions: PepNextAction[];
  status?: "fallback" | "connected";
};

export type {
  PepConversationMessage as PepChatMessage,
  PepRequestPayload as PepChatRequest,
} from "@/lib/pep/conversation";
