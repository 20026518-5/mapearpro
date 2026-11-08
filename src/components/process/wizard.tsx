import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Toaster, toast } from "sonner";

import { Button } from "@/components/ui/controls";
import { StepView } from "@/components/process/steps";
import { STEPS, contentSignature, stepIssues } from "@/lib/process/model";
import { buildN8nWorkflow, type N8nWorkflow } from "@/lib/process/n8n";
import { useProcess } from "@/lib/process/store";

export function Wizard() {
  const theme = useProcess((state) => state.theme);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useProcess.persist.onFinishHydration(() => setReady(true));
    void Promise.resolve(useProcess.persist.rehydrate()).then(() => setReady(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pm-theme", theme);
  }, [theme, ready]);

  return <WizardReady />;
}

function WizardReady() {
  const step = useProcess((state) => state.step);
  const theme = useProcess((state) => state.theme);
  const name = useProcess((state) => state.name);
  const setStep = useProcess((state) => state.setStep);
  const setTheme = useProcess((state) => state.setTheme);
  const loadExample = useProcess((state) => state.loadExample);
  const reset = useProcess((state) => state.reset);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [workflow, setWorkflow] = useState<N8nWorkflow | null>(null);
  const [signature, setSignature] = useState("");
  const [printing, setPrinting] = useState(false);

  const data = useProcess();
  const safeStep = Math.min(STEPS.length, Math.max(1, step));
  const issues = stepIssues(data, safeStep);
  const current = STEPS[safeStep - 1];
  const progress = (safeStep / STEPS.length) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function go(next: number) {
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

  async function printPdf() {
    if (printing) return;
    setPrinting(true);
    try {
      const { downloadProcessReport } = await import("@/lib/process/pdf");
      await downloadProcessReport(useProcess.getState());
      toast.success("PDF baixado");
    } catch {
      toast.error("Não foi possível gerar o PDF");
    } finally {
      setPrinting(false);
    }
  }

  return (
    <AppFrame>
      <Toaster theme={theme === "dark" ? "dark" : "light"} position="bottom-center" />
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Mark />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-tight">ProcessMapper Pro</p>
            <p className="truncate text-sm text-ink-soft">{name.trim() || "Novo processo"} · salvo neste navegador</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            aria-label="Carregar processo de exemplo"
            onClick={() => {
              loadExample();
              setWorkflow(null);
              setShowErrors(false);
              toast.success("Exemplo carregado");
            }}
          >
            Exemplo
          </Button>
          {confirmReset ? (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  reset();
                  setWorkflow(null);
                  setConfirmReset(false);
                  setShowErrors(false);
                }}
              >
                Apagar
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setConfirmReset(true)}>Novo</Button>
          )}
          <Button
            aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="sr-only">Tema</span>
          </Button>
        </div>
      </header>

      <div className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            {safeStep} de {STEPS.length} · {current.title}
          </p>
          <p className="text-sm text-ink-soft">Etapas livres para revisar</p>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-paper-2" aria-hidden="true">
          <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          {STEPS.map((item) => (
            <button
              key={item.n}
              type="button"
              aria-current={item.n === safeStep ? "step" : undefined}
              className={`h-11 shrink-0 rounded-md border px-3 text-sm font-semibold ${
                item.n === safeStep ? "border-accent bg-accent text-accent-fg" : "border-line bg-card text-ink"
              }`}
              onClick={() => go(item.n)}
            >
              {item.n} {item.short}
            </button>
          ))}
        </div>
      </div>

      <div key={safeStep} className="step-enter">
        <StepView
          step={safeStep}
          showErrors={showErrors}
          workflow={workflow}
          stale={Boolean(workflow && signature !== contentSignature(data))}
          onGenerate={generate}
          onPrint={() => void printPdf()}
          printing={printing}
        />
      </div>

      {showErrors && issues.length > 0 ? (
        <div className="rounded-lg border border-line bg-card px-4 py-3" role="alert">
          <p className="text-sm font-semibold text-danger">{issues[0]}</p>
          {issues.length > 1 ? <p className="text-sm text-ink-soft">Há mais {issues.length - 1} pendência(s) nesta etapa.</p> : null}
        </div>
      ) : null}

      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper py-4">
        <Button onClick={() => go(safeStep - 1)} disabled={safeStep === 1}>
          Voltar
        </Button>
        {safeStep < 9 ? (
          <Button variant="primary" onClick={forward}>
            Continuar
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void printPdf()} disabled={printing}>
              {printing ? "Gerando PDF…" : "Imprimir PDF"}
            </Button>
            <Button variant="primary" onClick={generate}>
              Gerar workflow n8n
            </Button>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid w-full min-w-0 max-w-6xl gap-6 px-4 py-6 sm:py-8">{children}</main>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-10 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-ink" />
      <rect x="5" y="13" width="8" height="6" rx="1.5" className="fill-paper" />
      <rect x="18" y="7" width="8" height="6" rx="1.5" className="fill-accent-soft" />
      <rect x="18" y="19" width="8" height="6" rx="1.5" className="fill-paper" />
      <path d="M13 16h5M22 13v6" className="stroke-paper" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
