import { useRef, useState } from "react";

import { Button, Input, Select } from "@/components/ui/controls";
import { edgePath, portPoint } from "@/lib/process/diagram";
import {
  type Branch,
  type FlowNode,
  NODE_H,
  NODE_W,
  nodeLabel,
} from "@/lib/process/model";
import { useProcess } from "@/lib/process/store";

const KIND_LABEL = {
  start: "Início",
  end: "Fim",
  activity: "Atividade",
  decision: "Decisão",
} as const;

export function FlowCanvas({ readOnly = false }: { readOnly?: boolean }) {
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

  const worldRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState<{ source: string; branch: Branch } | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; ox: number; oy: number } | null>(null);
  const [confirmLinear, setConfirmLinear] = useState(false);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [branch, setBranch] = useState<Branch>("fluxo");
  const moved = useRef(false);

  const data = { activities, decisions };
  const display = nodes.map((node) => (drag && drag.id === node.id ? { ...node, x: drag.x, y: drag.y } : node));
  const width = Math.max(760, ...display.map((node) => node.x + NODE_W + 80), 0);
  const height = Math.max(420, ...display.map((node) => node.y + NODE_H + 48), 0);
  const placed = new Set(nodes.filter((node) => node.activityId).map((node) => node.activityId));
  const missing = activities.filter((activity) => activity.name.trim() && !placed.has(activity.id));
  const selectedNode = display.find((node) => node.id === selected) ?? null;
  const hasStart = nodes.some((node) => node.kind === "start");
  const hasEnd = nodes.some((node) => node.kind === "end");

  function beginLink(node: FlowNode, nextBranch: Branch) {
    setPending({ source: node.id, branch: node.kind === "decision" ? nextBranch : "fluxo" });
    setSelected(node.id);
  }

  function finishLink(target: string) {
    if (!pending || pending.source === target) return;
    connect(pending.source, target, pending.branch);
    setPending(null);
  }

  return (
    <div className="grid gap-4">
      {readOnly ? null : (
        <div className="flex flex-wrap gap-2">
          <Button onClick={addActivityNode}>Atividade</Button>
          <Button onClick={addDecisionNode}>Decisão</Button>
          <Button onClick={() => addTerminal("start")} disabled={hasStart}>
            Início
          </Button>
          <Button onClick={() => addTerminal("end")} disabled={hasEnd}>
            Fim
          </Button>
          <Button onClick={organize} disabled={nodes.length === 0}>
            Organizar
          </Button>
          {confirmLinear ? (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  generateLinear();
                  setConfirmLinear(false);
                  setSelected(null);
                }}
              >
                Substituir fluxo
              </Button>
              <Button variant="ghost" onClick={() => setConfirmLinear(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              variant={nodes.length > 0 ? "secondary" : "primary"}
              onClick={() => {
                if (nodes.length > 0) setConfirmLinear(true);
                else generateLinear();
              }}
              disabled={!activities.some((activity) => activity.name.trim())}
            >
              Gerar fluxo linear
            </Button>
          )}
        </div>
      )}

      {pending ? (
        <p className="rounded-md border border-line bg-accent-soft px-3 py-2 text-sm text-ink" role="status">
          Ligando o ramo {pending.branch === "nao" ? "Não" : pending.branch === "sim" ? "Sim" : "seguinte"}. Clique no nó de destino.
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setPending(null)}>
            Cancelar
          </button>
        </p>
      ) : null}

      <div className="flow-viewport overflow-auto rounded-lg border border-line bg-paper-2">
        <div ref={worldRef} className="relative" style={{ width, height }}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" className="fill-ink" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const source = display.find((node) => node.id === edge.source);
              const target = display.find((node) => node.id === edge.target);
              if (!source || !target) return null;
              const from = portPoint(source, "out", source.kind === "decision" ? edge.branch : "fluxo");
              const to = portPoint(target, "in");
              const path = edgePath(from.x, from.y, to.x, to.y);
              const label = edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "";
              return (
                <g key={edge.id}>
                  <path d={path.d} fill="none" stroke="var(--color-ink)" strokeWidth="1.75" markerEnd="url(#flow-arrow)" />
                  {label ? (
                    <text
                      x={path.mx}
                      y={path.my}
                      textAnchor="middle"
                      fill="var(--color-ink)"
                      stroke="var(--color-paper-2)"
                      strokeWidth="4"
                      paintOrder="stroke"
                      fontSize="12"
                      fontFamily="Source Sans 3, sans-serif"
                    >
                      {label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {display.length === 0 ? (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-ink-soft">
              O fluxo ainda está vazio. Gere a sequência a partir das atividades ou adicione nós.
            </p>
          ) : null}

          {display.map((node) => {
            const label = nodeLabel(node, data);
            const active = selected === node.id || pending?.source === node.id;
            return (
              <article
                key={node.id}
                className={`absolute grid content-center gap-1 rounded-lg border px-3 ${
                  node.kind === "start" || node.kind === "end"
                    ? "bg-accent text-accent-fg"
                    : node.kind === "decision"
                      ? "bg-accent-soft text-ink"
                      : "bg-card text-ink"
                } ${active ? "border-accent ring-2 ring-accent" : "border-line"} ${readOnly ? "" : "touch-none"}`}
                style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                onPointerDown={(event) => {
                  if (readOnly) return;
                  if ((event.target as HTMLElement).closest("[data-port]")) return;
                  const world = worldRef.current?.getBoundingClientRect();
                  if (!world) return;
                  moved.current = false;
                  setSelected(node.id);
                  setDrag({
                    id: node.id,
                    x: node.x,
                    y: node.y,
                    ox: event.clientX - world.left - node.x,
                    oy: event.clientY - world.top - node.y,
                  });
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!drag || drag.id !== node.id || !worldRef.current) return;
                  const world = worldRef.current.getBoundingClientRect();
                  const x = Math.max(0, event.clientX - world.left - drag.ox);
                  const y = Math.max(0, event.clientY - world.top - drag.oy);
                  if (Math.abs(x - node.x) + Math.abs(y - node.y) > 3) moved.current = true;
                  setDrag({ ...drag, x, y });
                }}
                onPointerUp={() => {
                  if (drag?.id === node.id) moveNode(node.id, drag.x, drag.y);
                  setDrag(null);
                }}
                onClick={() => {
                  if (moved.current) return;
                  if (pending) finishLink(node.id);
                  else setSelected(node.id);
                }}
              >
                <p className={`text-xs font-semibold tracking-wide ${node.kind === "start" || node.kind === "end" ? "text-accent-fg/80" : "text-ink-soft"}`}>
                  {KIND_LABEL[node.kind]}
                </p>
                <p className="truncate text-sm font-semibold">{label}</p>
                {readOnly || node.kind === "end" ? null : node.kind === "decision" ? (
                  <div className="mt-1 flex gap-1">
                    <Port label="Sim" onClick={() => beginLink(node, "sim")} />
                    <Port label="Não" onClick={() => beginLink(node, "nao")} />
                  </div>
                ) : (
                  <div className="mt-1">
                    <Port label="Ligar" onClick={() => beginLink(node, "fluxo")} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {readOnly ? null : (
        <div className="grid gap-4">
          {missing.length > 0 ? (
            <div className="grid gap-2">
              <p className="text-sm font-semibold text-ink">Atividades ainda fora do fluxo</p>
              <div className="flex flex-wrap gap-2">
                {missing.map((activity) => (
                  <Button key={activity.id} onClick={() => placeActivity(activity.id)}>
                    Incluir {activity.name}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 rounded-lg border border-line bg-card p-4 md:grid-cols-[1fr_10rem_1fr_auto] md:items-end">
            <label className="grid gap-2 text-sm font-semibold">
              De
              <Select value={sourceId} onChange={(event) => setSourceId(event.target.value)}>
                <option value="">Selecione</option>
                {nodes.filter((node) => node.kind !== "end").map((node) => (
                  <option key={node.id} value={node.id}>
                    {nodeLabel(node, data)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Ramo
              <Select value={branch} onChange={(event) => setBranch(event.target.value as Branch)}>
                <option value="fluxo">Seguinte</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Para
              <Select value={targetId} onChange={(event) => setTargetId(event.target.value)}>
                <option value="">Selecione</option>
                {nodes.filter((node) => node.kind !== "start" && node.id !== sourceId).map((node) => (
                  <option key={node.id} value={node.id}>
                    {nodeLabel(node, data)}
                  </option>
                ))}
              </Select>
            </label>
            <Button
              variant="primary"
              disabled={!sourceId || !targetId}
              onClick={() => {
                connect(sourceId, targetId, branch);
              }}
            >
              Conectar
            </Button>
          </div>

          {selectedNode && selectedNode.kind !== "start" && selectedNode.kind !== "end" ? (
            <div className="grid gap-3 rounded-lg border border-line p-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className="grid gap-2 text-sm font-semibold">
                {selectedNode.kind === "decision" ? "Pergunta da decisão" : "Nome da atividade"}
                <Input
                  value={nodeLabel(selectedNode, data)}
                  onChange={(event) => updateNodeLabel(selectedNode.id, event.target.value)}
                />
              </label>
              <Button variant="danger" onClick={() => { removeNode(selectedNode.id); setSelected(null); }}>
                {selectedNode.kind === "decision" ? "Excluir decisão" : "Remover do fluxo"}
              </Button>
            </div>
          ) : selectedNode ? (
            <div className="flex justify-end">
              <Button variant="danger" onClick={() => { removeNode(selectedNode.id); setSelected(null); }}>
                Remover {KIND_LABEL[selectedNode.kind].toLowerCase()}
              </Button>
            </div>
          ) : null}

          {edges.length > 0 ? (
            <ul className="grid gap-2">
              {edges.map((edge) => {
                const source = nodes.find((node) => node.id === edge.source);
                const target = nodes.find((node) => node.id === edge.target);
                if (!source || !target) return null;
                const via = edge.branch === "sim" ? "Sim" : edge.branch === "nao" ? "Não" : "segue";
                return (
                  <li key={edge.id} className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-sm">
                    <span className="min-w-0 truncate">
                      {nodeLabel(source, data)} <span className="text-ink-soft">— {via} —</span> {nodeLabel(target, data)}
                    </span>
                    <Button variant="ghost" onClick={() => removeEdge(edge.id)}>
                      Remover
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Port({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      data-port="true"
      className="h-7 rounded-md border border-line bg-card px-2 text-xs font-semibold text-ink"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {label}
    </button>
  );
}
