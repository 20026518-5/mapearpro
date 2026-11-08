import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";

import { buildMapSvg, downloadBlob } from "./diagram";
import {
  CHECK_ITEMS,
  GRANULARITY_LABEL,
  STEPS,
  allIssues,
  fileSlug,
  nodeLabel,
  type ProcessData,
} from "./model";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const BOTTOM = 56;

const INK = rgb(0.11, 0.098, 0.082);
const SOFT = rgb(0.369, 0.345, 0.306);
const ACCENT = rgb(0.118, 0.227, 0.196);
const RULE = rgb(0.78, 0.75, 0.7);

function pdfText(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/[^\n\t\x20-\x7E\u00A0-\u00FF]/g, "");
}

function activityName(data: ProcessData, id: string): string {
  return data.activities.find((item) => item.id === id)?.name.trim() || "Atividade";
}

class Report {
  private readonly doc: PDFDocument;
  private readonly font: PDFFont;
  private readonly bold: PDFFont;
  private page!: PDFPage;
  private y = 0;
  private pageNumber = 0;
  private readonly title: string;

  private constructor(doc: PDFDocument, font: PDFFont, bold: PDFFont, title: string) {
    this.doc = doc;
    this.font = font;
    this.bold = bold;
    this.title = title;
  }

  static async create(title: string): Promise<Report> {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const report = new Report(doc, font, bold, title);
    report.addPage(true);
    return report;
  }

  private contentWidth(): number {
    return PAGE_W - MARGIN * 2;
  }

  private addPage(first = false) {
    if (this.page) this.paintFooter();
    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    this.pageNumber += 1;
    if (first) {
      this.page.drawRectangle({ x: 0, y: PAGE_H - 10, width: PAGE_W, height: 10, color: ACCENT });
      this.page.drawText("ProcessMapper Pro", {
        x: MARGIN,
        y: PAGE_H - 36,
        size: 11,
        font: this.bold,
        color: ACCENT,
      });
      const lines = this.wrap(this.title, this.bold, 22);
      let cursor = PAGE_H - 64;
      for (const line of lines.slice(0, 3)) {
        this.page.drawText(line, { x: MARGIN, y: cursor, size: 22, font: this.bold, color: INK });
        cursor -= 26;
      }
      this.page.drawText("Relatório do mapeamento", {
        x: MARGIN,
        y: cursor,
        size: 11,
        font: this.font,
        color: SOFT,
      });
      this.y = cursor - 28;
      return;
    }
    this.page.drawText(this.truncate(this.title, this.font, 9, this.contentWidth() - 120), {
      x: MARGIN,
      y: PAGE_H - 32,
      size: 9,
      font: this.font,
      color: SOFT,
    });
    this.page.drawText("ProcessMapper Pro", {
      x: PAGE_W - MARGIN - this.font.widthOfTextAtSize("ProcessMapper Pro", 9),
      y: PAGE_H - 32,
      size: 9,
      font: this.font,
      color: SOFT,
    });
    this.page.drawLine({
      start: { x: MARGIN, y: PAGE_H - 40 },
      end: { x: PAGE_W - MARGIN, y: PAGE_H - 40 },
      thickness: 0.6,
      color: RULE,
    });
    this.y = PAGE_H - 64;
  }

  private paintFooter() {
    this.page.drawLine({
      start: { x: MARGIN, y: 40 },
      end: { x: PAGE_W - MARGIN, y: 40 },
      thickness: 0.6,
      color: RULE,
    });
    const label = `Página ${this.pageNumber}`;
    this.page.drawText(label, {
      x: PAGE_W - MARGIN - this.font.widthOfTextAtSize(label, 9),
      y: 26,
      size: 9,
      font: this.font,
      color: SOFT,
    });
  }

  private ensure(height: number) {
    if (this.y - height < BOTTOM) this.addPage();
  }

  private wrap(text: string, font: PDFFont, size: number, maxWidth = this.contentWidth()): string[] {
    const paragraphs = pdfText(text).split("\n");
    const lines: string[] = [];
    for (const paragraph of paragraphs) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        lines.push("");
        continue;
      }
      let current = "";
      for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(next, size) <= maxWidth) {
          current = next;
          continue;
        }
        if (current) lines.push(current);
        current = this.breakWord(word, font, size, maxWidth, lines);
      }
      if (current) lines.push(current);
    }
    return lines.length ? lines : [""];
  }

  private breakWord(word: string, font: PDFFont, size: number, maxWidth: number, lines: string[]): string {
    if (font.widthOfTextAtSize(word, size) <= maxWidth) return word;
    let chunk = "";
    for (const char of word) {
      const trial = chunk + char;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) chunk = trial;
      else {
        if (chunk) lines.push(chunk);
        chunk = char;
      }
    }
    return chunk;
  }

  private truncate(text: string, font: PDFFont, size: number, maxWidth: number): string {
    const clean = pdfText(text).replace(/\s+/g, " ").trim();
    if (font.widthOfTextAtSize(clean, size) <= maxWidth) return clean;
    let out = clean;
    while (out.length > 1 && font.widthOfTextAtSize(`${out}...`, size) > maxWidth) out = out.slice(0, -1);
    return `${out}...`;
  }

  heading(text: string) {
    this.ensure(36);
    this.y -= 8;
    this.page.drawText(pdfText(text), { x: MARGIN, y: this.y, size: 14, font: this.bold, color: ACCENT });
    this.y -= 8;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_W - MARGIN, y: this.y },
      thickness: 0.8,
      color: RULE,
    });
    this.y -= 16;
  }

  paragraph(text: string, options?: { bold?: boolean; color?: ReturnType<typeof rgb>; size?: number }) {
    const size = options?.size ?? 10.5;
    const font = options?.bold ? this.bold : this.font;
    const color = options?.color ?? INK;
    const lines = this.wrap(text || "—", font, size);
    for (const line of lines) {
      this.ensure(size + 5);
      this.page.drawText(line || " ", { x: MARGIN, y: this.y, size, font, color });
      this.y -= size + 4;
    }
  }

  labelValue(label: string, value: string) {
    this.paragraph(label, { bold: true, size: 10.5 });
    this.paragraph(value.trim() || "Não informado", { color: SOFT });
    this.y -= 4;
  }

  bullet(text: string) {
    const size = 10.5;
    const lines = this.wrap(text, this.font, size, this.contentWidth() - 16);
    lines.forEach((line, index) => {
      this.ensure(size + 5);
      this.page.drawText(index === 0 ? "-" : " ", { x: MARGIN, y: this.y, size, font: this.font, color: ACCENT });
      this.page.drawText(line || " ", { x: MARGIN + 14, y: this.y, size, font: this.font, color: INK });
      this.y -= size + 4;
    });
  }

  gap(amount = 8) {
    this.y -= amount;
  }

  async image(png: Uint8Array) {
    const embedded: PDFImage = await this.doc.embedPng(png);
    const maxW = this.contentWidth();
    const maxH = 320;
    let width = maxW;
    let height = (embedded.height / embedded.width) * width;
    if (height > maxH) {
      height = maxH;
      width = (embedded.width / embedded.height) * height;
    }
    this.ensure(height + 8);
    this.page.drawImage(embedded, { x: MARGIN, y: this.y - height, width, height });
    this.y -= height + 14;
  }

  async finish(): Promise<Uint8Array> {
    this.paintFooter();
    this.doc.setTitle(pdfText(this.title));
    this.doc.setAuthor("ProcessMapper Pro");
    this.doc.setCreator("ProcessMapper Pro");
    return this.doc.save();
  }
}

async function mapPng(data: ProcessData): Promise<Uint8Array | null> {
  if (typeof document === "undefined" || data.nodes.length === 0) return null;
  const svg = buildMapSvg(data, "light");
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("svg"));
      image.src = url;
    });
    const naturalW = image.naturalWidth || 1200;
    const naturalH = image.naturalHeight || 700;
    const scale = Math.min(2, 1800 / naturalW);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(naturalW * scale));
    canvas.height = Math.max(1, Math.round(naturalH * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fbfaf6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!png) return null;
    return new Uint8Array(await png.arrayBuffer());
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function buildProcessPdf(data: ProcessData, map?: Uint8Array | null): Promise<Uint8Array> {
  const title = data.name.trim() || "Processo sem nome";
  const report = await Report.create(title);
  const when = new Date().toLocaleString("pt-BR");
  report.paragraph(`Gerado em ${when}.`, { color: SOFT, size: 10 });
  report.gap(6);

  report.heading("1. Identificação");
  report.labelValue("Descrição", data.description);
  report.labelValue("Entradas", data.inputs);
  report.labelValue("Saídas", data.outputs);

  report.heading("2. Atividades, tempo e granularidade");
  if (data.activities.length === 0) {
    report.paragraph("Nenhuma atividade cadastrada.", { color: SOFT });
  }
  data.activities.forEach((activity, index) => {
    const deps = activity.dependsOn
      .map((id) => activityName(data, id))
      .filter(Boolean);
    report.paragraph(
      `${String(index + 1).padStart(2, "0")}. ${activity.name.trim() || "Sem nome"}`,
      { bold: true },
    );
    report.paragraph(
      `${activity.durationMin || 0} min · ${GRANULARITY_LABEL[activity.granularity]} · Depende de: ${deps.length ? deps.join(", ") : "nenhuma"}`,
      { color: SOFT },
    );
    const subs = activity.subactivities
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (subs.length) {
      subs.forEach((line) => report.bullet(line));
    }
    report.gap(4);
  });

  report.heading("3. Fluxograma");
  if (map && map.length) {
    await report.image(map);
  }
  if (data.nodes.length === 0) {
    report.paragraph("Nenhum fluxograma desenhado. O workflow n8n, se gerado, segue a ordem da lista.", {
      color: SOFT,
    });
  } else {
    data.nodes.forEach((node, index) => {
      const kind =
        node.kind === "decision" ? "Decisão" : node.kind === "activity" ? "Atividade" : node.kind === "start" ? "Início" : "Fim";
      report.bullet(`${index + 1}. ${kind}: ${nodeLabel(node, data)}`);
    });
    report.gap(4);
    report.paragraph("Conexões", { bold: true });
    if (data.edges.length === 0) report.paragraph("Nenhuma conexão.", { color: SOFT });
    for (const edge of data.edges) {
      const source = data.nodes.find((node) => node.id === edge.source);
      const target = data.nodes.find((node) => node.id === edge.target);
      if (!source || !target) continue;
      const via = edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "segue";
      report.bullet(`${nodeLabel(source, data)} -> ${nodeLabel(target, data)} (${via})`);
    }
  }

  report.heading("4. Regras, exceções e ramos");
  if (data.decisions.length === 0) {
    report.paragraph("Nenhuma decisão cadastrada.", { color: SOFT });
  }
  for (const decision of data.decisions) {
    const node = data.nodes.find((item) => item.decisionId === decision.id);
    const sim = node ? data.edges.find((edge) => edge.source === node.id && edge.branch === "sim") : undefined;
    const nao = node ? data.edges.find((edge) => edge.source === node.id && edge.branch === "nao") : undefined;
    const simNode = sim ? data.nodes.find((item) => item.id === sim.target) : undefined;
    const naoNode = nao ? data.nodes.find((item) => item.id === nao.target) : undefined;
    report.paragraph(decision.question.trim() || "Decisão sem pergunta", { bold: true });
    report.labelValue("Regras", decision.rules);
    report.labelValue("Exceções", decision.exceptions);
    report.labelValue("Tratamento", decision.treatment);
    report.paragraph(
      `Se Sim: ${simNode ? nodeLabel(simNode, data) : "não mapeado"} · Se Não: ${naoNode ? nodeLabel(naoNode, data) : "não mapeado"}`,
      { color: SOFT },
    );
  }

  report.heading("5. Matriz RACI");
  if (data.roles.length === 0) {
    report.paragraph("Nenhuma função cadastrada.", { color: SOFT });
  } else {
    report.paragraph(`Funções: ${data.roles.join(", ")}`, { color: SOFT });
    for (const activity of data.activities) {
      const row = data.raci[activity.id] ?? {};
      const cells = data.roles
        .map((role) => {
          const letter = row[role];
          return letter ? `${letter}: ${role}` : "";
        })
        .filter(Boolean);
      report.bullet(`${activity.name.trim() || "Sem nome"} - ${cells.length ? cells.join(" · ") : "sem atribuição"}`);
    }
  }

  report.heading("6. Revisão e validação");
  for (const item of CHECK_ITEMS) {
    report.bullet(`${data.checks[item.id] ? "[x]" : "[ ]"} ${item.label}`);
  }
  report.gap(4);
  report.labelValue("Comentários finais", data.comments);
  const issues = allIssues(data);
  if (issues.length === 0) {
    report.paragraph("Nenhuma pendência objetiva. O mapa está consistente.", { color: ACCENT });
  } else {
    report.paragraph("Pendências", { bold: true });
    for (const issue of issues) {
      const step = STEPS.find((item) => item.n === issue.step);
      for (const message of issue.messages) {
        report.bullet(`Etapa ${issue.step} (${step?.title ?? ""}): ${message}`);
      }
    }
  }

  return report.finish();
}

export function pdfFileName(name: string): string {
  return fileSlug(name).replace(/\.n8n\.json$/, ".pdf");
}

export async function downloadProcessReport(data: ProcessData): Promise<void> {
  const map = await mapPng(data);
  const bytes = await buildProcessPdf(data, map);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  downloadBlob(new Blob([copy], { type: "application/pdf" }), pdfFileName(data.name));
}
