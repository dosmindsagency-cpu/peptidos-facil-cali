import ReactMarkdown, { type Components } from "react-markdown";

const allowedElements = [
  "p",
  "strong",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "code",
  "a",
];

export function safePepMarkdownUrl(url: string): string {
  if ((url.startsWith("/") && !url.startsWith("//")) || url.startsWith("#")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? url : "";
  } catch {
    return "";
  }
}

const components: Components = {
  a({ children, href }) {
    const safeHref = href ? safePepMarkdownUrl(href) : "";
    if (!safeHref) return <span>{children}</span>;

    const external =
      safeHref.startsWith("http:") || safeHref.startsWith("https:");
    return (
      <a
        href={safeHref}
        {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
      >
        {children}
      </a>
    );
  },
};

export function PepMarkdown({ children }: { children: string }) {
  return (
    <div className="pep-markdown">
      <ReactMarkdown
        allowedElements={allowedElements}
        components={components}
        skipHtml
        urlTransform={safePepMarkdownUrl}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
