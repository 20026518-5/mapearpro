import { useEffect, useRef, useState } from "react";

export function MermaidView({ code, theme }: { code: string; theme: "light" | "dark" }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = useRef(0);

  useEffect(() => {
    const token = ++run.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const mermaid = (await import("mermaid")).default;
          const dark = theme === "dark";
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            fontFamily: "Source Sans 3, sans-serif",
            flowchart: { curve: "basis", htmlLabels: false, padding: 12 },
            themeVariables: {
              background: dark ? "#121311" : "#fbfaf6",
              primaryColor: dark ? "#1b1c19" : "#fbfaf6",
              primaryTextColor: dark ? "#f3f1eb" : "#1c1915",
              primaryBorderColor: dark ? "#d7e4dc" : "#1c1915",
              lineColor: dark ? "#d7e4dc" : "#1e3a32",
              secondaryColor: dark ? "#24302b" : "#e4efe9",
              tertiaryColor: dark ? "#1b1c19" : "#f3f1eb",
              fontFamily: "Source Sans 3, sans-serif",
            },
          });
          const rendered = await mermaid.render(`pm${token}`, code);
          if (run.current === token) {
            setSvg(rendered.svg);
            setError(null);
          }
        } catch (caught) {
          if (run.current === token) {
            setSvg(null);
            setError(caught instanceof Error ? caught.message : "Não foi possível desenhar o diagrama.");
          }
        }
      })();
    }, 160);
    return () => window.clearTimeout(timer);
  }, [code, theme]);

  if (error) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-danger" role="alert">
          O diagrama não pôde ser desenhado. O código Mermaid continua disponível abaixo.
        </p>
        <pre className="overflow-auto rounded-md border border-line bg-paper p-4 font-mono text-xs text-ink">{code}</pre>
      </div>
    );
  }

  if (!svg) {
    return <p className="text-sm text-ink-soft">Gerando diagrama…</p>;
  }

  return <div className="mermaid-host overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
}
