# MapearPro 🗺️⚡

> Plataforma full-stack para mapeamento, modelagem e documentação de processos corporativos, fluxogramas interativos e matrizes de governança (RACI), com exportação para PDF e automação com n8n.

---

## 📌 Visão Geral

O **MapearPro** é uma aplicação web moderna voltada a analistas de processos, equipes de operações, consultores e desenvolvedores de automações. A plataforma permite mapear etapas operacionais por meio de um assistente guiado (*wizard*), visualizar os fluxos em múltiplos motores de diagramas (Mermaid.js, Cytoscape, Dagre e ElkJS), definir responsabilidades (RACI) e exportar documentações executivas ou disparar fluxos no n8n.

---

## 🚀 Principais Funcionalidades

- **Assistente Guiado de Mapeamento (Wizard):** Criação e refinamento passo a passo de processos, atividades, decisões, entradas, saídas e tempos de ciclo.
- **Visualização Flexível de Diagramas:**
  - Renderização com Mermaid.js (Sequence, Flowchart, State, C4, etc.).
  - Layouts avançados de grafos e nós interativos via Cytoscape (CoSE, FCose), ElkJS e Dagre.
- **Matriz RACI e Governança:** Mapeamento de responsáveis (*Responsible*), aprovadores (*Accountable*), consultados (*Consulted*) e informados (*Informed*) por atividade.
- **Exportação de Relatórios em PDF:** Geração de relatórios com layout executivo contendo diagramas, resumo executivo, tabela RACI e detalhamento operacional.
- **Integração com n8n:** Estrutura e utilitários para interoperabilidade e exportação/gatilho de fluxos de automação.
- **Colaboração e P2P:** Módulo com suporte a multiplayer e sincronização via WebRTC / WebSocket.
- **Autenticação e Multi-tenant:** Suporte a múltiplos provedores de login, isolamento de sessão e persistência integrada (com suporte a PGlite/PostgreSQL local/Neon).

---

## 🛠️ Stack Tecnológica

- **Frontend & Roteamento:**
  - [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [TanStack Router](https://tanstack.com/router) & [TanStack Start](https://tanstack.com/start)
  - [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
  - [Sonner](https://sonner.emilkowal.ski/) (Toasts)
- **Visualização & Gráficos:**
  - [Mermaid.js](https://mermaid.js.org/) + Mermaid Parser
  - [Cytoscape.js](https://js.cytoscape.org/) (com extensões `fcose` e `cose-bilkent`)
  - [Dagre](https://github.com/dagrejs/dagre) e [ElkJS](https://github.com/kieler/elkjs)
  - [D3.js](https://d3js.org/) (Seleção, Escala, Formatação, Hierarquias)
  - [KaTeX](https://katex.org/) e [Marked](https://marked.js.org/) para parsing e documentação rica
- **Backend & Servidor:**
  - [Vite](https://vitejs.dev/) + Vinxi / Nitro (para SSR e rotas de API/servidor)
  - [@electric-sql/pglite](https://github.com/electric-sql/pglite) (PostgreSQL WASM em memória/local)
  - [Zod](https://zod.dev/) para validação de esquemas e tipos
- **Deploy:**
  - Vercel Serverless Functions / Nitro Engine

---

## 📂 Estrutura do Projeto

```plaintext
mapearpro/
├── src/
│   ├── components/
│   │   ├── process/            # Componentes do fluxo (Wizard, Canvas, Mermaid, Steps)
│   │   └── ui/                 # Componentes reutilizáveis (botões, inputs, controles)
│   ├── lib/
│   │   ├── app-data/           # Conectores e readiness de dados
│   │   ├── auth/               # Provedores de autenticação, sessões e gates de login
│   │   ├── multiplayer/        # Sincronização P2P e WebRTC
│   │   ├── process/            # Modelos de dados, gerador de diagramas, n8n e PDF
│   │   ├── db.ts               # Conexão de banco de dados
│   │   └── utils.ts            # Funções utilitárias (Tailwind merge, etc.)
│   ├── routes/                 # Páginas e rotas da aplicação (TanStack Router)
│   ├── router.tsx              # Configuração do cliente do roteador
│   └── styles.css              # Estilos globais e diretivas do Tailwind
├── scripts/                    # Scripts de build, migrations, testes de smoke e PWA
├── public/                     # Favicons, banners e manifestos
└── screenshots/                # Capturas de tela e prévias da interface
```

---

## 📦 Como Executar o Projeto

### Pré-requisitos

- **Node.js** >= 18.x
- **npm** ou **pnpm** instalado

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd mapearpro
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

### Executando em Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build e Produção

Para compilar a aplicação para produção (SSR e assets estáticos):

```bash
npm run build
```

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

---

## 🧪 Testes e Qualidade de Código

O repositório inclui verificações estáticas e testes de sanidade:

```bash
# Executar o linter
npm run lint

# Executar testes unitários e de integração
npm run test
```

---

## 📄 Licença

Este projeto é disponibilizado sob a licença definida no repositório. Consulte o arquivo de licença para mais detalhes.