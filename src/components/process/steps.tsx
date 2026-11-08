import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button, Field, Input, Select, TextArea } from "@/components/ui/controls";
import { FlowCanvas } from "@/components/process/flow-canvas";
import { MermaidView } from "@/components/process/mermaid-view";
import { buildMapSvg, buildMermaid, copyText, downloadSvgAsPng, downloadText } from "@/lib/process/diagram";
import {
  CHECK_ITEMS,
  GRANULARITY_LABEL,
  RACI_CYCLE,
  STEPS,
  allIssues,
  fileSlug,
  nodeLabel,
  type Granularity,
} from "@/lib/process/model";
import type { N8nWorkflow } from "@/lib/process/n8n";
import { useProcess } from "@/lib/process/store";

export function StepView({
  step,
  showErrors,
  workflow,
  stale,
  onGenerate,
  onPrint,
  printing,
}: {
  step: number;
  showErrors: boolean;
  workflow: N8nWorkflow | null;
  stale: boolean;
  onGenerate: () => void;
  onPrint: () => void;
  printing: boolean;
}) {
  if (step === 1) return <StepIdentify showErrors={showErrors} />;
  if (step === 2) return <StepFlow />;
  if (step === 3) return <StepRules showErrors={showErrors} />;
  if (step === 4) return <StepSequence showErrors={showErrors} />;
  if (step === 5) return <StepGranularity />;
  if (step === 6) return <StepMap />;
  if (step === 7) return <StepRaci showErrors={showErrors} />;
  if (step === 8) return <StepClassify showErrors={showErrors} />;
  return <StepReview workflow={workflow} stale={stale} onGenerate={onGenerate} onPrint={onPrint} printing={printing} />;
}

function Section({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="grid min-w-0 gap-4 rounded-xl border border-line bg-card p-4">
      <div className="grid gap-1">
        {kicker ? <p className="text-xs font-semibold tracking-wide text-ink-soft">{kicker}</p> : null}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StepIdentify({ showErrors }: { showErrors: boolean }) {
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

  return (
    <div className="grid gap-4">
      <Section title="Identificação do processo" kicker="Etapa 1">
        <p className="text-sm text-ink-soft">
          Dê nome ao processo e registre o que entra, o que acontece e o que sai. Se quiser ver o caminho completo, carregue o exemplo de reembolso.
        </p>
        <Button onClick={loadExample}>Carregar exemplo de reembolso</Button>
        <Field id="process-name" label="Nome do processo" required error={showErrors && !name.trim() ? "Informe o nome do processo." : undefined}>
          <Input id="process-name" value={name} placeholder="Ex.: Aprovação de reembolso" onChange={(event) => patchMeta({ name: event.target.value })} />
        </Field>
        <Field id="process-description" label="Descrição" required error={showErrors && !description.trim() ? "Descreva o processo." : undefined}>
          <TextArea id="process-description" value={description} placeholder="O que este processo resolve e quando ele começa." onChange={(event) => patchMeta({ description: event.target.value })} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="process-inputs" label="Entradas" required hint="Uma informação por linha ou uma frase." error={showErrors && !inputs.trim() ? "Liste as entradas." : undefined}>
            <TextArea id="process-inputs" value={inputs} placeholder="Formulário, documentos, dados de sistema." onChange={(event) => patchMeta({ inputs: event.target.value })} />
          </Field>
          <Field id="process-outputs" label="Saídas" required error={showErrors && !outputs.trim() ? "Liste as saídas." : undefined}>
            <TextArea id="process-outputs" value={outputs} placeholder="O que fica pronto ao final." onChange={(event) => patchMeta({ outputs: event.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Atividades principais">
        {activities.length === 0 ? (
          <p className="text-sm text-ink-soft">Nenhuma atividade ainda. Adicione a primeira etapa do trabalho.</p>
        ) : (
          <ol className="grid gap-3">
            {activities.map((activity, index) => (
              <li key={activity.id} className="grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className="font-mono text-sm text-ink-soft">{String(index + 1).padStart(2, "0")}</span>
                <Input
                  aria-label={`Nome da atividade ${index + 1}`}
                  value={activity.name}
                  placeholder="Ex.: Conferir nota fiscal"
                  onChange={(event) => patchActivity(activity.id, { name: event.target.value })}
                />
                <Button variant="danger" onClick={() => removeActivity(activity.id)}>
                  Remover
                </Button>
              </li>
            ))}
          </ol>
        )}
        {showErrors && activities.length === 0 ? <p className="text-sm text-danger">Adicione ao menos uma atividade.</p> : null}
        {showErrors && activities.some((activity) => !activity.name.trim()) ? (
          <p className="text-sm text-danger">Toda atividade precisa de um nome.</p>
        ) : null}
        <Button variant="primary" onClick={addActivity}>
          Adicionar atividade
        </Button>
      </Section>
    </div>
  );
}

function StepFlow() {
  const theme = useProcess((state) => state.theme);
  const nodes = useProcess((state) => state.nodes);
  const edges = useProcess((state) => state.edges);
  const activities = useProcess((state) => state.activities);
  const decisions = useProcess((state) => state.decisions);
  const code = buildMermaid({ nodes, edges, activities, decisions });

  return (
    <div className="grid gap-4">
      <Section title="Fluxograma simplificado" kicker="Etapa 2">
        <p className="text-sm text-ink-soft">
          Arraste os cartões, ligue um nó ao outro pelo botão do cartão ou pelo formulário abaixo. Decisões têm ramos Sim e Não.
        </p>
        <FlowCanvas />
      </Section>
      <Section title="Prévia em tempo real">
        <MermaidView code={code} theme={theme} />
      </Section>
    </div>
  );
}

function StepRules({ showErrors }: { showErrors: boolean }) {
  const decisions = useProcess((state) => state.decisions);
  const patchDecision = useProcess((state) => state.patchDecision);

  return (
    <Section title="Regras, exceções e tratamento" kicker="Etapa 3">
      {decisions.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Não há pontos de decisão no fluxo. Se o processo for linear, continue. Para cadastrar regras, volte e adicione um nó de decisão.
        </p>
      ) : (
        <div className="grid gap-4">
          {decisions.map((decision) => (
            <article key={decision.id} className="grid gap-3 rounded-lg border border-line p-3">
              <Field id={`q-${decision.id}`} label="Pergunta da decisão">
                <Input id={`q-${decision.id}`} value={decision.question} onChange={(event) => patchDecision(decision.id, { question: event.target.value })} />
              </Field>
              <Field
                id={`rules-${decision.id}`}
                label="Regras"
                required
                error={showErrors && !decision.rules.trim() ? "Descreva a regra do Sim." : undefined}
              >
                <TextArea id={`rules-${decision.id}`} value={decision.rules} placeholder="Quando a resposta é Sim." onChange={(event) => patchDecision(decision.id, { rules: event.target.value })} />
              </Field>
              <Field id={`exc-${decision.id}`} label="Condições de exceção">
                <TextArea id={`exc-${decision.id}`} value={decision.exceptions} placeholder="Casos que não seguem a regra padrão." onChange={(event) => patchDecision(decision.id, { exceptions: event.target.value })} />
              </Field>
              <Field
                id={`treat-${decision.id}`}
                label="Tratamento"
                required
                error={showErrors && !decision.treatment.trim() ? "Descreva o que fazer na exceção." : undefined}
              >
                <TextArea id={`treat-${decision.id}`} value={decision.treatment} placeholder="Quem age e o que registra quando a resposta é Não." onChange={(event) => patchDecision(decision.id, { treatment: event.target.value })} />
              </Field>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

function StepSequence({ showErrors }: { showErrors: boolean }) {
  const activities = useProcess((state) => state.activities);
  const moveActivity = useProcess((state) => state.moveActivity);
  const patchActivity = useProcess((state) => state.patchActivity);
  const setDepends = useProcess((state) => state.setDepends);
  const total = activities.reduce((sum, activity) => sum + (activity.durationMin > 0 ? activity.durationMin : 0), 0);

  return (
    <Section title="Sequência lógica e duração" kicker="Etapa 4">
      <p className="text-sm text-ink-soft">
        A ordem da lista é a sequência cronológica. Dependências indicam o que precisa terminar antes. Total estimado:{" "}
        <span className="font-semibold tabular-nums text-ink">{total} min</span>.
      </p>
      {activities.length === 0 ? (
        <p className="text-sm text-ink-soft">Cadastre atividades na etapa 1.</p>
      ) : (
        <ol className="grid gap-3">
          {activities.map((activity, index) => (
            <li key={activity.id} className="grid gap-3 rounded-lg border border-line p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-ink">
                  <span className="mr-2 font-mono text-sm text-ink-soft">{String(index + 1).padStart(2, "0")}</span>
                  {activity.name || "Atividade sem nome"}
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => moveActivity(index, -1)} disabled={index === 0} aria-label="Mover para cima">
                    Subir
                  </Button>
                  <Button onClick={() => moveActivity(index, 1)} disabled={index === activities.length - 1} aria-label="Mover para baixo">
                    Descer
                  </Button>
                </div>
              </div>
              <Field
                id={`dur-${activity.id}`}
                label="Duração estimada (minutos)"
                required
                error={showErrors && activity.durationMin <= 0 ? "Informe uma duração maior que zero." : undefined}
              >
                <Input
                  id={`dur-${activity.id}`}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={activity.durationMin || ""}
                  onChange={(event) =>
                    patchActivity(activity.id, { durationMin: event.target.value === "" ? 0 : Number(event.target.value) })
                  }
                />
              </Field>
              {activities.length > 1 ? (
                <fieldset className="grid gap-2">
                  <legend className="text-sm font-semibold">Depende de</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activities.filter((item) => item.id !== activity.id).map((item) => {
                      const checked = activity.dependsOn.includes(item.id);
                      return (
                        <label key={item.id} className="flex min-h-11 items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked
                                ? activity.dependsOn.filter((id) => id !== item.id)
                                : [...activity.dependsOn, item.id];
                              setDepends(activity.id, next);
                            }}
                          />
                          <span>{item.name || "Atividade sem nome"}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

function StepGranularity() {
  const activities = useProcess((state) => state.activities);
  const patchActivity = useProcess((state) => state.patchActivity);
  const options: { id: Granularity; text: string }[] = [
    { id: "macro", text: "Macro — visão de gestão, sem o como." },
    { id: "medio", text: "Médio — um analista consegue executar." },
    { id: "micro", text: "Micro — campos, cliques e regras." },
  ];

  return (
    <Section title="Nível de granularidade" kicker="Etapa 5">
      <p className="text-sm text-ink-soft">Escolha o quanto cada atividade precisa ser detalhada. Subatividades são opcionais, uma por linha.</p>
      {activities.length === 0 ? <p className="text-sm text-ink-soft">Cadastre atividades na etapa 1.</p> : null}
      <div className="grid gap-4">
        {activities.map((activity) => (
          <article key={activity.id} className="grid gap-3 rounded-lg border border-line p-3">
            <h3 className="font-semibold text-ink">{activity.name || "Atividade sem nome"}</h3>
            <div className="grid gap-2 md:grid-cols-3">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={activity.granularity === option.id}
                  className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm ${
                    activity.granularity === option.id ? "border-accent bg-accent text-accent-fg" : "border-line bg-card text-ink"
                  }`}
                  onClick={() => patchActivity(activity.id, { granularity: option.id })}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <Field id={`sub-${activity.id}`} label="Subatividades" hint="Opcional. Uma por linha.">
              <TextArea
                id={`sub-${activity.id}`}
                value={activity.subactivities}
                placeholder={"Conferir campos\nRegistrar protocolo"}
                onChange={(event) => patchActivity(activity.id, { subactivities: event.target.value })}
              />
            </Field>
          </article>
        ))}
      </div>
    </Section>
  );
}

function StepMap() {
  const data = useProcess();
  const svg = buildMapSvg(data, data.theme);
  const code = buildMermaid(data);

  return (
    <div className="grid gap-4">
      <Section title="Mapa consolidado" kicker="Etapa 6">
        <p className="text-sm text-ink-soft">Esta visão usa as posições do editor. Organize o fluxo na etapa 2 se os cartões estiverem sobrepostos.</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            disabled={data.nodes.length === 0}
            onClick={() => {
              void downloadSvgAsPng(
                svg,
                fileSlug(data.name).replace(/\.n8n\.json$/, ".png"),
                data.theme === "dark" ? "#121311" : "#fbfaf6",
              ).then(
                () => toast.success("PNG baixado"),
                () => toast.error("Não foi possível gerar o PNG"),
              );
            }}
          >
            Exportar PNG
          </Button>
        </div>
        <div className="diagram-scroll rounded-lg border border-line bg-paper" dangerouslySetInnerHTML={{ __html: svg }} />
      </Section>
      <Section title="Diagrama Mermaid">
        <MermaidView code={code} theme={data.theme} />
        <pre className="overflow-auto rounded-md border border-line bg-paper p-4 font-mono text-xs text-ink">{code}</pre>
      </Section>
    </div>
  );
}

function StepRaci({ showErrors }: { showErrors: boolean }) {
  const activities = useProcess((state) => state.activities);
  const roles = useProcess((state) => state.roles);
  const raci = useProcess((state) => state.raci);
  const addRole = useProcess((state) => state.addRole);
  const removeRole = useProcess((state) => state.removeRole);
  const setRaci = useProcess((state) => state.setRaci);
  const [roleName, setRoleName] = useState("");

  return (
    <Section title="Matriz RACI" kicker="Etapa 7">
      <dl className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
        <div><dt className="inline font-semibold text-ink">R</dt> executa o trabalho.</div>
        <div><dt className="inline font-semibold text-ink">A</dt> responde pelo resultado. Um por atividade.</div>
        <div><dt className="inline font-semibold text-ink">C</dt> é consultado antes da decisão.</div>
        <div><dt className="inline font-semibold text-ink">I</dt> é informado depois.</div>
      </dl>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addRole(roleName);
          setRoleName("");
        }}
      >
        <Input
          aria-label="Nova função"
          value={roleName}
          placeholder="Ex.: Analista"
          onChange={(event) => setRoleName(event.target.value)}
          className="max-w-xs"
        />
        <Button variant="primary" type="submit">
          Adicionar função
        </Button>
      </form>
      {roles.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <li key={role}>
              <Button onClick={() => removeRole(role)}>Remover {role}</Button>
            </li>
          ))}
        </ul>
      ) : null}
      {showErrors && roles.length === 0 ? <p className="text-sm text-danger">Adicione ao menos uma função.</p> : null}
      {activities.length === 0 || roles.length === 0 ? (
        <p className="text-sm text-ink-soft">A matriz aparece quando há atividades e funções.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-card p-2 text-left font-semibold">Atividade</th>
                {roles.map((role) => (
                  <th key={role} className="min-w-28 p-2 text-left font-semibold">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => {
                const row = raci[activity.id] ?? {};
                const letters = roles.map((role) => row[role] ?? "");
                const accountable = letters.filter((letter) => letter === "A").length;
                const responsible = letters.filter((letter) => letter === "R").length;
                const invalid = showErrors && (responsible < 1 || accountable !== 1);
                return (
                  <tr key={activity.id}>
                    <th className="sticky left-0 bg-card p-2 text-left font-medium">
                      {activity.name || "Sem nome"}
                      {invalid ? <span className="mt-1 block text-xs font-normal text-danger">Defina um R e um único A.</span> : null}
                    </th>
                    {roles.map((role) => {
                      const letter = row[role] ?? "";
                      return (
                        <td key={role} className="p-2">
                          <button
                            type="button"
                            aria-label={`${activity.name || "Atividade"}, ${role}: ${letter || "vazio"}`}
                            className={`grid size-11 place-items-center rounded-md border font-semibold ${
                              letter ? "border-accent bg-accent text-accent-fg" : "border-line bg-paper text-ink-soft"
                            }`}
                            onClick={() => {
                              const index = RACI_CYCLE.indexOf(letter);
                              const next = RACI_CYCLE[(index + 1) % RACI_CYCLE.length];
                              setRaci(activity.id, role, next);
                            }}
                          >
                            {letter || "·"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

function StepClassify({ showErrors }: { showErrors: boolean }) {
  const decisions = useProcess((state) => state.decisions);
  const nodes = useProcess((state) => state.nodes);
  const edges = useProcess((state) => state.edges);
  const activities = useProcess((state) => state.activities);
  const patchDecision = useProcess((state) => state.patchDecision);
  const setDecisionBranches = useProcess((state) => state.setDecisionBranches);
  const data = { activities, decisions };

  return (
    <Section title="Classificação dos pontos de decisão" kicker="Etapa 8">
      <p className="text-sm text-ink-soft">
        Cada pergunta deve poder ser respondida com Sim ou Não. O ramo Sim vira a saída verdadeira do nó IF no n8n; o Não, a saída falsa.
      </p>
      {decisions.length === 0 ? (
        <p className="text-sm text-ink-soft">Nenhuma decisão para classificar.</p>
      ) : (
        <div className="grid gap-4">
          {decisions.map((decision) => {
            const node = nodes.find((item) => item.decisionId === decision.id);
            const sim = edges.find((edge) => edge.source === node?.id && edge.branch === "sim")?.target ?? "";
            const nao = edges.find((edge) => edge.source === node?.id && edge.branch === "nao")?.target ?? "";
            const options = nodes.filter((item) => item.id !== node?.id && item.kind !== "start");
            return (
              <article key={decision.id} className="grid gap-3 rounded-lg border border-line p-3">
                <Field
                  id={`class-${decision.id}`}
                  label="Pergunta Sim/Não"
                  required
                  error={showErrors && !decision.question.trim() ? "Escreva a pergunta." : undefined}
                >
                  <Input id={`class-${decision.id}`} value={decision.question} onChange={(event) => patchDecision(decision.id, { question: event.target.value })} />
                </Field>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field id={`sim-${decision.id}`} label="Se Sim, seguir para" error={showErrors && !sim ? "Escolha o ramo verdadeiro." : undefined}>
                    <Select
                      id={`sim-${decision.id}`}
                      value={sim}
                      onChange={(event) => setDecisionBranches(decision.id, event.target.value, nao)}
                    >
                      <option value="">Selecione</option>
                      {options.map((item) => (
                        <option key={item.id} value={item.id}>
                          {nodeLabel(item, data)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field id={`nao-${decision.id}`} label="Se Não, seguir para" error={showErrors && !nao ? "Escolha o ramo falso." : undefined}>
                    <Select
                      id={`nao-${decision.id}`}
                      value={nao}
                      onChange={(event) => setDecisionBranches(decision.id, sim, event.target.value)}
                    >
                      <option value="">Selecione</option>
                      {options.map((item) => (
                        <option key={item.id} value={item.id}>
                          {nodeLabel(item, data)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function StepReview({
  workflow,
  stale,
  onGenerate,
  onPrint,
  printing,
}: {
  workflow: N8nWorkflow | null;
  stale: boolean;
  onGenerate: () => void;
  onPrint: () => void;
  printing: boolean;
}) {
  const data = useProcess();
  const patchMeta = useProcess((state) => state.patchMeta);
  const toggleCheck = useProcess((state) => state.toggleCheck);
  const setStep = useProcess((state) => state.setStep);
  const issues = allIssues(data);
  const json = workflow ? JSON.stringify(workflow, null, 2) : "";
  const code = buildMermaid(data);
  const checked = CHECK_ITEMS.filter((item) => data.checks[item.id]).length;
  const jsonRef = useRef<HTMLPreElement>(null);

  function copyJson() {
    void copyText(json).then((ok) => {
      if (ok) {
        toast.success("JSON copiado");
        return;
      }
      const node = jsonRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      toast.error("A cópia automática foi bloqueada. O JSON está selecionado: use Ctrl+C ou toque e segure.");
    });
  }

  return (
    <div className="grid gap-4">
      <Section title="Revisão do mapeamento" kicker="Etapa 9">
        <p className="text-sm text-ink-soft">
          Confira o conjunto e imprima um PDF com tudo o que foi configurado: identificação, fluxo, regras, tempos, RACI e esta revisão.
        </p>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="font-semibold">Processo</dt>
            <dd className="text-ink-soft">{data.name || "Sem nome"}</dd>
          </div>
          <div>
            <dt className="font-semibold">Descrição</dt>
            <dd className="text-ink-soft">{data.description || "—"}</dd>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <dt className="font-semibold">Entradas</dt>
              <dd className="whitespace-pre-wrap text-ink-soft">{data.inputs || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Saídas</dt>
              <dd className="whitespace-pre-wrap text-ink-soft">{data.outputs || "—"}</dd>
            </div>
          </div>
        </dl>
        <ul className="grid gap-2">
          {data.activities.map((activity, index) => (
            <li key={activity.id} className="rounded-md border border-line px-3 py-2 text-sm">
              <span className="font-mono text-ink-soft">{String(index + 1).padStart(2, "0")}</span>{" "}
              <span className="font-semibold">{activity.name || "Sem nome"}</span>
              <span className="text-ink-soft">
                {" "}
                · {activity.durationMin || 0} min · {GRANULARITY_LABEL[activity.granularity]}
              </span>
            </li>
          ))}
        </ul>
        {data.decisions.length > 0 ? (
          <ul className="grid gap-2 text-sm">
            {data.decisions.map((decision) => (
              <li key={decision.id} className="rounded-md border border-line px-3 py-2">
                <p className="font-semibold">{decision.question}</p>
                <p className="text-ink-soft">{decision.rules}</p>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={onPrint} disabled={printing}>
            {printing ? "Gerando PDF…" : "Imprimir PDF"}
          </Button>
          {STEPS.filter((item) => item.n < 9).map((item) => (
            <Button key={item.n} onClick={() => setStep(item.n)}>
              Editar {item.short}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Checklist de validação">
        <p className="text-sm text-ink-soft">
          {checked} de {CHECK_ITEMS.length} conferidos. As pendências objetivas aparecem à parte.
        </p>
        <ul className="grid gap-2">
          {CHECK_ITEMS.map((item) => (
            <li key={item.id}>
              <label className="flex min-h-11 items-center gap-3 text-sm">
                <input type="checkbox" checked={Boolean(data.checks[item.id])} onChange={() => toggleCheck(item.id)} />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
        <Field id="comments" label="Comentários finais">
          <TextArea id="comments" value={data.comments} placeholder="Observações para quem for importar o workflow." onChange={(event) => patchMeta({ comments: event.target.value })} />
        </Field>
        {issues.length > 0 ? (
          <div className="grid gap-2 rounded-lg border border-line bg-paper p-3" role="status">
            <p className="text-sm font-semibold">Pendências antes de considerar o mapa fechado</p>
            <ul className="grid gap-1 text-sm text-ink-soft">
              {issues.flatMap((issue) => issue.messages.map((message) => (
                <li key={`${issue.step}-${message}`}>
                  Etapa {issue.step}: {message}
                </li>
              )))}
            </ul>
            <p className="text-sm text-ink-soft">Você ainda pode gerar o JSON com o que já foi mapeado.</p>
          </div>
        ) : (
          <p className="text-sm text-ok">Nenhuma pendência objetiva. O mapa está consistente.</p>
        )}
        <Button variant="primary" onClick={onGenerate}>
          Gerar workflow n8n
        </Button>
      </Section>

      {workflow ? (
        <Section title="Workflow n8n">
          {stale ? <p className="text-sm text-warn">O mapeamento mudou desde a última geração. Gere de novo para atualizar o arquivo.</p> : null}
          <p className="text-sm text-ink-soft">
            {workflow.nodes.length} nós · {workflow.nodes.filter((node) => node.type.endsWith(".if")).length} decisões · nome “{workflow.name}”. No n8n, use o menu do workflow e escolha Import from File.
          </p>
          {!data.nodes.some((node) => node.kind === "activity") ? (
            <p className="text-sm text-ink-soft">Sem fluxograma desenhado, as atividades foram encadeadas na ordem da lista.</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => {
                downloadText(fileSlug(data.name), json, "application/json");
                toast.success("JSON baixado");
              }}
            >
              Baixar JSON
            </Button>
            <Button onClick={copyJson}>Copiar JSON</Button>
          </div>
          <pre
            ref={jsonRef}
            className="max-h-96 select-text overflow-auto rounded-md border border-line bg-paper p-4 font-mono text-xs leading-relaxed text-ink"
          >
            {json}
          </pre>
          <h3 className="font-display text-xl font-semibold">Diagrama correspondente</h3>
          <MermaidView code={code} theme={data.theme} />
        </Section>
      ) : null}
    </div>
  );
}
