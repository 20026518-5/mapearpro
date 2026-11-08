import {
  type Branch,
  type FlowNode,
  type ProcessData,
  GRANULARITY_LABEL,
  nodeLabel,
} from "./model";

export interface N8nConnection {
  node: string;
  type: "main";
  index: 0;
}

export interface N8nNode {
  parameters: Record<string, unknown>;
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  notes?: string;
  notesInFlow?: boolean;
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, { main: N8nConnection[][] }>;
  pinData: Record<string, never>;
  active: false;
  settings: { executionOrder: "v1" };
  versionId: string;
  meta: { templateCredsSetupCompleted: true };
}

function uniqueName(base: string, used: Set<string>): string {
  const clean = base.trim().replace(/\s+/g, " ") || "Etapa";
  let name = clean;
  let index = 2;
  while (used.has(name)) {
    name = `${clean} (${index})`;
    index += 1;
  }
  used.add(name);
  return name;
}

function activityNotes(activityId: string | undefined, data: ProcessData): string {
  const activity = data.activities.find((item) => item.id === activityId);
  if (!activity) return "";
  const lines = [
    `Duração estimada: ${activity.durationMin} min`,
    `Granularidade: ${GRANULARITY_LABEL[activity.granularity]}`,
  ];
  const subs = activity.subactivities
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (subs.length) {
    lines.push("Subatividades:");
    subs.forEach((line) => lines.push(`- ${line}`));
  }
  const row = data.raci[activity.id] ?? {};
  const raci = data.roles.flatMap((role) => (row[role] ? [`${row[role]}: ${role}`] : []));
  if (raci.length) lines.push(`RACI: ${raci.join(" · ")}`);
  const deps = activity.dependsOn
    .map((id) => data.activities.find((item) => item.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  if (deps.length) lines.push(`Depende de: ${deps.join(", ")}`);
  return lines.join("\n");
}

function decisionNotes(decisionId: string | undefined, data: ProcessData): string {
  const decision = data.decisions.find((item) => item.id === decisionId);
  if (!decision) return "";
  return [
    `Pergunta: ${decision.question}`,
    decision.rules ? `Regras: ${decision.rules}` : "",
    decision.exceptions ? `Exceções: ${decision.exceptions}` : "",
    decision.treatment ? `Tratamento: ${decision.treatment}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function ifParameters(): Record<string, unknown> {
  return {
    conditions: {
      options: {
        caseSensitive: true,
        leftValue: "",
        typeValidation: "strict",
        version: 2,
      },
      conditions: [
        {
          id: crypto.randomUUID(),
          leftValue: "={{ $json.resposta }}",
          rightValue: "sim",
          operator: {
            type: "string",
            operation: "equals",
            name: "filter.operator.equals",
          },
        },
      ],
      combinator: "and",
    },
    options: {},
  };
}

function noopNode(name: string, notes: string, position: [number, number]): N8nNode {
  return {
    parameters: {},
    id: crypto.randomUUID(),
    name,
    type: "n8n-nodes-base.noOperation",
    typeVersion: 1,
    position,
    notes: notes || undefined,
    notesInFlow: false,
  };
}

function ifNode(name: string, notes: string, position: [number, number]): N8nNode {
  return {
    parameters: ifParameters(),
    id: crypto.randomUUID(),
    name,
    type: "n8n-nodes-base.if",
    typeVersion: 2.2,
    position,
    notes: notes || undefined,
    notesInFlow: false,
  };
}

function outputIndex(branch: Branch, sourceKind: FlowNode["kind"]): number {
  if (sourceKind !== "decision") return 0;
  return branch === "nao" ? 1 : 0;
}

export function buildN8nWorkflow(data: ProcessData): N8nWorkflow {
  const used = new Set<string>();
  const triggerName = uniqueName("Início", used);
  const connections: N8nWorkflow["connections"] = {};
  const nodes: N8nNode[] = [];

  function link(from: string, to: string, output: number) {
    if (!connections[from]) connections[from] = { main: [] };
    const main = connections[from].main;
    while (main.length <= output) main.push([]);
    if (!main[output].some((item) => item.node === to)) {
      main[output].push({ node: to, type: "main", index: 0 });
    }
  }

  const hasFlow = data.nodes.some((node) => node.kind === "activity" || node.kind === "decision");

  if (!hasFlow) {
    const activities = data.activities.filter((activity) => activity.name.trim());
    nodes.push({
      parameters: {},
      id: crypto.randomUUID(),
      name: triggerName,
      type: "n8n-nodes-base.manualTrigger",
      typeVersion: 1,
      position: [0, 160],
    });
    let previous = triggerName;
    activities.forEach((activity, index) => {
      const name = uniqueName(activity.name, used);
      nodes.push(noopNode(name, activityNotes(activity.id, data), [(index + 1) * 280, 160]));
      link(previous, name, 0);
      previous = name;
    });
    return pack(data, nodes, connections);
  }

  const nameOf = new Map<string, string>();
  for (const node of data.nodes) {
    if (node.kind === "start") continue;
    nameOf.set(node.id, uniqueName(nodeLabel(node, data), used));
  }

  const nonStart = data.nodes.filter((node) => node.kind !== "start");
  const virtualEdges: { from: string; to: string; branch: Branch; sourceKind: FlowNode["kind"] }[] =
    [];

  for (const edge of data.edges) {
    const source = data.nodes.find((node) => node.id === edge.source);
    const target = data.nodes.find((node) => node.id === edge.target);
    if (!source || !target || target.kind === "start") continue;
    if (source.kind === "start") {
      virtualEdges.push({ from: "__trigger__", to: target.id, branch: edge.branch, sourceKind: "start" });
    } else {
      virtualEdges.push({
        from: source.id,
        to: target.id,
        branch: edge.branch,
        sourceKind: source.kind,
      });
    }
  }

  let triggerTargets = virtualEdges.filter((edge) => edge.from === "__trigger__").map((edge) => edge.to);
  if (triggerTargets.length === 0) {
    const incoming = new Set(
      virtualEdges.filter((edge) => edge.from !== "__trigger__").map((edge) => edge.to),
    );
    triggerTargets = nonStart.filter((node) => !incoming.has(node.id)).map((node) => node.id);
  }

  const ids = ["__trigger__", ...nonStart.map((node) => node.id)];
  const col = new Map<string, number>(ids.map((id) => [id, 0]));
  for (let pass = 0; pass < ids.length; pass += 1) {
    for (const edge of virtualEdges) {
      col.set(edge.to, Math.max(col.get(edge.to) ?? 0, (col.get(edge.from) ?? 0) + 1));
    }
    for (const target of triggerTargets) {
      col.set(target, Math.max(col.get(target) ?? 0, 1));
    }
  }

  const groups = new Map<number, string[]>();
  for (const id of ids) {
    const c = col.get(id) ?? 0;
    const list = groups.get(c) ?? [];
    list.push(id);
    groups.set(c, list);
  }
  const naoTargets = new Set(virtualEdges.filter((edge) => edge.branch === "nao").map((edge) => edge.to));
  const position = new Map<string, [number, number]>();
  let maxRows = 1;
  groups.forEach((list) => {
    maxRows = Math.max(maxRows, list.length);
  });
  groups.forEach((list, c) => {
    list.sort((a, b) => Number(naoTargets.has(a)) - Number(naoTargets.has(b)));
    const offset = ((maxRows - list.length) * 180) / 2;
    list.forEach((id, row) => {
      position.set(id, [c * 280, Math.round(offset + row * 180)]);
    });
  });

  nodes.push({
    parameters: {},
    id: crypto.randomUUID(),
    name: triggerName,
    type: "n8n-nodes-base.manualTrigger",
    typeVersion: 1,
    position: position.get("__trigger__") ?? [0, 0],
  });

  for (const node of nonStart) {
    const name = nameOf.get(node.id)!;
    const pos = position.get(node.id) ?? [280, 0];
    if (node.kind === "decision") {
      nodes.push(ifNode(name, decisionNotes(node.decisionId, data), pos));
      connections[name] = { main: [[], []] };
    } else {
      const notes =
        node.kind === "activity" ? activityNotes(node.activityId, data) : "Marco final do processo.";
      nodes.push(noopNode(name, notes, pos));
    }
  }

  for (const target of triggerTargets) {
    const name = nameOf.get(target);
    if (name) link(triggerName, name, 0);
  }

  for (const edge of virtualEdges) {
    if (edge.from === "__trigger__") continue;
    const from = nameOf.get(edge.from);
    const to = nameOf.get(edge.to);
    if (!from || !to) continue;
    link(from, to, outputIndex(edge.branch, edge.sourceKind));
  }

  return pack(data, nodes, connections);
}

function pack(
  data: ProcessData,
  nodes: N8nNode[],
  connections: N8nWorkflow["connections"],
): N8nWorkflow {
  return {
    name: data.name.trim() || "Processo sem nome",
    nodes,
    connections,
    pinData: {},
    active: false,
    settings: { executionOrder: "v1" },
    versionId: crypto.randomUUID(),
    meta: { templateCredsSetupCompleted: true },
  };
}
