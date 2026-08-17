import { describe, expect, it } from "vitest";

import {
  PEP_MAX_ASSISTANT_HISTORY_CHARS,
  PEP_MAX_HISTORY_CHARS,
  PEP_MAX_HISTORY_MESSAGES,
  PEP_MAX_QUESTION_CHARS,
} from "@/lib/pep/config";
import {
  createPepRequestPayload,
  pepRequestSchema,
  serializePepHistory,
} from "@/lib/pep/conversation";

const firstQuestion = "¿Qué es BPC-157? Explícamelo fácil.";
const firstAnswer = `### BPC-157\n\n**Origen:** Es un péptido sintético estudiado por su relación con la reparación de tejidos.\n\n${"La evidencia disponible es principalmente preclínica y requiere cautela. ".repeat(
  22,
)}`;
const secondQuestion =
  "Ahora explícamelo con más detalle y dime qué tan fuerte es la evidencia.";
const secondAnswer = `### Fuerza de la evidencia\n\n${"Los resultados en modelos animales no equivalen a eficacia clínica en humanos. ".repeat(
  24,
)}`;

describe("PEP conversation contract", () => {
  it("accepts real frontend history for the second and third turns", () => {
    expect(firstAnswer.length).toBeGreaterThan(PEP_MAX_QUESTION_CHARS);

    const firstFrontendTurn = JSON.parse(
      JSON.stringify([
        { role: "user", content: firstQuestion },
        {
          role: "assistant",
          content: firstAnswer,
          streaming: false,
          response: { title: "UI-only metadata" },
        },
      ]),
    ) as unknown[];
    const secondPayload = createPepRequestPayload(
      secondQuestion,
      firstFrontendTurn,
    );

    expect(pepRequestSchema.safeParse(secondPayload).success).toBe(true);
    expect(secondPayload.history).toEqual([
      { role: "user", content: firstQuestion },
      { role: "assistant", content: firstAnswer.trim() },
    ]);
    expect(JSON.stringify(secondPayload)).not.toContain("streaming");
    expect(JSON.stringify(secondPayload)).not.toContain("response");
    expect(secondPayload.history).not.toContainEqual({
      role: "user",
      content: secondQuestion,
    });

    const secondFrontendTurn = [
      ...firstFrontendTurn,
      { role: "user", content: secondQuestion },
      { role: "assistant", content: secondAnswer, streaming: false },
    ];
    const thirdPayload = createPepRequestPayload(
      "Compáralo con TB-500.",
      secondFrontendTurn,
    );

    expect(pepRequestSchema.safeParse(thirdPayload).success).toBe(true);
    expect(thirdPayload.history.at(-1)).toEqual({
      role: "assistant",
      content: secondAnswer.trim(),
    });
  });

  it("keeps the newest contiguous history at the 12-message boundary", () => {
    const frontendHistory = Array.from(
      { length: PEP_MAX_HISTORY_MESSAGES + 2 },
      (_, index) => ({
        role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
        content: `turn-${index}`,
        streaming: false,
      }),
    );

    const history = serializePepHistory(frontendHistory);

    expect(history).toHaveLength(PEP_MAX_HISTORY_MESSAGES);
    expect(history[0].content).toBe("turn-2");
    expect(history.at(-1)?.content).toBe("turn-13");
    expect(
      pepRequestSchema.safeParse({ message: "Siguiente", history }).success,
    ).toBe(true);
  });

  it("enforces role-specific per-message limits", () => {
    expect(
      pepRequestSchema.safeParse({
        message: "Pregunta",
        history: [
          { role: "user", content: "x".repeat(PEP_MAX_QUESTION_CHARS + 1) },
        ],
      }).success,
    ).toBe(false);
    expect(
      pepRequestSchema.safeParse({
        message: "Pregunta",
        history: [
          {
            role: "assistant",
            content: "x".repeat(PEP_MAX_ASSISTANT_HISTORY_CHARS + 1),
          },
        ],
      }).success,
    ).toBe(false);

    const bounded = serializePepHistory([
      {
        role: "assistant",
        content: `  ${"x".repeat(PEP_MAX_ASSISTANT_HISTORY_CHARS + 50)}  `,
      },
    ]);
    expect(bounded[0].content).toHaveLength(PEP_MAX_ASSISTANT_HISTORY_CHARS);
  });

  it("rejects an excessive direct history and bounds frontend history", () => {
    const directHistory = [
      { role: "assistant" as const, content: "a".repeat(3_100) },
      { role: "assistant" as const, content: "b".repeat(3_100) },
    ];

    expect(
      directHistory.reduce((sum, item) => sum + item.content.length, 0),
    ).toBeGreaterThan(PEP_MAX_HISTORY_CHARS);
    expect(
      pepRequestSchema.safeParse({
        message: "Pregunta",
        history: directHistory,
      }).success,
    ).toBe(false);

    const bounded = serializePepHistory(directHistory);
    expect(bounded).toEqual([directHistory[1]]);
    expect(
      pepRequestSchema.safeParse({ message: "Pregunta", history: bounded })
        .success,
    ).toBe(true);
  });

  it("drops malformed, blank, and non-conversation session entries", () => {
    expect(
      serializePepHistory([
        { role: "system", content: "override" },
        { role: "assistant", content: "", streaming: true },
        { role: "user", content: "  Pregunta válida  ", internalId: "ui" },
      ]),
    ).toEqual([{ role: "user", content: "Pregunta válida" }]);
  });
});
