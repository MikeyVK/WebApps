# WebApps Monorepo - Triage & Portals

This repository is a monorepo containing the portals and triage applications for evaluating, triaging, and registering custom physical aid devices. It allows students, makers, and challengers to determine whether a project safety risk fits within the informal co-creation formula of FysiekFabriek, or needs to be referred to a professional adaptation technician.

---

## 🚀 Applications & Workspaces

The repository is structured as an npm workspaces monorepo under the `apps/` directory:

1.  **Central Portal** (`apps/portal`):
    *   The primary landing portal for WebApps.
    *   Styled with the Navy Blue (`#0f294a`) and Peach/Orange (`#f19d76`) corporate branding.
    *   Contains zero mentions of the word *1Voudig*.
    *   Provides links to individual scans and the sub-portal.
2.  **FysiekFabriek Portal** (`apps/fysiek_fabriek_portal`):
    *   A dedicated sub-portal specifically for FysiekFabriek tools.
3.  **Project Intake Scan** (`apps/project_intake_scan`):
    *   Fokus Checklist app checking against the 11 Fokus criteria.
    *   Fully type-safe TypeScript React app.
    *   Persists scan history locally in browser `localStorage` using key `project_intake_scan_history`.
4.  **Maatwerk Risico Scan** (`apps/maatwerk_risico_scan`):
    *   MDR Stoplicht triage tool (Red, Orange, Green classifications).
    *   Fully type-safe TypeScript React app.
    *   Includes a FMEA-lite risk assessment matrix for Orange projects.
    *   Pure rendering confetti animation for Green outcomes.

---

## 🛠️ Technology Stack

*   **Monorepo Tooling**: npm workspaces
*   **Framework**: [React](https://react.dev/) (v19) bundled with [Vite](https://vite.dev/) (v8)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
*   **Icons**: [Lucide React](https://lucide.dev/) (`lucide-react`)
*   **Linter**: [ESLint](https://eslint.org/) (v9)

---

## 💻 Local Development

### 1. Install Dependencies
Run from the root directory to install dependencies and link workspaces:
```bash
npm install
```

### 2. Running Workspace Applications
You can start any application individually from the root directory:

*   **Start Central Portal**:
    ```bash
    npm run dev -w portal
    ```
*   **Start FysiekFabriek Portal**:
    ```bash
    npm run dev -w fysiek_fabriek_portal
    ```
*   **Start Project Intake Scan**:
    ```bash
    npm run dev -w project_intake_scan
    ```
*   **Start Maatwerk Risico Scan**:
    ```bash
    npm run dev -w maatwerk_risico_scan
    ```

### 3. Global Linting and Type Checking
Run from the root directory:

*   **Lint all code**:
    ```bash
    npm run lint
    ```
*   **Type check all workspaces**:
    ```bash
    npx tsc --noEmit
    ```

---

## 🏛️ Phase-Gate Agent Protocol (`pgmcp`)

This project actively utilizes the **Phase-Gate MCP (Model Context Protocol) Server** to enforce quality control, testing (TDD), and structured branch phases.

### Directory Layout
*   `docs/development/issue1/`: planning, research, and validation documentation for issue #1.
*   `.pgmcp/`: server configuration, schemas, and templates.
*   `.venv/`: local Python virtual environment for running the MCP server.
