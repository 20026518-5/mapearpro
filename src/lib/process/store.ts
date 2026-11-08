import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  type Activity,
  type Branch,
  type Decision,
  type ProcessData,
  type RaciLetter,
  blankData,
  createExample,
  nextNodePosition,
  layoutNodes,
  uid,
} from "./model";

interface ProcessStore extends ProcessData {
  patchMeta: (patch: Partial<Pick<ProcessData, "name" | "description" | "inputs" | "outputs" | "comments">>) => void;
  setStep: (step: number) => void;
  setTheme: (theme: "light" | "dark") => void;
  addActivity: () => void;
  patchActivity: (id: string, patch: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  moveActivity: (index: number, direction: -1 | 1) => void;
  setDepends: (id: string, dependsOn: string[]) => void;
  addRole: (name: string) => void;
  removeRole: (name: string) => void;
  setRaci: (activityId: string, role: string, letter: RaciLetter) => void;
  toggleCheck: (id: string) => void;
  addActivityNode: () => void;
  placeActivity: (activityId: string) => void;
  addDecisionNode: () => void;
  addTerminal: (kind: "start" | "end") => void;
  moveNode: (id: string, x: number, y: number) => void;
  updateNodeLabel: (id: string, label: string) => void;
  removeNode: (id: string) => void;
  connect: (source: string, target: string, branch: Branch) => void;
  setDecisionBranches: (decisionId: string, simTarget: string, naoTarget: string) => void;
  removeEdge: (id: string) => void;
  patchDecision: (id: string, patch: Partial<Decision>) => void;
  organize: () => void;
  generateLinear: () => void;
  loadExample: () => void;
  reset: () => void;
}

function memoryStorage() {
  const memory = new Map<string, string>();
  return {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
  };
}

export const useProcess = create<ProcessStore>()(
  persist(
    (set) => ({
      ...blankData(),
      patchMeta: (patch) => set(patch),
      setStep: (step) => set({ step }),
      setTheme: (theme) => set({ theme }),
      addActivity: () =>
        set((state) => ({
          activities: [
            ...state.activities,
            {
              id: uid(),
              name: "",
              durationMin: 30,
              dependsOn: [],
              granularity: "medio",
              subactivities: "",
            },
          ],
        })),
      patchActivity: (id, patch) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, ...patch } : activity,
          ),
        })),
      removeActivity: (id) =>
        set((state) => {
          const nodeIds = new Set(
            state.nodes.filter((node) => node.activityId === id).map((node) => node.id),
          );
          const raci = { ...state.raci };
          delete raci[id];
          return {
            activities: state.activities
              .filter((activity) => activity.id !== id)
              .map((activity) => ({
                ...activity,
                dependsOn: activity.dependsOn.filter((dep) => dep !== id),
              })),
            nodes: state.nodes.filter((node) => node.activityId !== id),
            edges: state.edges.filter((edge) => !nodeIds.has(edge.source) && !nodeIds.has(edge.target)),
            raci,
          };
        }),
      moveActivity: (index, direction) =>
        set((state) => {
          const next = index + direction;
          if (next < 0 || next >= state.activities.length) return state;
          const activities = state.activities.slice();
          const [item] = activities.splice(index, 1);
          activities.splice(next, 0, item);
          return { activities };
        }),
      setDepends: (id, dependsOn) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id
              ? { ...activity, dependsOn: dependsOn.filter((dep) => dep !== id) }
              : activity,
          ),
        })),
      addRole: (name) =>
        set((state) => {
          const clean = name.trim();
          if (!clean || state.roles.includes(clean)) return state;
          return { roles: [...state.roles, clean] };
        }),
      removeRole: (name) =>
        set((state) => {
          const raci: ProcessData["raci"] = {};
          for (const [activityId, row] of Object.entries(state.raci)) {
            const next = { ...row };
            delete next[name];
            raci[activityId] = next;
          }
          return { roles: state.roles.filter((role) => role !== name), raci };
        }),
      setRaci: (activityId, role, letter) =>
        set((state) => ({
          raci: {
            ...state.raci,
            [activityId]: { ...(state.raci[activityId] ?? {}), [role]: letter },
          },
        })),
      toggleCheck: (id) =>
        set((state) => ({ checks: { ...state.checks, [id]: !state.checks[id] } })),
      addActivityNode: () =>
        set((state) => {
          const id = uid();
          return {
            activities: [
              ...state.activities,
              {
                id,
                name: "Nova atividade",
                durationMin: 30,
                dependsOn: [],
                granularity: "medio",
                subactivities: "",
              },
            ],
            nodes: [
              ...state.nodes,
              { id: uid(), kind: "activity", activityId: id, ...nextNodePosition(state.nodes) },
            ],
          };
        }),
      placeActivity: (activityId) =>
        set((state) => {
          if (state.nodes.some((node) => node.activityId === activityId)) return state;
          return {
            nodes: [
              ...state.nodes,
              {
                id: uid(),
                kind: "activity",
                activityId,
                ...nextNodePosition(state.nodes),
              },
            ],
          };
        }),
      addDecisionNode: () =>
        set((state) => {
          const id = uid();
          return {
            decisions: [
              ...state.decisions,
              {
                id,
                question: "Condição atendida?",
                rules: "",
                exceptions: "",
                treatment: "",
              },
            ],
            nodes: [
              ...state.nodes,
              { id: uid(), kind: "decision", decisionId: id, ...nextNodePosition(state.nodes) },
            ],
          };
        }),
      addTerminal: (kind) =>
        set((state) => {
          if (state.nodes.some((node) => node.kind === kind)) return state;
          return {
            nodes: [...state.nodes, { id: uid(), kind, ...nextNodePosition(state.nodes) }],
          };
        }),
      moveNode: (id, x, y) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, x: Math.max(0, Math.round(x)), y: Math.max(0, Math.round(y)) } : node,
          ),
        })),
      updateNodeLabel: (id, label) =>
        set((state) => {
          const node = state.nodes.find((item) => item.id === id);
          if (!node) return state;
          if (node.kind === "activity" && node.activityId) {
            return {
              activities: state.activities.map((activity) =>
                activity.id === node.activityId ? { ...activity, name: label } : activity,
              ),
            };
          }
          if (node.kind === "decision" && node.decisionId) {
            return {
              decisions: state.decisions.map((decision) =>
                decision.id === node.decisionId ? { ...decision, question: label } : decision,
              ),
            };
          }
          return state;
        }),
      removeNode: (id) =>
        set((state) => {
          const node = state.nodes.find((item) => item.id === id);
          if (!node) return state;
          return {
            decisions:
              node.kind === "decision"
                ? state.decisions.filter((decision) => decision.id !== node.decisionId)
                : state.decisions,
            nodes: state.nodes.filter((item) => item.id !== id),
            edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
          };
        }),
      connect: (source, target, branch) =>
        set((state) => {
          if (source === target) return state;
          const sourceNode = state.nodes.find((node) => node.id === source);
          const targetNode = state.nodes.find((node) => node.id === target);
          if (!sourceNode || !targetNode) return state;
          if (sourceNode.kind === "end" || targetNode.kind === "start") return state;
          const resolved: Branch = sourceNode.kind === "decision" ? (branch === "nao" ? "nao" : "sim") : "fluxo";
          const edges =
            resolved === "fluxo"
              ? state.edges.filter(
                  (edge) => !(edge.source === source && edge.target === target && edge.branch === "fluxo"),
                )
              : state.edges.filter((edge) => !(edge.source === source && edge.branch === resolved));
          return { edges: [...edges, { id: uid(), source, target, branch: resolved }] };
        }),
      setDecisionBranches: (decisionId, simTarget, naoTarget) =>
        set((state) => {
          const node = state.nodes.find((item) => item.decisionId === decisionId);
          if (!node) return state;
          let edges = state.edges.filter(
            (edge) => !(edge.source === node.id && (edge.branch === "sim" || edge.branch === "nao")),
          );
          if (simTarget && simTarget !== node.id) {
            edges = [...edges, { id: uid(), source: node.id, target: simTarget, branch: "sim" }];
          }
          if (naoTarget && naoTarget !== node.id) {
            edges = [...edges, { id: uid(), source: node.id, target: naoTarget, branch: "nao" }];
          }
          return { edges };
        }),
      removeEdge: (id) => set((state) => ({ edges: state.edges.filter((edge) => edge.id !== id) })),
      patchDecision: (id, patch) =>
        set((state) => ({
          decisions: state.decisions.map((decision) =>
            decision.id === id ? { ...decision, ...patch } : decision,
          ),
        })),
      organize: () => set((state) => ({ nodes: layoutNodes(state.nodes, state.edges) })),
      generateLinear: () =>
        set((state) => {
          const named = state.activities.filter((activity) => activity.name.trim());
          const start = { id: uid(), kind: "start" as const, x: 0, y: 0 };
          const activityNodes = named.map((activity) => ({
            id: uid(),
            kind: "activity" as const,
            activityId: activity.id,
            x: 0,
            y: 0,
          }));
          const end = { id: uid(), kind: "end" as const, x: 0, y: 0 };
          const nodes = [start, ...activityNodes, end];
          const edges = nodes.slice(0, -1).map((node, index) => ({
            id: uid(),
            source: node.id,
            target: nodes[index + 1].id,
            branch: "fluxo" as const,
          }));
          return {
            nodes: layoutNodes(nodes, edges),
            edges,
            decisions: [],
          };
        }),
      loadExample: () => set((state) => ({ ...createExample(), theme: state.theme })),
      reset: () => set((state) => ({ ...blankData(), theme: state.theme })),
    }),
    {
      name: "processmapper-pro-v1",
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage() : localStorage)),
    },
  ),
);
