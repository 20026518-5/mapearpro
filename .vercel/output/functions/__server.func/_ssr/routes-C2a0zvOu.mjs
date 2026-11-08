import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Sun, r as Moon } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C2a0zvOu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "secondary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-opacity duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper", "disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "bg-accent text-accent-fg hover:opacity-90", variant === "secondary" && "border border-line bg-card text-ink hover:bg-paper-2", variant === "ghost" && "bg-transparent text-ink hover:bg-paper-2", variant === "danger" && "bg-transparent text-danger hover:bg-paper-2", className),
		...props
	});
}
function Field({ id, label, hint, error, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: id,
					className: "text-sm font-semibold text-ink",
					children: label
				}), required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-ink-soft",
					children: "Obrigatório"
				}) : null]
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: hint
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				role: "alert",
				children: error
			}) : null
		]
	});
}
var fieldClass = "w-full rounded-md border border-line bg-card px-3 text-ink placeholder:text-ink-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(fieldClass, "h-11", className),
		autoComplete: "off",
		...props
	});
}
function TextArea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn(fieldClass, "min-h-28 py-3", className),
		...props
	});
}
function Select({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn(fieldClass, "h-11", className),
		...props
	});
}
var STEPS = [
	{
		n: 1,
		title: "Identificação",
		short: "Processo"
	},
	{
		n: 2,
		title: "Fluxograma",
		short: "Fluxo"
	},
	{
		n: 3,
		title: "Regras e exceções",
		short: "Regras"
	},
	{
		n: 4,
		title: "Sequência temporal",
		short: "Tempo"
	},
	{
		n: 5,
		title: "Granularidade",
		short: "Detalhe"
	},
	{
		n: 6,
		title: "Mapeamento visual",
		short: "Mapa"
	},
	{
		n: 7,
		title: "Matriz RACI",
		short: "RACI"
	},
	{
		n: 8,
		title: "Pontos de decisão",
		short: "Decisões"
	},
	{
		n: 9,
		title: "Revisão e validação",
		short: "Revisão"
	}
];
var CHECK_ITEMS = [
	{
		id: "io",
		label: "Entradas e saídas conferidas com quem executa o processo"
	},
	{
		id: "flow",
		label: "O fluxo cobre o caminho feliz e as exceções"
	},
	{
		id: "time",
		label: "Durações estimadas com o time responsável"
	},
	{
		id: "raci",
		label: "A matriz RACI foi revisada com os responsáveis"
	},
	{
		id: "rules",
		label: "Cada decisão tem critério objetivo de Sim e Não"
	},
	{
		id: "ready",
		label: "O mapeamento está pronto para virar um workflow"
	}
];
var GRANULARITY_LABEL = {
	macro: "Macro",
	medio: "Médio",
	micro: "Micro"
};
var RACI_CYCLE = [
	"",
	"R",
	"A",
	"C",
	"I"
];
function uid() {
	return "n" + Math.random().toString(36).slice(2, 10);
}
function blankData() {
	const checks = {};
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
		theme: "light"
	};
}
function nodeLabel(node, data) {
	if (node.kind === "start") return "Início";
	if (node.kind === "end") return "Fim";
	if (node.kind === "activity") return data.activities.find((a) => a.id === node.activityId)?.name.trim() || "Atividade";
	return data.decisions.find((d) => d.id === node.decisionId)?.question.trim() || "Decisão";
}
function nextNodePosition(nodes) {
	const i = nodes.length;
	return {
		x: 16 + i % 3 * 280,
		y: 16 + Math.floor(i / 3) * 156
	};
}
function layoutNodes(nodes, edges) {
	if (nodes.length === 0) return [];
	const ids = new Set(nodes.map((n) => n.id));
	const clean = edges.filter((e) => ids.has(e.source) && ids.has(e.target));
	const indeg = /* @__PURE__ */ new Map();
	nodes.forEach((n) => indeg.set(n.id, 0));
	clean.forEach((e) => indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1));
	const col = /* @__PURE__ */ new Map();
	nodes.forEach((n) => {
		if ((indeg.get(n.id) ?? 0) === 0) col.set(n.id, 0);
	});
	if (col.size === 0) col.set(nodes[0].id, 0);
	for (let pass = 0; pass < nodes.length; pass += 1) for (const edge of clean) {
		const sourceCol = col.get(edge.source);
		if (sourceCol === void 0) continue;
		const next = sourceCol + 1;
		const current = col.get(edge.target);
		if (current === void 0 || current < next) col.set(edge.target, next);
	}
	nodes.forEach((n) => {
		if (!col.has(n.id)) col.set(n.id, 0);
	});
	const groups = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		const c = col.get(node.id) ?? 0;
		const list = groups.get(c) ?? [];
		list.push(node);
		groups.set(c, list);
	}
	const naoTargets = new Set(clean.filter((e) => e.branch === "nao").map((e) => e.target));
	const placed = /* @__PURE__ */ new Map();
	for (const [c, list] of groups) {
		list.sort((a, b) => {
			const score = (node) => (node.kind === "start" ? -1 : 0) + (naoTargets.has(node.id) ? 2 : 0);
			return score(a) - score(b);
		});
		list.forEach((node, row) => {
			placed.set(node.id, {
				x: 16 + c * 280,
				y: 16 + row * 156
			});
		});
	}
	return nodes.map((node) => ({
		...node,
		...placed.get(node.id)
	}));
}
function hasDependencyCycle(activities) {
	const ids = new Set(activities.map((a) => a.id));
	const visiting = /* @__PURE__ */ new Set();
	const visited = /* @__PURE__ */ new Set();
	function walk(id) {
		if (visiting.has(id)) return true;
		if (visited.has(id)) return false;
		visiting.add(id);
		const activity = activities.find((item) => item.id === id);
		for (const dep of activity?.dependsOn ?? []) if (ids.has(dep) && walk(dep)) return true;
		visiting.delete(id);
		visited.add(id);
		return false;
	}
	return activities.some((activity) => walk(activity.id));
}
function stepIssues(data, step) {
	const issues = [];
	if (step === 1) {
		if (!data.name.trim()) issues.push("Informe o nome do processo.");
		if (!data.description.trim()) issues.push("Descreva o processo.");
		if (!data.inputs.trim()) issues.push("Liste as entradas.");
		if (!data.outputs.trim()) issues.push("Liste as saídas.");
		if (data.activities.length === 0) issues.push("Adicione ao menos uma atividade.");
		else if (data.activities.some((activity) => !activity.name.trim())) issues.push("Toda atividade precisa de um nome.");
	}
	if (step === 2) {
		if (!data.nodes.some((node) => node.kind === "activity")) issues.push("Adicione atividades ao fluxo ou gere o fluxo linear.");
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
		for (const decision of data.decisions) if (!decision.rules.trim() || !decision.treatment.trim()) issues.push(`Complete regras e tratamento de “${decision.question || "decisão"}”.`);
	}
	if (step === 4) {
		for (const activity of data.activities) {
			if (!activity.name.trim()) continue;
			if (!Number.isFinite(activity.durationMin) || activity.durationMin <= 0) issues.push(`Informe a duração de “${activity.name}”.`);
		}
		if (hasDependencyCycle(data.activities)) issues.push("As dependências formam um ciclo. Ajuste a ordem.");
	}
	if (step === 7) {
		if (data.activities.some((activity) => activity.name.trim()) && data.roles.length === 0) issues.push("Adicione ao menos uma função.");
		for (const activity of data.activities.filter((item) => item.name.trim())) {
			const row = data.raci[activity.id] ?? {};
			const letters = data.roles.map((role) => row[role] ?? "");
			const responsible = letters.filter((letter) => letter === "R").length;
			const accountable = letters.filter((letter) => letter === "A").length;
			if (responsible < 1 || accountable !== 1) issues.push(`“${activity.name}” precisa de um R e exatamente um A.`);
		}
	}
	if (step === 8) for (const decision of data.decisions) {
		if (!decision.question.trim()) issues.push("Toda decisão precisa de uma pergunta de Sim ou Não.");
		const node = data.nodes.find((item) => item.decisionId === decision.id);
		if (!node) continue;
		const sim = data.edges.some((edge) => edge.source === node.id && edge.branch === "sim");
		const nao = data.edges.some((edge) => edge.source === node.id && edge.branch === "nao");
		if (!sim || !nao) issues.push(`Mapeie os dois ramos de “${decision.question}”.`);
	}
	return issues;
}
function allIssues(data) {
	return STEPS.map((item) => ({
		step: item.n,
		messages: stepIssues(data, item.n)
	})).filter((item) => item.messages.length > 0);
}
function contentSignature(data) {
	const { step: _step, theme: _theme, ...rest } = data;
	return JSON.stringify(rest);
}
function fileSlug(name) {
	return `${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "processo"}.n8n.json`;
}
function createExample() {
	const checks = {};
	for (const item of CHECK_ITEMS) checks[item.id] = false;
	const activities = [
		{
			id: "a1",
			name: "Receber solicitação",
			durationMin: 15,
			dependsOn: [],
			granularity: "macro",
			subactivities: "Conferir campos obrigatórios\nProtocolar o pedido"
		},
		{
			id: "a2",
			name: "Conferir documentos",
			durationMin: 30,
			dependsOn: ["a1"],
			granularity: "medio",
			subactivities: "Validar legibilidade da nota\nChecar data e CNPJ\nSomar os valores"
		},
		{
			id: "a3",
			name: "Validar política",
			durationMin: 20,
			dependsOn: ["a2"],
			granularity: "medio",
			subactivities: "Comparar a categoria permitida\nChecar o teto da alçada"
		},
		{
			id: "a4",
			name: "Escalar para gerência",
			durationMin: 25,
			dependsOn: ["a2"],
			granularity: "medio",
			subactivities: "Registrar o motivo\nAnexar o dossiê"
		},
		{
			id: "a5",
			name: "Liberar pagamento",
			durationMin: 15,
			dependsOn: ["a3"],
			granularity: "micro",
			subactivities: "Lançar no ERP\nAnexar comprovante"
		},
		{
			id: "a6",
			name: "Comunicar resultado",
			durationMin: 10,
			dependsOn: ["a4", "a5"],
			granularity: "macro",
			subactivities: "Enviar o parecer ao solicitante"
		}
	];
	const decisions = [{
		id: "d1",
		question: "Documentação conforme a política?",
		rules: "Responder Sim quando os comprovantes são legíveis, a categoria é permitida e o valor está dentro do teto da alçada do analista.",
		exceptions: "Nota ilegível, despesa internacional ou valor acima do teto do analista.",
		treatment: "Escalar para a gerência com o motivo registrado. Não recusar em silêncio."
	}];
	const nodes = [
		{
			id: "ns",
			kind: "start",
			x: 0,
			y: 0
		},
		{
			id: "na1",
			kind: "activity",
			activityId: "a1",
			x: 0,
			y: 0
		},
		{
			id: "na2",
			kind: "activity",
			activityId: "a2",
			x: 0,
			y: 0
		},
		{
			id: "nd1",
			kind: "decision",
			decisionId: "d1",
			x: 0,
			y: 0
		},
		{
			id: "na3",
			kind: "activity",
			activityId: "a3",
			x: 0,
			y: 0
		},
		{
			id: "na5",
			kind: "activity",
			activityId: "a5",
			x: 0,
			y: 0
		},
		{
			id: "na4",
			kind: "activity",
			activityId: "a4",
			x: 0,
			y: 0
		},
		{
			id: "na6",
			kind: "activity",
			activityId: "a6",
			x: 0,
			y: 0
		},
		{
			id: "ne",
			kind: "end",
			x: 0,
			y: 0
		}
	];
	const edges = [
		{
			id: "e1",
			source: "ns",
			target: "na1",
			branch: "fluxo"
		},
		{
			id: "e2",
			source: "na1",
			target: "na2",
			branch: "fluxo"
		},
		{
			id: "e3",
			source: "na2",
			target: "nd1",
			branch: "fluxo"
		},
		{
			id: "e4",
			source: "nd1",
			target: "na3",
			branch: "sim"
		},
		{
			id: "e5",
			source: "nd1",
			target: "na4",
			branch: "nao"
		},
		{
			id: "e6",
			source: "na3",
			target: "na5",
			branch: "fluxo"
		},
		{
			id: "e7",
			source: "na5",
			target: "na6",
			branch: "fluxo"
		},
		{
			id: "e8",
			source: "na4",
			target: "na6",
			branch: "fluxo"
		},
		{
			id: "e9",
			source: "na6",
			target: "ne",
			branch: "fluxo"
		}
	];
	return {
		name: "Aprovação de reembolso",
		description: "Receber pedidos de reembolso, conferir documentos e decidir se o pagamento segue ou se o caso sobe para a gerência.",
		inputs: "Formulário de reembolso, notas fiscais e política de despesas.",
		outputs: "Pagamento liberado ou caso escalado, com parecer enviado ao solicitante.",
		comments: "Revisão inicial com o financeiro. Rever o teto de alçada a cada trimestre.",
		activities,
		decisions,
		nodes: layoutNodes(nodes, edges),
		edges,
		roles: [
			"Solicitante",
			"Analista",
			"Gestor Financeiro"
		],
		raci: {
			a1: {
				Solicitante: "R",
				Analista: "A",
				"Gestor Financeiro": "I"
			},
			a2: {
				Solicitante: "C",
				Analista: "R",
				"Gestor Financeiro": "A"
			},
			a3: {
				Solicitante: "I",
				Analista: "R",
				"Gestor Financeiro": "A"
			},
			a4: {
				Solicitante: "I",
				Analista: "R",
				"Gestor Financeiro": "A"
			},
			a5: {
				Solicitante: "I",
				Analista: "R",
				"Gestor Financeiro": "A"
			},
			a6: {
				Solicitante: "I",
				Analista: "R",
				"Gestor Financeiro": "A"
			}
		},
		checks,
		step: 1,
		theme: "light"
	};
}
function escapeMermaid(value) {
	return value.replace(/"/g, "'").replace(/[[\]{}|#<>]/g, " ").replace(/\s+/g, " ").trim() || "Etapa";
}
function safeId(id) {
	const clean = id.replace(/[^a-zA-Z0-9_]/g, "_");
	return /^[a-zA-Z_]/.test(clean) ? clean : `n_${clean}`;
}
function buildMermaid(data) {
	const lines = ["flowchart LR"];
	if (data.nodes.length === 0) {
		lines.push("  vazio[\"Nenhum nó no fluxo\"]");
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
		const via = edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "";
		lines.push(via ? `  ${safeId(edge.source)} -->|${via}| ${safeId(edge.target)}` : `  ${safeId(edge.source)} --> ${safeId(edge.target)}`);
	}
	return lines.join("\n");
}
function portPoint(node, side, branch = "fluxo") {
	const yOff = branch === "sim" ? -16 : branch === "nao" ? 16 : 0;
	if (side === "out") return {
		x: node.x + 200,
		y: node.y + 52 + yOff
	};
	return {
		x: node.x,
		y: node.y + 52
	};
}
function edgePath(x1, y1, x2, y2) {
	const dx = Math.max(48, Math.abs(x2 - x1) / 2);
	const c1x = x1 + (x2 >= x1 ? dx : -dx);
	const c2x = x2 - (x2 >= x1 ? dx : -dx);
	const d = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
	const t = .5;
	const mt = .5;
	return {
		d,
		mx: mt ** 3 * x1 + 3 * mt ** 2 * t * c1x + 3 * mt * t ** 2 * c2x + t ** 3 * x2,
		my: mt ** 3 * y1 + 3 * mt ** 2 * t * y1 + 3 * mt * t ** 2 * y2 + t ** 3 * y2
	};
}
function xml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function wrapLabel(value, max = 26) {
	const words = value.split(/\s+/).filter(Boolean);
	const lines = [];
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
function buildMapSvg(data, theme = "light") {
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
	const maxX = Math.max(480, ...nodes.map((node) => node.x + 200), 0);
	const maxY = Math.max(180, ...nodes.map((node) => node.y + 104), 0);
	const width = maxX + 80;
	const height = maxY + 80 + titleH;
	const shiftX = pad;
	const shiftY = 112;
	const parts = [];
	parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`);
	parts.push(`<rect width="100%" height="100%" fill="${paper}"/>`);
	parts.push(`<text x="${pad}" y="36" fill="${ink}" font-family="Georgia, serif" font-size="22">${xml(data.name.trim() || "Processo sem nome")}</text>`);
	parts.push(`<text x="${pad}" y="58" fill="${soft}" font-family="Source Sans 3, sans-serif" font-size="13">Mapa consolidado · ProcessMapper Pro</text>`);
	parts.push(`<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${ink}"/></marker></defs>`);
	const ids = new Set(nodes.map((node) => node.id));
	for (const edge of data.edges) {
		const source = nodes.find((node) => node.id === edge.source);
		const target = nodes.find((node) => node.id === edge.target);
		if (!source || !target || !ids.has(edge.source)) continue;
		const from = portPoint(source, "out", source.kind === "decision" ? edge.branch : "fluxo");
		const to = portPoint(target, "in");
		const path = edgePath(from.x + shiftX, from.y + shiftY, to.x + shiftX, to.y + shiftY);
		parts.push(`<path d="${path.d}" fill="none" stroke="${ink}" stroke-width="2" marker-end="url(#arrow)"/>`);
		if (edge.branch === "sim" || edge.branch === "nao") {
			const label = edge.branch === "sim" ? "Sim" : "Não";
			parts.push(`<rect x="${path.mx - 18}" y="${path.my - 11}" width="36" height="18" rx="9" fill="${paper}" stroke="${line}"/>`);
			parts.push(`<text x="${path.mx}" y="${path.my + 3}" text-anchor="middle" fill="${ink}" font-family="Source Sans 3, sans-serif" font-size="11">${label}</text>`);
		}
	}
	for (const node of nodes) {
		const x = node.x + shiftX;
		const y = node.y + shiftY;
		const label = wrapLabel(nodeLabel(node, data));
		const fill = node.kind === "decision" ? decision : node.kind === "start" || node.kind === "end" ? accent : card;
		const text = node.kind === "start" || node.kind === "end" ? accentFg : ink;
		const kicker = node.kind === "decision" ? "Decisão" : node.kind === "activity" ? "Atividade" : node.kind === "start" ? "Início" : "Fim";
		const radius = node.kind === "start" || node.kind === "end" ? 999 : 16;
		parts.push(`<rect x="${x}" y="${y}" width="200" height="104" rx="${radius}" fill="${fill}" stroke="${line}" stroke-width="1.25"/>`);
		if (node.kind !== "start" && node.kind !== "end") parts.push(`<text x="${x + 16}" y="${y + 24}" fill="${soft}" font-family="Source Sans 3, sans-serif" font-size="11" letter-spacing="0.08em">${kicker.toUpperCase()}</text>`);
		label.forEach((lineText, index) => {
			const base = node.kind === "start" || node.kind === "end" ? 46 : 48;
			parts.push(`<text x="${x + 100}" y="${y + base + index * 16}" text-anchor="middle" fill="${text}" font-family="Source Sans 3, sans-serif" font-size="14">${xml(lineText)}</text>`);
		});
	}
	if (nodes.length === 0) parts.push(`<text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="${soft}" font-family="Source Sans 3, sans-serif" font-size="16">Nenhum fluxo para exportar</text>`);
	parts.push("</svg>");
	return parts.join("");
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}
function downloadText(filename, text, mime) {
	downloadBlob(new Blob([text], { type: mime }), filename);
}
async function downloadSvgAsPng(svg, filename, background) {
	const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	try {
		const image = new Image();
		image.decoding = "async";
		await new Promise((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(/* @__PURE__ */ new Error("Não foi possível montar a imagem."));
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
		const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
		if (!png) throw new Error("Falha ao gerar PNG.");
		downloadBlob(png, filename);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function memoryStorage() {
	const memory = /* @__PURE__ */ new Map();
	return {
		getItem: (key) => memory.get(key) ?? null,
		setItem: (key, value) => {
			memory.set(key, value);
		},
		removeItem: (key) => {
			memory.delete(key);
		}
	};
}
var useProcess = create()(persist((set) => ({
	...blankData(),
	patchMeta: (patch) => set(patch),
	setStep: (step) => set({ step }),
	setTheme: (theme) => set({ theme }),
	addActivity: () => set((state) => ({ activities: [...state.activities, {
		id: uid(),
		name: "",
		durationMin: 30,
		dependsOn: [],
		granularity: "medio",
		subactivities: ""
	}] })),
	patchActivity: (id, patch) => set((state) => ({ activities: state.activities.map((activity) => activity.id === id ? {
		...activity,
		...patch
	} : activity) })),
	removeActivity: (id) => set((state) => {
		const nodeIds = new Set(state.nodes.filter((node) => node.activityId === id).map((node) => node.id));
		const raci = { ...state.raci };
		delete raci[id];
		return {
			activities: state.activities.filter((activity) => activity.id !== id).map((activity) => ({
				...activity,
				dependsOn: activity.dependsOn.filter((dep) => dep !== id)
			})),
			nodes: state.nodes.filter((node) => node.activityId !== id),
			edges: state.edges.filter((edge) => !nodeIds.has(edge.source) && !nodeIds.has(edge.target)),
			raci
		};
	}),
	moveActivity: (index, direction) => set((state) => {
		const next = index + direction;
		if (next < 0 || next >= state.activities.length) return state;
		const activities = state.activities.slice();
		const [item] = activities.splice(index, 1);
		activities.splice(next, 0, item);
		return { activities };
	}),
	setDepends: (id, dependsOn) => set((state) => ({ activities: state.activities.map((activity) => activity.id === id ? {
		...activity,
		dependsOn: dependsOn.filter((dep) => dep !== id)
	} : activity) })),
	addRole: (name) => set((state) => {
		const clean = name.trim();
		if (!clean || state.roles.includes(clean)) return state;
		return { roles: [...state.roles, clean] };
	}),
	removeRole: (name) => set((state) => {
		const raci = {};
		for (const [activityId, row] of Object.entries(state.raci)) {
			const next = { ...row };
			delete next[name];
			raci[activityId] = next;
		}
		return {
			roles: state.roles.filter((role) => role !== name),
			raci
		};
	}),
	setRaci: (activityId, role, letter) => set((state) => ({ raci: {
		...state.raci,
		[activityId]: {
			...state.raci[activityId] ?? {},
			[role]: letter
		}
	} })),
	toggleCheck: (id) => set((state) => ({ checks: {
		...state.checks,
		[id]: !state.checks[id]
	} })),
	addActivityNode: () => set((state) => {
		const id = uid();
		return {
			activities: [...state.activities, {
				id,
				name: "Nova atividade",
				durationMin: 30,
				dependsOn: [],
				granularity: "medio",
				subactivities: ""
			}],
			nodes: [...state.nodes, {
				id: uid(),
				kind: "activity",
				activityId: id,
				...nextNodePosition(state.nodes)
			}]
		};
	}),
	placeActivity: (activityId) => set((state) => {
		if (state.nodes.some((node) => node.activityId === activityId)) return state;
		return { nodes: [...state.nodes, {
			id: uid(),
			kind: "activity",
			activityId,
			...nextNodePosition(state.nodes)
		}] };
	}),
	addDecisionNode: () => set((state) => {
		const id = uid();
		return {
			decisions: [...state.decisions, {
				id,
				question: "Condição atendida?",
				rules: "",
				exceptions: "",
				treatment: ""
			}],
			nodes: [...state.nodes, {
				id: uid(),
				kind: "decision",
				decisionId: id,
				...nextNodePosition(state.nodes)
			}]
		};
	}),
	addTerminal: (kind) => set((state) => {
		if (state.nodes.some((node) => node.kind === kind)) return state;
		return { nodes: [...state.nodes, {
			id: uid(),
			kind,
			...nextNodePosition(state.nodes)
		}] };
	}),
	moveNode: (id, x, y) => set((state) => ({ nodes: state.nodes.map((node) => node.id === id ? {
		...node,
		x: Math.max(0, Math.round(x)),
		y: Math.max(0, Math.round(y))
	} : node) })),
	updateNodeLabel: (id, label) => set((state) => {
		const node = state.nodes.find((item) => item.id === id);
		if (!node) return state;
		if (node.kind === "activity" && node.activityId) return { activities: state.activities.map((activity) => activity.id === node.activityId ? {
			...activity,
			name: label
		} : activity) };
		if (node.kind === "decision" && node.decisionId) return { decisions: state.decisions.map((decision) => decision.id === node.decisionId ? {
			...decision,
			question: label
		} : decision) };
		return state;
	}),
	removeNode: (id) => set((state) => {
		const node = state.nodes.find((item) => item.id === id);
		if (!node) return state;
		return {
			decisions: node.kind === "decision" ? state.decisions.filter((decision) => decision.id !== node.decisionId) : state.decisions,
			nodes: state.nodes.filter((item) => item.id !== id),
			edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id)
		};
	}),
	connect: (source, target, branch) => set((state) => {
		if (source === target) return state;
		const sourceNode = state.nodes.find((node) => node.id === source);
		const targetNode = state.nodes.find((node) => node.id === target);
		if (!sourceNode || !targetNode) return state;
		if (sourceNode.kind === "end" || targetNode.kind === "start") return state;
		const resolved = sourceNode.kind === "decision" ? branch === "nao" ? "nao" : "sim" : "fluxo";
		return { edges: [...resolved === "fluxo" ? state.edges.filter((edge) => !(edge.source === source && edge.target === target && edge.branch === "fluxo")) : state.edges.filter((edge) => !(edge.source === source && edge.branch === resolved)), {
			id: uid(),
			source,
			target,
			branch: resolved
		}] };
	}),
	setDecisionBranches: (decisionId, simTarget, naoTarget) => set((state) => {
		const node = state.nodes.find((item) => item.decisionId === decisionId);
		if (!node) return state;
		let edges = state.edges.filter((edge) => !(edge.source === node.id && (edge.branch === "sim" || edge.branch === "nao")));
		if (simTarget && simTarget !== node.id) edges = [...edges, {
			id: uid(),
			source: node.id,
			target: simTarget,
			branch: "sim"
		}];
		if (naoTarget && naoTarget !== node.id) edges = [...edges, {
			id: uid(),
			source: node.id,
			target: naoTarget,
			branch: "nao"
		}];
		return { edges };
	}),
	removeEdge: (id) => set((state) => ({ edges: state.edges.filter((edge) => edge.id !== id) })),
	patchDecision: (id, patch) => set((state) => ({ decisions: state.decisions.map((decision) => decision.id === id ? {
		...decision,
		...patch
	} : decision) })),
	organize: () => set((state) => ({ nodes: layoutNodes(state.nodes, state.edges) })),
	generateLinear: () => set((state) => {
		const named = state.activities.filter((activity) => activity.name.trim());
		const start = {
			id: uid(),
			kind: "start",
			x: 0,
			y: 0
		};
		const activityNodes = named.map((activity) => ({
			id: uid(),
			kind: "activity",
			activityId: activity.id,
			x: 0,
			y: 0
		}));
		const end = {
			id: uid(),
			kind: "end",
			x: 0,
			y: 0
		};
		const nodes = [
			start,
			...activityNodes,
			end
		];
		const edges = nodes.slice(0, -1).map((node, index) => ({
			id: uid(),
			source: node.id,
			target: nodes[index + 1].id,
			branch: "fluxo"
		}));
		return {
			nodes: layoutNodes(nodes, edges),
			edges,
			decisions: []
		};
	}),
	loadExample: () => set((state) => ({
		...createExample(),
		theme: state.theme
	})),
	reset: () => set((state) => ({
		...blankData(),
		theme: state.theme
	}))
}), {
	name: "processmapper-pro-v1",
	skipHydration: true,
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage() : localStorage)
}));
var KIND_LABEL = {
	start: "Início",
	end: "Fim",
	activity: "Atividade",
	decision: "Decisão"
};
function FlowCanvas({ readOnly = false }) {
	const nodes = useProcess((state) => state.nodes);
	const edges = useProcess((state) => state.edges);
	const activities = useProcess((state) => state.activities);
	const decisions = useProcess((state) => state.decisions);
	const moveNode = useProcess((state) => state.moveNode);
	const updateNodeLabel = useProcess((state) => state.updateNodeLabel);
	const removeNode = useProcess((state) => state.removeNode);
	const connect = useProcess((state) => state.connect);
	const removeEdge = useProcess((state) => state.removeEdge);
	const addActivityNode = useProcess((state) => state.addActivityNode);
	const addDecisionNode = useProcess((state) => state.addDecisionNode);
	const addTerminal = useProcess((state) => state.addTerminal);
	const placeActivity = useProcess((state) => state.placeActivity);
	const organize = useProcess((state) => state.organize);
	const generateLinear = useProcess((state) => state.generateLinear);
	const worldRef = (0, import_react.useRef)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const [confirmLinear, setConfirmLinear] = (0, import_react.useState)(false);
	const [sourceId, setSourceId] = (0, import_react.useState)("");
	const [targetId, setTargetId] = (0, import_react.useState)("");
	const [branch, setBranch] = (0, import_react.useState)("fluxo");
	const moved = (0, import_react.useRef)(false);
	const data = {
		activities,
		decisions
	};
	const display = nodes.map((node) => drag && drag.id === node.id ? {
		...node,
		x: drag.x,
		y: drag.y
	} : node);
	const width = Math.max(760, ...display.map((node) => node.x + 200 + 80), 0);
	const height = Math.max(420, ...display.map((node) => node.y + 104 + 48), 0);
	const placed = new Set(nodes.filter((node) => node.activityId).map((node) => node.activityId));
	const missing = activities.filter((activity) => activity.name.trim() && !placed.has(activity.id));
	const selectedNode = display.find((node) => node.id === selected) ?? null;
	const hasStart = nodes.some((node) => node.kind === "start");
	const hasEnd = nodes.some((node) => node.kind === "end");
	function beginLink(node, nextBranch) {
		setPending({
			source: node.id,
			branch: node.kind === "decision" ? nextBranch : "fluxo"
		});
		setSelected(node.id);
	}
	function finishLink(target) {
		if (!pending || pending.source === target) return;
		connect(pending.source, target, pending.branch);
		setPending(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			readOnly ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: addActivityNode,
						children: "Atividade"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: addDecisionNode,
						children: "Decisão"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => addTerminal("start"),
						disabled: hasStart,
						children: "Início"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => addTerminal("end"),
						disabled: hasEnd,
						children: "Fim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: organize,
						disabled: nodes.length === 0,
						children: "Organizar"
					}),
					confirmLinear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => {
							generateLinear();
							setConfirmLinear(false);
							setSelected(null);
						},
						children: "Substituir fluxo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setConfirmLinear(false),
						children: "Cancelar"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: nodes.length > 0 ? "secondary" : "primary",
						onClick: () => {
							if (nodes.length > 0) setConfirmLinear(true);
							else generateLinear();
						},
						disabled: !activities.some((activity) => activity.name.trim()),
						children: "Gerar fluxo linear"
					})
				]
			}),
			pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-md border border-line bg-accent-soft px-3 py-2 text-sm text-ink",
				role: "status",
				children: [
					"Ligando o ramo ",
					pending.branch === "nao" ? "Não" : pending.branch === "sim" ? "Sim" : "seguinte",
					". Clique no nó de destino.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-3 font-semibold underline",
						onClick: () => setPending(null),
						children: "Cancelar"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flow-viewport overflow-auto rounded-lg border border-line bg-paper-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: worldRef,
					className: "relative",
					style: {
						width,
						height
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "pointer-events-none absolute inset-0 h-full w-full",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
								id: "flow-arrow",
								markerWidth: "8",
								markerHeight: "8",
								refX: "7",
								refY: "3",
								orient: "auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M0,0 L8,3 L0,6 Z",
									className: "fill-ink"
								})
							}) }), edges.map((edge) => {
								const source = display.find((node) => node.id === edge.source);
								const target = display.find((node) => node.id === edge.target);
								if (!source || !target) return null;
								const from = portPoint(source, "out", source.kind === "decision" ? edge.branch : "fluxo");
								const to = portPoint(target, "in");
								const path = edgePath(from.x, from.y, to.x, to.y);
								const label = edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: path.d,
									fill: "none",
									stroke: "var(--color-ink)",
									strokeWidth: "1.75",
									markerEnd: "url(#flow-arrow)"
								}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: path.mx,
									y: path.my,
									textAnchor: "middle",
									fill: "var(--color-ink)",
									stroke: "var(--color-paper-2)",
									strokeWidth: "4",
									paintOrder: "stroke",
									fontSize: "12",
									fontFamily: "Source Sans 3, sans-serif",
									children: label
								}) : null] }, edge.id);
							})]
						}),
						display.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "absolute inset-0 grid place-items-center px-6 text-center text-sm text-ink-soft",
							children: "O fluxo ainda está vazio. Gere a sequência a partir das atividades ou adicione nós."
						}) : null,
						display.map((node) => {
							const label = nodeLabel(node, data);
							const active = selected === node.id || pending?.source === node.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `absolute grid content-center gap-1 rounded-lg border px-3 ${node.kind === "start" || node.kind === "end" ? "bg-accent text-accent-fg" : node.kind === "decision" ? "bg-accent-soft text-ink" : "bg-card text-ink"} ${active ? "border-accent ring-2 ring-accent" : "border-line"} ${readOnly ? "" : "touch-none"}`,
								style: {
									left: node.x,
									top: node.y,
									width: 200,
									height: 104
								},
								onPointerDown: (event) => {
									if (readOnly) return;
									if (event.target.closest("[data-port]")) return;
									const world = worldRef.current?.getBoundingClientRect();
									if (!world) return;
									moved.current = false;
									setSelected(node.id);
									setDrag({
										id: node.id,
										x: node.x,
										y: node.y,
										ox: event.clientX - world.left - node.x,
										oy: event.clientY - world.top - node.y
									});
									event.currentTarget.setPointerCapture(event.pointerId);
								},
								onPointerMove: (event) => {
									if (!drag || drag.id !== node.id || !worldRef.current) return;
									const world = worldRef.current.getBoundingClientRect();
									const x = Math.max(0, event.clientX - world.left - drag.ox);
									const y = Math.max(0, event.clientY - world.top - drag.oy);
									if (Math.abs(x - node.x) + Math.abs(y - node.y) > 3) moved.current = true;
									setDrag({
										...drag,
										x,
										y
									});
								},
								onPointerUp: () => {
									if (drag?.id === node.id) moveNode(node.id, drag.x, drag.y);
									setDrag(null);
								},
								onClick: () => {
									if (moved.current) return;
									if (pending) finishLink(node.id);
									else setSelected(node.id);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `text-xs font-semibold tracking-wide ${node.kind === "start" || node.kind === "end" ? "text-accent-fg/80" : "text-ink-soft"}`,
										children: KIND_LABEL[node.kind]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: label
									}),
									readOnly || node.kind === "end" ? null : node.kind === "decision" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Port, {
											label: "Sim",
											onClick: () => beginLink(node, "sim")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Port, {
											label: "Não",
											onClick: () => beginLink(node, "nao")
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Port, {
											label: "Ligar",
											onClick: () => beginLink(node, "fluxo")
										})
									})
								]
							}, node.id);
						})
					]
				})
			}),
			readOnly ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					missing.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-ink",
							children: "Atividades ainda fora do fluxo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: missing.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => placeActivity(activity.id),
								children: ["Incluir ", activity.name]
							}, activity.id))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 rounded-lg border border-line bg-card p-4 md:grid-cols-[1fr_10rem_1fr_auto] md:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm font-semibold",
								children: ["De", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: sourceId,
									onChange: (event) => setSourceId(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Selecione"
									}), nodes.filter((node) => node.kind !== "end").map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: node.id,
										children: nodeLabel(node, data)
									}, node.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm font-semibold",
								children: ["Ramo", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: branch,
									onChange: (event) => setBranch(event.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fluxo",
											children: "Seguinte"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sim",
											children: "Sim"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "nao",
											children: "Não"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm font-semibold",
								children: ["Para", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: targetId,
									onChange: (event) => setTargetId(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Selecione"
									}), nodes.filter((node) => node.kind !== "start" && node.id !== sourceId).map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: node.id,
										children: nodeLabel(node, data)
									}, node.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								disabled: !sourceId || !targetId,
								onClick: () => {
									connect(sourceId, targetId, branch);
								},
								children: "Conectar"
							})
						]
					}),
					selectedNode && selectedNode.kind !== "start" && selectedNode.kind !== "end" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 rounded-lg border border-line p-4 md:grid-cols-[1fr_auto] md:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm font-semibold",
							children: [selectedNode.kind === "decision" ? "Pergunta da decisão" : "Nome da atividade", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: nodeLabel(selectedNode, data),
								onChange: (event) => updateNodeLabel(selectedNode.id, event.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								removeNode(selectedNode.id);
								setSelected(null);
							},
							children: selectedNode.kind === "decision" ? "Excluir decisão" : "Remover do fluxo"
						})]
					}) : selectedNode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "danger",
							onClick: () => {
								removeNode(selectedNode.id);
								setSelected(null);
							},
							children: ["Remover ", KIND_LABEL[selectedNode.kind].toLowerCase()]
						})
					}) : null,
					edges.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: edges.map((edge) => {
							const source = nodes.find((node) => node.id === edge.source);
							const target = nodes.find((node) => node.id === edge.target);
							if (!source || !target) return null;
							const via = edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "segue";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 truncate",
									children: [
										nodeLabel(source, data),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-ink-soft",
											children: [
												"— ",
												via,
												" —"
											]
										}),
										" ",
										nodeLabel(target, data)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => removeEdge(edge.id),
									children: "Remover"
								})]
							}, edge.id);
						})
					}) : null
				]
			})
		]
	});
}
function Port({ label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-port": "true",
		className: "h-7 rounded-md border border-line bg-card px-2 text-xs font-semibold text-ink",
		onPointerDown: (event) => event.stopPropagation(),
		onClick: (event) => {
			event.stopPropagation();
			onClick();
		},
		children: label
	});
}
function MermaidView({ code, theme }) {
	const [svg, setSvg] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const run = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const token = ++run.current;
		const timer = window.setTimeout(() => {
			(async () => {
				try {
					const mermaid = (await import("../_libs/mermaid+[...].mjs").then((n) => n.t)).default;
					const dark = theme === "dark";
					mermaid.initialize({
						startOnLoad: false,
						securityLevel: "strict",
						theme: "base",
						fontFamily: "Source Sans 3, sans-serif",
						flowchart: {
							curve: "basis",
							htmlLabels: false,
							padding: 12
						},
						themeVariables: {
							background: dark ? "#121311" : "#fbfaf6",
							primaryColor: dark ? "#1b1c19" : "#fbfaf6",
							primaryTextColor: dark ? "#f3f1eb" : "#1c1915",
							primaryBorderColor: dark ? "#d7e4dc" : "#1c1915",
							lineColor: dark ? "#d7e4dc" : "#1e3a32",
							secondaryColor: dark ? "#24302b" : "#e4efe9",
							tertiaryColor: dark ? "#1b1c19" : "#f3f1eb",
							fontFamily: "Source Sans 3, sans-serif"
						}
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
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			role: "alert",
			children: "O diagrama não pôde ser desenhado. O código Mermaid continua disponível abaixo."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-auto rounded-md border border-line bg-paper p-4 font-mono text-xs text-ink",
			children: code
		})]
	});
	if (!svg) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-ink-soft",
		children: "Gerando diagrama…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mermaid-host overflow-x-auto",
		dangerouslySetInnerHTML: { __html: svg }
	});
}
function StepView({ step, showErrors, workflow, stale, onGenerate }) {
	if (step === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIdentify, { showErrors });
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepFlow, {});
	if (step === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepRules, { showErrors });
	if (step === 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepSequence, { showErrors });
	if (step === 5) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepGranularity, {});
	if (step === 6) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepMap, {});
	if (step === 7) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepRaci, { showErrors });
	if (step === 8) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepClassify, { showErrors });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepReview, {
		workflow,
		stale,
		onGenerate
	});
}
function Section({ title, kicker, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid min-w-0 gap-4 rounded-xl border border-line bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-1",
			children: [kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-ink-soft",
				children: kicker
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold tracking-tight text-ink",
				children: title
			})]
		}), children]
	});
}
function StepIdentify({ showErrors }) {
	const name = useProcess((state) => state.name);
	const description = useProcess((state) => state.description);
	const inputs = useProcess((state) => state.inputs);
	const outputs = useProcess((state) => state.outputs);
	const activities = useProcess((state) => state.activities);
	const patchMeta = useProcess((state) => state.patchMeta);
	const addActivity = useProcess((state) => state.addActivity);
	const patchActivity = useProcess((state) => state.patchActivity);
	const removeActivity = useProcess((state) => state.removeActivity);
	const loadExample = useProcess((state) => state.loadExample);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Identificação do processo",
			kicker: "Etapa 1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "Dê nome ao processo e registre o que entra, o que acontece e o que sai. Se quiser ver o caminho completo, carregue o exemplo de reembolso."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: loadExample,
					children: "Carregar exemplo de reembolso"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "process-name",
					label: "Nome do processo",
					required: true,
					error: showErrors && !name.trim() ? "Informe o nome do processo." : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "process-name",
						value: name,
						placeholder: "Ex.: Aprovação de reembolso",
						onChange: (event) => patchMeta({ name: event.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "process-description",
					label: "Descrição",
					required: true,
					error: showErrors && !description.trim() ? "Descreva o processo." : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						id: "process-description",
						value: description,
						placeholder: "O que este processo resolve e quando ele começa.",
						onChange: (event) => patchMeta({ description: event.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "process-inputs",
						label: "Entradas",
						required: true,
						hint: "Uma informação por linha ou uma frase.",
						error: showErrors && !inputs.trim() ? "Liste as entradas." : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							id: "process-inputs",
							value: inputs,
							placeholder: "Formulário, documentos, dados de sistema.",
							onChange: (event) => patchMeta({ inputs: event.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "process-outputs",
						label: "Saídas",
						required: true,
						error: showErrors && !outputs.trim() ? "Liste as saídas." : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							id: "process-outputs",
							value: outputs,
							placeholder: "O que fica pronto ao final.",
							onChange: (event) => patchMeta({ outputs: event.target.value })
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Atividades principais",
			children: [
				activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "Nenhuma atividade ainda. Adicione a primeira etapa do trabalho."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "grid gap-3",
					children: activities.map((activity, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[auto_1fr_auto] md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm text-ink-soft",
								children: String(index + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": `Nome da atividade ${index + 1}`,
								value: activity.name,
								placeholder: "Ex.: Conferir nota fiscal",
								onChange: (event) => patchActivity(activity.id, { name: event.target.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => removeActivity(activity.id),
								children: "Remover"
							})
						]
					}, activity.id))
				}),
				showErrors && activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: "Adicione ao menos uma atividade."
				}) : null,
				showErrors && activities.some((activity) => !activity.name.trim()) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: "Toda atividade precisa de um nome."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: addActivity,
					children: "Adicionar atividade"
				})
			]
		})]
	});
}
function StepFlow() {
	const theme = useProcess((state) => state.theme);
	const code = buildMermaid({
		nodes: useProcess((state) => state.nodes),
		edges: useProcess((state) => state.edges),
		activities: useProcess((state) => state.activities),
		decisions: useProcess((state) => state.decisions)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Fluxograma simplificado",
			kicker: "Etapa 2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: "Arraste os cartões, ligue um nó ao outro pelo botão do cartão ou pelo formulário abaixo. Decisões têm ramos Sim e Não."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowCanvas, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Prévia em tempo real",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MermaidView, {
				code,
				theme
			})
		})]
	});
}
function StepRules({ showErrors }) {
	const decisions = useProcess((state) => state.decisions);
	const patchDecision = useProcess((state) => state.patchDecision);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Regras, exceções e tratamento",
		kicker: "Etapa 3",
		children: decisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "Não há pontos de decisão no fluxo. Se o processo for linear, continue. Para cadastrar regras, volte e adicione um nó de decisão."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: decisions.map((decision) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "grid gap-3 rounded-lg border border-line p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `q-${decision.id}`,
						label: "Pergunta da decisão",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `q-${decision.id}`,
							value: decision.question,
							onChange: (event) => patchDecision(decision.id, { question: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `rules-${decision.id}`,
						label: "Regras",
						required: true,
						error: showErrors && !decision.rules.trim() ? "Descreva a regra do Sim." : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							id: `rules-${decision.id}`,
							value: decision.rules,
							placeholder: "Quando a resposta é Sim.",
							onChange: (event) => patchDecision(decision.id, { rules: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `exc-${decision.id}`,
						label: "Condições de exceção",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							id: `exc-${decision.id}`,
							value: decision.exceptions,
							placeholder: "Casos que não seguem a regra padrão.",
							onChange: (event) => patchDecision(decision.id, { exceptions: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `treat-${decision.id}`,
						label: "Tratamento",
						required: true,
						error: showErrors && !decision.treatment.trim() ? "Descreva o que fazer na exceção." : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							id: `treat-${decision.id}`,
							value: decision.treatment,
							placeholder: "Quem age e o que registra quando a resposta é Não.",
							onChange: (event) => patchDecision(decision.id, { treatment: event.target.value })
						})
					})
				]
			}, decision.id))
		})
	});
}
function StepSequence({ showErrors }) {
	const activities = useProcess((state) => state.activities);
	const moveActivity = useProcess((state) => state.moveActivity);
	const patchActivity = useProcess((state) => state.patchActivity);
	const setDepends = useProcess((state) => state.setDepends);
	const total = activities.reduce((sum, activity) => sum + (activity.durationMin > 0 ? activity.durationMin : 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Sequência lógica e duração",
		kicker: "Etapa 4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-ink-soft",
			children: [
				"A ordem da lista é a sequência cronológica. Dependências indicam o que precisa terminar antes. Total estimado:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold tabular-nums text-ink",
					children: [total, " min"]
				}),
				"."
			]
		}), activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "Cadastre atividades na etapa 1."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid gap-3",
			children: activities.map((activity, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid gap-3 rounded-lg border border-line p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 font-mono text-sm text-ink-soft",
								children: String(index + 1).padStart(2, "0")
							}), activity.name || "Atividade sem nome"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => moveActivity(index, -1),
								disabled: index === 0,
								"aria-label": "Mover para cima",
								children: "Subir"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => moveActivity(index, 1),
								disabled: index === activities.length - 1,
								"aria-label": "Mover para baixo",
								children: "Descer"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `dur-${activity.id}`,
						label: "Duração estimada (minutos)",
						required: true,
						error: showErrors && activity.durationMin <= 0 ? "Informe uma duração maior que zero." : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `dur-${activity.id}`,
							type: "number",
							min: 1,
							inputMode: "numeric",
							value: activity.durationMin || "",
							onChange: (event) => patchActivity(activity.id, { durationMin: event.target.value === "" ? 0 : Number(event.target.value) })
						})
					}),
					activities.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-sm font-semibold",
							children: "Depende de"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: activities.filter((item) => item.id !== activity.id).map((item) => {
								const checked = activity.dependsOn.includes(item.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 items-center gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked,
										onChange: () => {
											const next = checked ? activity.dependsOn.filter((id) => id !== item.id) : [...activity.dependsOn, item.id];
											setDepends(activity.id, next);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name || "Atividade sem nome" })]
								}, item.id);
							})
						})]
					}) : null
				]
			}, activity.id))
		})]
	});
}
function StepGranularity() {
	const activities = useProcess((state) => state.activities);
	const patchActivity = useProcess((state) => state.patchActivity);
	const options = [
		{
			id: "macro",
			text: "Macro — visão de gestão, sem o como."
		},
		{
			id: "medio",
			text: "Médio — um analista consegue executar."
		},
		{
			id: "micro",
			text: "Micro — campos, cliques e regras."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Nível de granularidade",
		kicker: "Etapa 5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: "Escolha o quanto cada atividade precisa ser detalhada. Subatividades são opcionais, uma por linha."
			}),
			activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: "Cadastre atividades na etapa 1."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: activities.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "grid gap-3 rounded-lg border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-ink",
							children: activity.name || "Atividade sem nome"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 md:grid-cols-3",
							children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": activity.granularity === option.id,
								className: `min-h-11 rounded-md border px-3 py-2 text-left text-sm ${activity.granularity === option.id ? "border-accent bg-accent text-accent-fg" : "border-line bg-card text-ink"}`,
								onClick: () => patchActivity(activity.id, { granularity: option.id }),
								children: option.text
							}, option.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: `sub-${activity.id}`,
							label: "Subatividades",
							hint: "Opcional. Uma por linha.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								id: `sub-${activity.id}`,
								value: activity.subactivities,
								placeholder: "Conferir campos\nRegistrar protocolo",
								onChange: (event) => patchActivity(activity.id, { subactivities: event.target.value })
							})
						})
					]
				}, activity.id))
			})
		]
	});
}
function StepMap() {
	const data = useProcess();
	const svg = buildMapSvg(data, data.theme);
	const code = buildMermaid(data);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Mapa consolidado",
			kicker: "Etapa 6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "Esta visão usa as posições do editor. Organize o fluxo na etapa 2 se os cartões estiverem sobrepostos."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: data.nodes.length === 0,
						onClick: () => {
							downloadSvgAsPng(svg, fileSlug(data.name).replace(/\.n8n\.json$/, ".png"), data.theme === "dark" ? "#121311" : "#fbfaf6").then(() => toast.success("PNG baixado"), () => toast.error("Não foi possível gerar o PNG"));
						},
						children: "Exportar PNG"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "diagram-scroll rounded-lg border border-line bg-paper",
					dangerouslySetInnerHTML: { __html: svg }
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Diagrama Mermaid",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MermaidView, {
				code,
				theme: data.theme
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-auto rounded-md border border-line bg-paper p-4 font-mono text-xs text-ink",
				children: code
			})]
		})]
	});
}
function StepRaci({ showErrors }) {
	const activities = useProcess((state) => state.activities);
	const roles = useProcess((state) => state.roles);
	const raci = useProcess((state) => state.raci);
	const addRole = useProcess((state) => state.addRole);
	const removeRole = useProcess((state) => state.removeRole);
	const setRaci = useProcess((state) => state.setRaci);
	const [roleName, setRoleName] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Matriz RACI",
		kicker: "Etapa 7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-2 text-sm text-ink-soft sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "inline font-semibold text-ink",
						children: "R"
					}), " executa o trabalho."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "inline font-semibold text-ink",
						children: "A"
					}), " responde pelo resultado. Um por atividade."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "inline font-semibold text-ink",
						children: "C"
					}), " é consultado antes da decisão."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "inline font-semibold text-ink",
						children: "I"
					}), " é informado depois."] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					addRole(roleName);
					setRoleName("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					"aria-label": "Nova função",
					value: roleName,
					placeholder: "Ex.: Analista",
					onChange: (event) => setRoleName(event.target.value),
					className: "max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					type: "submit",
					children: "Adicionar função"
				})]
			}),
			roles.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-2",
				children: roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => removeRole(role),
					children: ["Remover ", role]
				}) }, role))
			}) : null,
			showErrors && roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: "Adicione ao menos uma função."
			}) : null,
			activities.length === 0 || roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: "A matriz aparece quando há atividades e funções."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full border-separate border-spacing-0 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "sticky left-0 bg-card p-2 text-left font-semibold",
						children: "Atividade"
					}), roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "min-w-28 p-2 text-left font-semibold",
						children: role
					}, role))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: activities.map((activity) => {
						const row = raci[activity.id] ?? {};
						const letters = roles.map((role) => row[role] ?? "");
						const accountable = letters.filter((letter) => letter === "A").length;
						const responsible = letters.filter((letter) => letter === "R").length;
						const invalid = showErrors && (responsible < 1 || accountable !== 1);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "sticky left-0 bg-card p-2 text-left font-medium",
							children: [activity.name || "Sem nome", invalid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs font-normal text-danger",
								children: "Defina um R e um único A."
							}) : null]
						}), roles.map((role) => {
							const letter = row[role] ?? "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `${activity.name || "Atividade"}, ${role}: ${letter || "vazio"}`,
									className: `grid size-11 place-items-center rounded-md border font-semibold ${letter ? "border-accent bg-accent text-accent-fg" : "border-line bg-paper text-ink-soft"}`,
									onClick: () => {
										const next = RACI_CYCLE[(RACI_CYCLE.indexOf(letter) + 1) % RACI_CYCLE.length];
										setRaci(activity.id, role, next);
									},
									children: letter || "·"
								})
							}, role);
						})] }, activity.id);
					}) })]
				})
			})
		]
	});
}
function StepClassify({ showErrors }) {
	const decisions = useProcess((state) => state.decisions);
	const nodes = useProcess((state) => state.nodes);
	const edges = useProcess((state) => state.edges);
	const activities = useProcess((state) => state.activities);
	const patchDecision = useProcess((state) => state.patchDecision);
	const setDecisionBranches = useProcess((state) => state.setDecisionBranches);
	const data = {
		activities,
		decisions
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Classificação dos pontos de decisão",
		kicker: "Etapa 8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "Cada pergunta deve poder ser respondida com Sim ou Não. O ramo Sim vira a saída verdadeira do nó IF no n8n; o Não, a saída falsa."
		}), decisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "Nenhuma decisão para classificar."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: decisions.map((decision) => {
				const node = nodes.find((item) => item.decisionId === decision.id);
				const sim = edges.find((edge) => edge.source === node?.id && edge.branch === "sim")?.target ?? "";
				const nao = edges.find((edge) => edge.source === node?.id && edge.branch === "nao")?.target ?? "";
				const options = nodes.filter((item) => item.id !== node?.id && item.kind !== "start");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "grid gap-3 rounded-lg border border-line p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `class-${decision.id}`,
						label: "Pergunta Sim/Não",
						required: true,
						error: showErrors && !decision.question.trim() ? "Escreva a pergunta." : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `class-${decision.id}`,
							value: decision.question,
							onChange: (event) => patchDecision(decision.id, { question: event.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: `sim-${decision.id}`,
							label: "Se Sim, seguir para",
							error: showErrors && !sim ? "Escolha o ramo verdadeiro." : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								id: `sim-${decision.id}`,
								value: sim,
								onChange: (event) => setDecisionBranches(decision.id, event.target.value, nao),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Selecione"
								}), options.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: nodeLabel(item, data)
								}, item.id))]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: `nao-${decision.id}`,
							label: "Se Não, seguir para",
							error: showErrors && !nao ? "Escolha o ramo falso." : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								id: `nao-${decision.id}`,
								value: nao,
								onChange: (event) => setDecisionBranches(decision.id, sim, event.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Selecione"
								}), options.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: nodeLabel(item, data)
								}, item.id))]
							})
						})]
					})]
				}, decision.id);
			})
		})]
	});
}
function StepReview({ workflow, stale, onGenerate }) {
	const data = useProcess();
	const patchMeta = useProcess((state) => state.patchMeta);
	const toggleCheck = useProcess((state) => state.toggleCheck);
	const setStep = useProcess((state) => state.setStep);
	const issues = allIssues(data);
	const json = workflow ? JSON.stringify(workflow, null, 2) : "";
	const code = buildMermaid(data);
	const checked = CHECK_ITEMS.filter((item) => data.checks[item.id]).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Revisão do mapeamento",
				kicker: "Etapa 9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "Confira o conjunto antes de gerar o arquivo. O workflow usa um gatilho manual, atividades como nós sem operação e decisões como IF."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-semibold",
								children: "Processo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-ink-soft",
								children: data.name || "Sem nome"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-semibold",
								children: "Descrição"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-ink-soft",
								children: data.description || "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "font-semibold",
									children: "Entradas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "whitespace-pre-wrap text-ink-soft",
									children: data.inputs || "—"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "font-semibold",
									children: "Saídas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "whitespace-pre-wrap text-ink-soft",
									children: data.outputs || "—"
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: data.activities.map((activity, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-line px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink-soft",
									children: String(index + 1).padStart(2, "0")
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: activity.name || "Sem nome"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-ink-soft",
									children: [
										" ",
										"· ",
										activity.durationMin || 0,
										" min · ",
										GRANULARITY_LABEL[activity.granularity]
									]
								})
							]
						}, activity.id))
					}),
					data.decisions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 text-sm",
						children: data.decisions.map((decision) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-line px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: decision.question
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-ink-soft",
								children: decision.rules
							})]
						}, decision.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: STEPS.filter((item) => item.n < 9).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setStep(item.n),
							children: ["Editar ", item.short]
						}, item.n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Checklist de validação",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ink-soft",
						children: [
							checked,
							" de ",
							CHECK_ITEMS.length,
							" conferidos. As pendências objetivas aparecem à parte."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: CHECK_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: Boolean(data.checks[item.id]),
								onChange: () => toggleCheck(item.id)
							}), item.label]
						}) }, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "comments",
						label: "Comentários finais",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							id: "comments",
							value: data.comments,
							placeholder: "Observações para quem for importar o workflow.",
							onChange: (event) => patchMeta({ comments: event.target.value })
						})
					}),
					issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 rounded-lg border border-line bg-paper p-3",
						role: "status",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Pendências antes de considerar o mapa fechado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-1 text-sm text-ink-soft",
								children: issues.flatMap((issue) => issue.messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Etapa ",
									issue.step,
									": ",
									message
								] }, `${issue.step}-${message}`)))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink-soft",
								children: "Você ainda pode gerar o JSON com o que já foi mapeado."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ok",
						children: "Nenhuma pendência objetiva. O mapa está consistente."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: onGenerate,
						children: "Gerar workflow n8n"
					})
				]
			}),
			workflow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Workflow n8n",
				children: [
					stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-warn",
						children: "O mapeamento mudou desde a última geração. Gere de novo para atualizar o arquivo."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ink-soft",
						children: [
							workflow.nodes.length,
							" nós · ",
							workflow.nodes.filter((node) => node.type.endsWith(".if")).length,
							" decisões · nome “",
							workflow.name,
							"”. No n8n, use o menu do workflow e escolha Import from File."
						]
					}),
					!data.nodes.some((node) => node.kind === "activity") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "Sem fluxograma desenhado, as atividades foram encadeadas na ordem da lista."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => {
								downloadText(fileSlug(data.name), json, "application/json");
								toast.success("JSON baixado");
							},
							children: "Baixar JSON"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								navigator.clipboard.writeText(json).then(() => toast.success("JSON copiado"), () => toast.error("Não foi possível copiar"));
							},
							children: "Copiar JSON"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-96 overflow-auto rounded-md border border-line bg-paper p-4 font-mono text-xs leading-relaxed text-ink",
						children: json
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-semibold",
						children: "Diagrama correspondente"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MermaidView, {
						code,
						theme: data.theme
					})
				]
			}) : null
		]
	});
}
function uniqueName(base, used) {
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
function activityNotes(activityId, data) {
	const activity = data.activities.find((item) => item.id === activityId);
	if (!activity) return "";
	const lines = [`Duração estimada: ${activity.durationMin} min`, `Granularidade: ${GRANULARITY_LABEL[activity.granularity]}`];
	const subs = activity.subactivities.split("\n").map((line) => line.trim()).filter(Boolean);
	if (subs.length) {
		lines.push("Subatividades:");
		subs.forEach((line) => lines.push(`- ${line}`));
	}
	const row = data.raci[activity.id] ?? {};
	const raci = data.roles.flatMap((role) => row[role] ? [`${row[role]}: ${role}`] : []);
	if (raci.length) lines.push(`RACI: ${raci.join(" · ")}`);
	const deps = activity.dependsOn.map((id) => data.activities.find((item) => item.id === id)?.name).filter((name) => Boolean(name));
	if (deps.length) lines.push(`Depende de: ${deps.join(", ")}`);
	return lines.join("\n");
}
function decisionNotes(decisionId, data) {
	const decision = data.decisions.find((item) => item.id === decisionId);
	if (!decision) return "";
	return [
		`Pergunta: ${decision.question}`,
		decision.rules ? `Regras: ${decision.rules}` : "",
		decision.exceptions ? `Exceções: ${decision.exceptions}` : "",
		decision.treatment ? `Tratamento: ${decision.treatment}` : ""
	].filter(Boolean).join("\n");
}
function ifParameters() {
	return {
		conditions: {
			options: {
				caseSensitive: true,
				leftValue: "",
				typeValidation: "strict",
				version: 2
			},
			conditions: [{
				id: crypto.randomUUID(),
				leftValue: "={{ $json.resposta }}",
				rightValue: "sim",
				operator: {
					type: "string",
					operation: "equals",
					name: "filter.operator.equals"
				}
			}],
			combinator: "and"
		},
		options: {}
	};
}
function noopNode(name, notes, position) {
	return {
		parameters: {},
		id: crypto.randomUUID(),
		name,
		type: "n8n-nodes-base.noOperation",
		typeVersion: 1,
		position,
		notes: notes || void 0,
		notesInFlow: false
	};
}
function ifNode(name, notes, position) {
	return {
		parameters: ifParameters(),
		id: crypto.randomUUID(),
		name,
		type: "n8n-nodes-base.if",
		typeVersion: 2.2,
		position,
		notes: notes || void 0,
		notesInFlow: false
	};
}
function outputIndex(branch, sourceKind) {
	if (sourceKind !== "decision") return 0;
	return branch === "nao" ? 1 : 0;
}
function buildN8nWorkflow(data) {
	const used = /* @__PURE__ */ new Set();
	const triggerName = uniqueName("Início", used);
	const connections = {};
	const nodes = [];
	function link(from, to, output) {
		if (!connections[from]) connections[from] = { main: [] };
		const main = connections[from].main;
		while (main.length <= output) main.push([]);
		if (!main[output].some((item) => item.node === to)) main[output].push({
			node: to,
			type: "main",
			index: 0
		});
	}
	if (!data.nodes.some((node) => node.kind === "activity" || node.kind === "decision")) {
		const activities = data.activities.filter((activity) => activity.name.trim());
		nodes.push({
			parameters: {},
			id: crypto.randomUUID(),
			name: triggerName,
			type: "n8n-nodes-base.manualTrigger",
			typeVersion: 1,
			position: [0, 160]
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
	const nameOf = /* @__PURE__ */ new Map();
	for (const node of data.nodes) {
		if (node.kind === "start") continue;
		nameOf.set(node.id, uniqueName(nodeLabel(node, data), used));
	}
	const nonStart = data.nodes.filter((node) => node.kind !== "start");
	const virtualEdges = [];
	for (const edge of data.edges) {
		const source = data.nodes.find((node) => node.id === edge.source);
		const target = data.nodes.find((node) => node.id === edge.target);
		if (!source || !target || target.kind === "start") continue;
		if (source.kind === "start") virtualEdges.push({
			from: "__trigger__",
			to: target.id,
			branch: edge.branch,
			sourceKind: "start"
		});
		else virtualEdges.push({
			from: source.id,
			to: target.id,
			branch: edge.branch,
			sourceKind: source.kind
		});
	}
	let triggerTargets = virtualEdges.filter((edge) => edge.from === "__trigger__").map((edge) => edge.to);
	if (triggerTargets.length === 0) {
		const incoming = new Set(virtualEdges.filter((edge) => edge.from !== "__trigger__").map((edge) => edge.to));
		triggerTargets = nonStart.filter((node) => !incoming.has(node.id)).map((node) => node.id);
	}
	const ids = ["__trigger__", ...nonStart.map((node) => node.id)];
	const col = new Map(ids.map((id) => [id, 0]));
	for (let pass = 0; pass < ids.length; pass += 1) {
		for (const edge of virtualEdges) col.set(edge.to, Math.max(col.get(edge.to) ?? 0, (col.get(edge.from) ?? 0) + 1));
		for (const target of triggerTargets) col.set(target, Math.max(col.get(target) ?? 0, 1));
	}
	const groups = /* @__PURE__ */ new Map();
	for (const id of ids) {
		const c = col.get(id) ?? 0;
		const list = groups.get(c) ?? [];
		list.push(id);
		groups.set(c, list);
	}
	const naoTargets = new Set(virtualEdges.filter((edge) => edge.branch === "nao").map((edge) => edge.to));
	const position = /* @__PURE__ */ new Map();
	let maxRows = 1;
	groups.forEach((list) => {
		maxRows = Math.max(maxRows, list.length);
	});
	groups.forEach((list, c) => {
		list.sort((a, b) => Number(naoTargets.has(a)) - Number(naoTargets.has(b)));
		const offset = (maxRows - list.length) * 180 / 2;
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
		position: position.get("__trigger__") ?? [0, 0]
	});
	for (const node of nonStart) {
		const name = nameOf.get(node.id);
		const pos = position.get(node.id) ?? [280, 0];
		if (node.kind === "decision") {
			nodes.push(ifNode(name, decisionNotes(node.decisionId, data), pos));
			connections[name] = { main: [[], []] };
		} else {
			const notes = node.kind === "activity" ? activityNotes(node.activityId, data) : "Marco final do processo.";
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
function pack(data, nodes, connections) {
	return {
		name: data.name.trim() || "Processo sem nome",
		nodes,
		connections,
		pinData: {},
		active: false,
		settings: { executionOrder: "v1" },
		versionId: crypto.randomUUID(),
		meta: { templateCredsSetupCompleted: true }
	};
}
function Wizard() {
	const theme = useProcess((state) => state.theme);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = useProcess.persist.onFinishHydration(() => setReady(true));
		Promise.resolve(useProcess.persist.rehydrate()).then(() => setReady(true));
		return unsub;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem("pm-theme", theme);
	}, [theme, ready]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WizardReady, {});
}
function WizardReady() {
	const step = useProcess((state) => state.step);
	const theme = useProcess((state) => state.theme);
	const name = useProcess((state) => state.name);
	const setStep = useProcess((state) => state.setStep);
	const setTheme = useProcess((state) => state.setTheme);
	const loadExample = useProcess((state) => state.loadExample);
	const reset = useProcess((state) => state.reset);
	const [showErrors, setShowErrors] = (0, import_react.useState)(false);
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
	const [workflow, setWorkflow] = (0, import_react.useState)(null);
	const [signature, setSignature] = (0, import_react.useState)("");
	const data = useProcess();
	const safeStep = Math.min(STEPS.length, Math.max(1, step));
	const issues = stepIssues(data, safeStep);
	const current = STEPS[safeStep - 1];
	const progress = safeStep / STEPS.length * 100;
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [step]);
	function go(next) {
		setShowErrors(false);
		setStep(next);
	}
	function forward() {
		if (issues.length) {
			setShowErrors(true);
			return;
		}
		setShowErrors(false);
		setStep(Math.min(9, safeStep + 1));
	}
	function generate() {
		const currentData = useProcess.getState();
		const next = buildN8nWorkflow(currentData);
		setWorkflow(next);
		setSignature(contentSignature(currentData));
		toast.success("Workflow gerado");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppFrame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: theme === "dark" ? "dark" : "light",
			position: "bottom-center"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: "ProcessMapper Pro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm text-ink-soft",
						children: [name.trim() || "Novo processo", " · salvo neste navegador"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						"aria-label": "Carregar processo de exemplo",
						onClick: () => {
							loadExample();
							setWorkflow(null);
							setShowErrors(false);
							toast.success("Exemplo carregado");
						},
						children: "Exemplo"
					}),
					confirmReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => {
							reset();
							setWorkflow(null);
							setConfirmReset(false);
							setShowErrors(false);
						},
						children: "Apagar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setConfirmReset(false),
						children: "Cancelar"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setConfirmReset(true),
						children: "Novo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						"aria-label": theme === "dark" ? "Usar tema claro" : "Usar tema escuro",
						onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
						children: [theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Tema"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-ink",
						children: [
							safeStep,
							" de ",
							STEPS.length,
							" · ",
							current.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "Etapas livres para revisar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 overflow-hidden rounded-full bg-paper-2",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent transition-[width] duration-200",
						style: { width: `${progress}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 gap-2 overflow-x-auto pb-1",
					children: STEPS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-current": item.n === safeStep ? "step" : void 0,
						className: `h-11 shrink-0 rounded-md border px-3 text-sm font-semibold ${item.n === safeStep ? "border-accent bg-accent text-accent-fg" : "border-line bg-card text-ink"}`,
						onClick: () => go(item.n),
						children: [
							item.n,
							" ",
							item.short
						]
					}, item.n))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "step-enter",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepView, {
				step: safeStep,
				showErrors,
				workflow,
				stale: Boolean(workflow && signature !== contentSignature(data)),
				onGenerate: generate
			})
		}, safeStep),
		showErrors && issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-line bg-card px-4 py-3",
			role: "alert",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-danger",
				children: issues[0]
			}), issues.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink-soft",
				children: [
					"Há mais ",
					issues.length - 1,
					" pendência(s) nesta etapa."
				]
			}) : null]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => go(safeStep - 1),
				disabled: safeStep === 1,
				children: "Voltar"
			}), safeStep < 9 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: forward,
				children: "Continuar"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: generate,
				children: "Gerar workflow n8n"
			})]
		})
	] });
}
function AppFrame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto grid w-full min-w-0 max-w-6xl gap-6 px-4 py-6 sm:py-8",
		children
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-10 shrink-0",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				className: "fill-ink"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "13",
				width: "8",
				height: "6",
				rx: "1.5",
				className: "fill-paper"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "7",
				width: "8",
				height: "6",
				rx: "1.5",
				className: "fill-accent-soft"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "19",
				width: "8",
				height: "6",
				rx: "1.5",
				className: "fill-paper"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M13 16h5M22 13v6",
				className: "stroke-paper",
				strokeWidth: "1.4",
				fill: "none"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wizard, {});
}
//#endregion
export { Home as component };
