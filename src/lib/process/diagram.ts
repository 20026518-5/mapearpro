import {
  type Branch,
  type FlowNode,
  type ProcessData,
  NODE_H,
  NODE_W,
  nodeLabel,
} from "./model";

function escapeMermaid(value: string): string {
  const clean = value.replace(/"/g, "'").replace(/[[\]{}|#<>]/g, " ").replace(/\s+/g, " ").trim();
  return clean || "Etapa";
}

function safeId(id: string): string {
  const clean = id.replace(/[^a-zA-Z0-9_]/g, "_");
  return /^[a-zA-Z_]/.test(clean) ? clean : `n_${clean}`;
}

export function buildMermaid(
  data: Pick<ProcessData, "nodes" | "edges" | "activities" | "decisions">,
): string {
  const lines = ["flowchart LR"];
  if (data.nodes.length === 0) {
    lines.push('  vazio["Nenhum nó no fluxo"]');
    return lines.join("\n");
  }
  for (const node of data.nodes) {
    const id = safeId(node.id);
    const label = escapeMermaid(nodeLabel(node, data));
    if (node.kind === "decision") lines.push(`  ${id}{"${label}"}`);
    else if (node.kind === "start" || node.kind === "end") lines.push(`  ${id}(["${label}"])`);
    else lines.push(`  ${id}["${label}"]`);
  }
  const ids = new Set(data.nodes.map((node) => node.id));
  for (const edge of data.edges) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) continue;
    const via =
      edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "";
    lines.push(
      via
        ? `  ${safeId(edge.source)} -->|${via}| ${safeId(edge.target)}`
        : `  ${safeId(edge.source)} --> ${safeId(edge.target)}`,
    );
  }
  return lines.join("\n");
}

export function portPoint(
  node: Pick<FlowNode, "x" | "y">,
  side: "in" | "out",
  branch: Branch = "fluxo",
): { x: number; y: number } {
  const yOff = branch === "sim" ? -16 : branch === "nao" ? 16 : 0;
  if (side === "out") return { x: node.x + NODE_W, y: node.y + NODE_H / 2 + yOff };
  return { x: node.x, y: node.y + NODE_H / 2 };
}

export function edgePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { d: string; mx: number; my: number } {
  const dx = Math.max(48, Math.abs(x2 - x1) / 2);
  const c1x = x1 + (x2 >= x1 ? dx : -dx);
  const c2x = x2 - (x2 >= x1 ? dx : -dx);
  const d = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
  const t = 0.5;
  const mt = 1 - t;
  const mx = mt ** 3 * x1 + 3 * mt ** 2 * t * c1x + 3 * mt * t ** 2 * c2x + t ** 3 * x2;
  const my = mt ** 3 * y1 + 3 * mt ** 2 * t * y1 + 3 * mt * t ** 2 * y2 + t ** 3 * y2;
  return { d, mx, my };
}

function xml(value: string): string {
  return value
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

function wrapLabel(value: string, max = 26): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return (lines.length ? lines : ["Etapa"]).slice(0, 3);
}

export function buildMapSvg(
  data: Pick<ProcessData, "nodes" | "edges" | "activities" | "decisions" | "name">,
  theme: "light" | "dark" = "light",
): string {
  const dark = theme === "dark";
  const accent = dark ? "#d7e4dc" : "#1e3a32";
  const accentFg = dark ? "#12201b" : "#f6f3ec";
  const paper = dark ? "#121311" : "#fbfaf6";
  const ink = dark ? "#f3f1eb" : "#1c1915";
  const soft = dark ? "#b7b2a6" : "#5e584e";
  const line = dark ? "#34362f" : "#1c1915";
  const decision = dark ? "#24302b" : "#e4efe9";
  const card = dark ? "#1b1c19" : "#fbfaf6";

  const nodes = data.nodes;
  const pad = 40;
  const titleH = 72;
  const maxX = Math.max(480, ...nodes.map((node) => node.x + NODE_W), 0);
  const maxY = Math.max(180, ...nodes.map((node) => node.y + NODE_H), 0);
  const width = maxX + pad * 2;
  const height = maxY + pad * 2 + titleH;
  const shiftX = pad;
  const shiftY = pad + titleH;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
  );
  parts.push(`<rect width="100%" height="100%" fill="${paper}"/>`);
  parts.push(
    `<text x="${pad}" y="36" fill="${ink}" font-family="Georgia, serif" font-size="22">${xml(data.name.trim() || "Processo sem nome")}</text>`,
  );
  parts.push(
    `<text x="${pad}" y="58" fill="${soft}" font-family="Source Sans 3, sans-serif" font-size="13">Mapa consolidado · ProcessMapper Pro</text>`,
  );
  parts.push(
    `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${ink}"/></marker></defs>`,
  );

  const ids = new Set(nodes.map((node) => node.id));
  for (const edge of data.edges) {
    const source = nodes.find((node) => node.id === edge.source);
    const target = nodes.find((node) => node.id === edge.target);
    if (!source || !target || !ids.has(edge.source)) continue;
    const from = portPoint(source, "out", source.kind === "decision" ? edge.branch : "fluxo");
    const to = portPoint(target, "in");
    const path = edgePath(from.x + shiftX, from.y + shiftY, to.x + shiftX, to.y + shiftY);
    parts.push(
      `<path d="${path.d}" fill="none" stroke="${ink}" stroke-width="2" marker-end="url(#arrow)"/>`,
    );
    if (edge.branch === "sim" || edge.branch === "nao") {
      const label = edge.branch === "sim" ? "Sim" : "Não";
      parts.push(
        `<rect x="${path.mx - 18}" y="${path.my - 11}" width="36" height="18" rx="9" fill="${paper}" stroke="${line}"/>`,
      );
      parts.push(
        `<text x="${path.mx}" y="${path.my + 3}" text-anchor="middle" fill="${ink}" font-family="Source Sans 3, sans-serif" font-size="11">${label}</text>`,
      );
    }
  }

  for (const node of nodes) {
    const x = node.x + shiftX;
    const y = node.y + shiftY;
    const label = wrapLabel(nodeLabel(node, data));
    const fill = node.kind === "decision" ? decision : node.kind === "start" || node.kind === "end" ? accent : card;
    const text = node.kind === "start" || node.kind === "end" ? accentFg : ink;
    const kicker =
      node.kind === "decision"
        ? "Decisão"
        : node.kind === "activity"
          ? "Atividade"
          : node.kind === "start"
            ? "Início"
            : "Fim";
    const radius = node.kind === "start" || node.kind === "end" ? 999 : 16;
    parts.push(
      `<rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}" rx="${radius}" fill="${fill}" stroke="${line}" stroke-width="1.25"/>`,
    );
    if (node.kind !== "start" && node.kind !== "end") {
      parts.push(
        `<text x="${x + 16}" y="${y + 24}" fill="${soft}" font-family="Source Sans 3, sans-serif" font-size="11" letter-spacing="0.08em">${kicker.toUpperCase()}</text>`,
      );
    }
    label.forEach((lineText, index) => {
      const base = node.kind === "start" || node.kind === "end" ? 46 : 48;
      parts.push(
        `<text x="${x + NODE_W / 2}" y="${y + base + index * 16}" text-anchor="middle" fill="${text}" font-family="Source Sans 3, sans-serif" font-size="14">${xml(lineText)}</text>`,
      );
    });
  }

  if (nodes.length === 0) {
    parts.push(
      `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="${soft}" font-family="Source Sans 3, sans-serif" font-size="16">Nenhum fluxo para exportar</text>`,
    );
  }

  parts.push("</svg>");
  return parts.join("");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadText(filename: string, text: string, mime: string) {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

/** Copies text during a click. The Clipboard API is often denied inside an embedded preview; execCommand still works on the same gesture. */
export async function copyText(text: string): Promise<boolean> {
  if (copyWithCommand(text)) return true;
  if (!navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function copyWithCommand(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "0";
  area.style.top = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, text.length);

  let placed = false;
  const onCopy = (event: ClipboardEvent) => {
    event.preventDefault();
    event.clipboardData?.setData("text/plain", text);
    placed = true;
  };
  document.addEventListener("copy", onCopy, true);
  let commandOk = false;
  try {
    commandOk = document.execCommand("copy");
  } catch {
    commandOk = false;
  }
  document.removeEventListener("copy", onCopy, true);
  area.remove();
  return placed && commandOk;
}

export async function downloadSvgAsPng(svg: string, filename: string, background: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Não foi possível montar a imagem."));
      image.src = url;
    });
    const width = image.naturalWidth || 1200;
    const height = image.naturalHeight || 700;
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponível.");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!png) throw new Error("Falha ao gerar PNG.");
    downloadBlob(png, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}
