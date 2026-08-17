import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PepMarkdown } from "@/components/pep/PepMarkdown";

describe("PEP restricted Markdown", () => {
  it("renders the supported formatting instead of raw Markdown", () => {
    const html = renderToStaticMarkup(
      <PepMarkdown>{`### Seguridad\n\n**Evidencia:** *limitada*.\n\n- Punto uno\n- Punto dos\n\nUsa \`cautela\`.`}</PepMarkdown>,
    );

    expect(html).toContain("<h3>Seguridad</h3>");
    expect(html).toContain("<strong>Evidencia:</strong>");
    expect(html).toContain("<em>limitada</em>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<code>cautela</code>");
    expect(html).not.toContain("###");
    expect(html).not.toContain("**");
  });

  it("drops raw HTML and blocks executable links", () => {
    const html = renderToStaticMarkup(
      <PepMarkdown>{`Antes <script>alert("x")</script> después\n\n[ataque](javascript:alert(1))\n\n[protocolo](//evil.example/path)\n\n[fuente](https://example.org/source)`}</PepMarkdown>,
    );

    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("evil.example");
    expect(html).not.toContain("onclick=");
    expect(html).toContain('href="https://example.org/source"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
