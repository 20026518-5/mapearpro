export type Granularity = "macro" | "medio" | "micro";
export type RaciLetter = "R" | "A" | "C" | "I" | "";
export type Branch = "fluxo" | "sim" | "nao";
export type NodeKind = "start" | "activity" | "decision" | "end";

export interface Activity {
  id: string;
  name: string;
  durationMin: number;
  dependsOn: string[];
  granularity: Granularity;
  subactivities: string;
}

export interface Decision {
  id: string;
  question: string;
  rules: string;
  exceptions: string;
  treatment: string;
}

export interface FlowNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  activityId?: string;
  decisionId?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  branch: Branch;
}

export interface ProcessData {
  name: string;
  description: string;
  inputs: string;
  outputs: string;
  comments: string;
  activities: Activity[];
  decisions: Decision[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  roles: string[];
  raci: Record<string, Record<string, RaciLetter>>;
  checks: Record<string, boolean>;
  step: number;
  theme: "light" | "dark";
}

export const NODE_W = 200;
export const NODE_H = 104;

export const STEPS = [
  { n: 1, title: "Identificação", short: "Processo" },
  { n: 2, title: "Fluxograma", short: "Fluxo" },
  { n: 3, title: "Regras e exceções", short: "Regras" },
  { n: 4, title: "Sequência temporal", short: "Tempo" },
  { n: 5, title: "Granularidade", short: "Detalhe" },
  { n: 6, title: "Mapeamento visual", short: "Mapa" },
  { n: 7, title: "Matriz RACI", short: "RACI" },
  { n: 8, title: "Pontos de decisão", short: "Decisões" },
  { n: 9, title: "Revisão e validação", short: "Revisão" },
] as const;

export const CHECK_ITEMS = [
  { id: "io", label: "Entradas e saídas conferidas com quem executa o processo" },
  { id: "flow", label: "O fluxo cobre o caminho feliz e as exceções" },
  { id: "time", label: "Durações estimadas com o time responsável" },
  { id: "raci", label: "A matriz RACI foi revisada com os responsáveis" },
  { id: "rules", label: "Cada decisão tem critério objetivo de Sim e Não" },
  { id: "ready", label: "O mapeamento está pronto para virar um workflow" },
] as const;

export const GRANULARITY_LABEL: Record<Granularity, string> = {
  macro: "Macro",
  medio: "Médio",
  micro: "Micro",
};

export const RACI_CYCLE: RaciLetter[] = ["", "R", "A", "C", "I"];

export function uid(): string {
  return "n" + Math.random().toString(36).slice(2, 10);
}

export function blankData(): ProcessData {
  const checks: Record<string, boolean> = {};
  for (const item of CHECK_ITEMS) checks[item.id] = false;
  return {
    name: "",
    description: "",
    inputs: "",
    outputs: "",
    comments: "",
    activities: [],
    decisions: [],
    nodes: [],
    edges: [],
    roles: [],
    raci: {},
    checks,
    step: 1,
    theme: "light",
  };
}

export function nodeLabel(
  node: FlowNode,
  data: Pick<ProcessData, "activities" | "decisions">,
): string {
  if (node.kind === "start") return "Início";
  if (node.kind === "end") return "Fim";
  if (node.kind === "activity") {
    return data.activities.find((a) => a.id === node.activityId)?.name.trim() || "Atividade";
  }
  return data.decisions.find((d) => d.id === node.decisionId)?.question.trim() || "Decisão";
}

export function nextNodePosition(nodes: FlowNode[]): { x: number; y: number } {
  const i = nodes.length;
  return { x: 16 + (i % 3) * 280, y: 16 + Math.floor(i / 3) * 156 };
}

export function layoutNodes(nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
  if (nodes.length === 0) return [];
  const ids = new Set(nodes.map((n) => n.id));
  const clean = edges.filter((e) => ids.has(e.source) && ids.has(e.target));
  const indeg = new Map<string, number>();
  nodes.forEach((n) => indeg.set(n.id, 0));
  clean.forEach((e) => indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1));

  const col = new Map<string, number>();
  nodes.forEach((n) => {
    if ((indeg.get(n.id) ?? 0) === 0) col.set(n.id, 0);
  });
  if (col.size === 0) col.set(nodes[0].id, 0);

  for (let pass = 0; pass < nodes.length; pass += 1) {
    for (const edge of clean) {
      const sourceCol = col.get(edge.source);
      if (sourceCol === undefined) continue;
      const next = sourceCol + 1;
      const current = col.get(edge.target);
      if (current === undefined || current < next) col.set(edge.target, next);
    }
  }
  nodes.forEach((n) => {
    if (!col.has(n.id)) col.set(n.id, 0);
  });

  const groups = new Map<number, FlowNode[]>();
  for (const node of nodes) {
    const c = col.get(node.id) ?? 0;
    const list = groups.get(c) ?? [];
    list.push(node);
    groups.set(c, list);
  }

  const naoTargets = new Set(clean.filter((e) => e.branch === "nao").map((e) => e.target));
  const placed = new Map<string, { x: number; y: number }>();
  for (const [c, list] of groups) {
    list.sort((a, b) => {
      const score = (node: FlowNode) =>
        (node.kind === "start" ? -1 : 0) + (naoTargets.has(node.id) ? 2 : 0);
      return score(a) - score(b);
    });
    list.forEach((node, row) => {
      placed.set(node.id, { x: 16 + c * 280, y: 16 + row * 156 });
    });
  }

  return nodes.map((node) => ({ ...node, ...placed.get(node.id)! }));
}

function hasDependencyCycle(activities: Activity[]): boolean {
  const ids = new Set(activities.map((a) => a.id));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function walk(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const activity = activities.find((item) => item.id === id);
    for (const dep of activity?.dependsOn ?? []) {
      if (ids.has(dep) && walk(dep)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  }

  return activities.some((activity) => walk(activity.id));
}

export function stepIssues(data: ProcessData, step: number): string[] {
  const issues: string[] = [];

  if (step === 1) {
    if (!data.name.trim()) issues.push("Informe o nome do processo.");
    if (!data.description.trim()) issues.push("Descreva o processo.");
    if (!data.inputs.trim()) issues.push("Liste as entradas.");
    if (!data.outputs.trim()) issues.push("Liste as saídas.");
    if (data.activities.length === 0) issues.push("Adicione ao menos uma atividade.");
    else if (data.activities.some((activity) => !activity.name.trim())) {
      issues.push("Toda atividade precisa de um nome.");
    }
  }

  if (step === 2) {
    if (!data.nodes.some((node) => node.kind === "activity")) {
      issues.push("Adicione atividades ao fluxo ou gere o fluxo linear.");
    }
    for (const node of data.nodes.filter((item) => item.kind === "decision")) {
      const sim = data.edges.some((edge) => edge.source === node.id && edge.branch === "sim");
      const nao = data.edges.some((edge) => edge.source === node.id && edge.branch === "nao");
      if (!sim || !nao) {
        const question = data.decisions.find((item) => item.id === node.decisionId)?.question;
        issues.push(`Conecte os ramos Sim e Não de “${question || "decisão"}”.`);
      }
    }
  }

  if (step === 3) {
    for (const decision of data.decisions) {
      if (!decision.rules.trim() || !decision.treatment.trim()) {
        issues.push(`Complete regras e tratamento de “${decision.question || "decisão"}”.`);
      }
    }
  }

  if (step === 4) {
    for (const activity of data.activities) {
      if (!activity.name.trim()) continue;
      if (!Number.isFinite(activity.durationMin) || activity.durationMin <= 0) {
        issues.push(`Informe a duração de “${activity.name}”.`);
      }
    }
    if (hasDependencyCycle(data.activities)) {
      issues.push("As dependências formam um ciclo. Ajuste a ordem.");
    }
  }

  if (step === 7) {
    if (data.activities.some((activity) => activity.name.trim()) && data.roles.length === 0) {
      issues.push("Adicione ao menos uma função.");
    }
    for (const activity of data.activities.filter((item) => item.name.trim())) {
      const row = data.raci[activity.id] ?? {};
      const letters = data.roles.map((role) => row[role] ?? "");
      const responsible = letters.filter((letter) => letter === "R").length;
      const accountable = letters.filter((letter) => letter === "A").length;
      if (responsible < 1 || accountable !== 1) {
        issues.push(`“${activity.name}” precisa de um R e exatamente um A.`);
      }
    }
  }

  if (step === 8) {
    for (const decision of data.decisions) {
      if (!decision.question.trim()) issues.push("Toda decisão precisa de uma pergunta de Sim ou Não.");
      const node = data.nodes.find((item) => item.decisionId === decision.id);
      if (!node) continue;
      const sim = data.edges.some((edge) => edge.source === node.id && edge.branch === "sim");
      const nao = data.edges.some((edge) => edge.source === node.id && edge.branch === "nao");
      if (!sim || !nao) issues.push(`Mapeie os dois ramos de “${decision.question}”.`);
    }
  }

  return issues;
}

export function allIssues(data: ProcessData): { step: number; messages: string[] }[] {
  return STEPS.map((item) => ({ step: item.n, messages: stepIssues(data, item.n) })).filter(
    (item) => item.messages.length > 0,
  );
}

export function contentSignature(data: ProcessData): string {
  const { step: _step, theme: _theme, ...rest } = data;
  return JSON.stringify(rest);
}

export function fileSlug(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "processo"}.n8n.json`;
}

export function createExample(): ProcessData {
  const checks: Record<string, boolean> = {};
  for (const item of CHECK_ITEMS) checks[item.id] = false;

  const activities: Activity[] = [
    {
      id: "a1",
      name: "Receber solicitação",
      durationMin: 15,
      dependsOn: [],
      granularity: "macro",
      subactivities: "Conferir campos obrigatórios\nProtocolar o pedido",
    },
    {
      id: "a2",
      name: "Conferir documentos",
      durationMin: 30,
      dependsOn: ["a1"],
      granularity: "medio",
      subactivities: "Validar legibilidade da nota\nChecar data e CNPJ\nSomar os valores",
    },
    {
      id: "a3",
      name: "Validar política",
      durationMin: 20,
      dependsOn: ["a2"],
      granularity: "medio",
      subactivities: "Comparar a categoria permitida\nChecar o teto da alçada",
    },
    {
      id: "a4",
      name: "Escalar para gerência",
      durationMin: 25,
      dependsOn: ["a2"],
      granularity: "medio",
      subactivities: "Registrar o motivo\nAnexar o dossiê",
    },
    {
      id: "a5",
      name: "Liberar pagamento",
      durationMin: 15,
      dependsOn: ["a3"],
      granularity: "micro",
      subactivities: "Lançar no ERP\nAnexar comprovante",
    },
    {
      id: "a6",
      name: "Comunicar resultado",
      durationMin: 10,
      dependsOn: ["a4", "a5"],
      granularity: "macro",
      subactivities: "Enviar o parecer ao solicitante",
    },
  ];

  const decisions: Decision[] = [
    {
      id: "d1",
      question: "Documentação conforme a política?",
      rules:
        "Responder Sim quando os comprovantes são legíveis, a categoria é permitida e o valor está dentro do teto da alçada do analista.",
      exceptions: "Nota ilegível, despesa internacional ou valor acima do teto do analista.",
      treatment: "Escalar para a gerência com o motivo registrado. Não recusar em silêncio.",
    },
  ];

  const nodes: FlowNode[] = [
    { id: "ns", kind: "start", x: 0, y: 0 },
    { id: "na1", kind: "activity", activityId: "a1", x: 0, y: 0 },
    { id: "na2", kind: "activity", activityId: "a2", x: 0, y: 0 },
    { id: "nd1", kind: "decision", decisionId: "d1", x: 0, y: 0 },
    { id: "na3", kind: "activity", activityId: "a3", x: 0, y: 0 },
    { id: "na5", kind: "activity", activityId: "a5", x: 0, y: 0 },
    { id: "na4", kind: "activity", activityId: "a4", x: 0, y: 0 },
    { id: "na6", kind: "activity", activityId: "a6", x: 0, y: 0 },
    { id: "ne", kind: "end", x: 0, y: 0 },
  ];

  const edges: FlowEdge[] = [
    { id: "e1", source: "ns", target: "na1", branch: "fluxo" },
    { id: "e2", source: "na1", target: "na2", branch: "fluxo" },
    { id: "e3", source: "na2", target: "nd1", branch: "fluxo" },
    { id: "e4", source: "nd1", target: "na3", branch: "sim" },
    { id: "e5", source: "nd1", target: "na4", branch: "nao" },
    { id: "e6", source: "na3", target: "na5", branch: "fluxo" },
    { id: "e7", source: "na5", target: "na6", branch: "fluxo" },
    { id: "e8", source: "na4", target: "na6", branch: "fluxo" },
    { id: "e9", source: "na6", target: "ne", branch: "fluxo" },
  ];

  const roles = ["Solicitante", "Analista", "Gestor Financeiro"];

  return {
    name: "Aprovação de reembolso",
    description:
      "Receber pedidos de reembolso, conferir documentos e decidir se o pagamento segue ou se o caso sobe para a gerência.",
    inputs: "Formulário de reembolso, notas fiscais e política de despesas.",
    outputs: "Pagamento liberado ou caso escalado, com parecer enviado ao solicitante.",
    comments: "Revisão inicial com o financeiro. Rever o teto de alçada a cada trimestre.",
    activities,
    decisions,
    nodes: layoutNodes(nodes, edges),
    edges,
    roles,
    raci: {
      a1: { Solicitante: "R", Analista: "A", "Gestor Financeiro": "I" },
      a2: { Solicitante: "C", Analista: "R", "Gestor Financeiro": "A" },
      a3: { Solicitante: "I", Analista: "R", "Gestor Financeiro": "A" },
      a4: { Solicitante: "I", Analista: "R", "Gestor Financeiro": "A" },
      a5: { Solicitante: "I", Analista: "R", "Gestor Financeiro": "A" },
      a6: { Solicitante: "I", Analista: "R", "Gestor Financeiro": "A" },
    },
    checks,
    step: 1,
    theme: "light",
  };
}
