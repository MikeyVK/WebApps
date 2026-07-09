# FysiekFabriek Triage & Portal

Dit project is de centrale portal van **FysiekFabriek & Fokus** voor het beoordelen, triageren en registreren van maatwerk hulpmiddelen. Het stelt studenten, makers en uitdagers in staat om te bepalen of een projectveiligheidsrisico past binnen de informele co-creatie formule van FysiekFabriek, of dat het moet worden overgedragen aan een professioneel adaptatietechnicus.

---

## 🚀 Applicaties in de Portal

Het project is ingericht als een multi-page portaal met twee kernapplicaties:

1.  **Stoplicht Triage Tool** (`/triage`): 
    *   Evalueert projecten aan de hand van het stoplichtmodel (Rood, Oranje, Groen).
    *   Gebaseerd op de EU MDR 2017/745 verordeningen en risico-evaluatiemethodiek.
    *   Bevat een FMEA-lite (Failure Mode and Effects Analysis) matrix voor risico-inventarisatie van Oranje projecten.
    *   Genereert een kopieerbaar triage-rapport.
2.  **Fokus Intake Checklist** (`/flowchart`):
    *   Evalueert uitdagers en uitdagingen op basis van 11 criteria (o.a. fysieke beperking, meerderjarig, gewone dagelijkse activiteit).
    *   Houdt een dossiergeschiedenis lokaal bij met behulp van browser `localStorage`.
    *   Biedt de mogelijkheid om dossiers op te slaan als printbare PDF.

---

## 🛠️ Technologiestack & Structuur

*   **Framework**: [React](https://react.dev/) (v19) gebundeld met [Vite](https://vite.dev/) (v8)
*   **Routing**: [React Router](https://reactrouter.com/) (`react-router-dom` v7)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
*   **Icons**: [Lucide React](https://lucide.dev/) (`lucide-react`)

### Belangrijke Bestanden & Mappen
*   [App.jsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/src/App.jsx): De router die de applicaties aan elkaar koppelt.
*   [pages/HomePage.jsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/src/pages/HomePage.jsx): Het centrale startportaal.
*   [pages/TriageStoplicht.jsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/src/pages/TriageStoplicht.jsx): De Stoplicht Triage applicatie.
*   [pages/FysiekFabriekFlowchart.tsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/src/pages/FysiekFabriekFlowchart.tsx): De Fokus Intake Checklist applicatie (TypeScript/TSX).
*   [index.css](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/src/index.css): Globale CSS-stijlen en Tailwind v4 configuratie.

---

## 💻 Lokale Ontwikkeling

### 1. Installeren van Dependencies
Zorg dat je Node.js geïnstalleerd hebt en voer uit in de project root:
```bash
npm install
```

### 2. Dev Server opstarten
Start de lokale Vite ontwikkelserver:
```bash
npm run dev
```
De applicatie is daarna live bereikbaar op [http://localhost:5173/](http://localhost:5173/).

---

## 🏛️ Phase-Gate Agent Protocol (`pgmcp`)

Dit project maakt actief gebruik van de **Phase-Gate MCP (Model Context Protocol) Server** om gestructureerde, veilige en gecontroleerde samenwerking tussen AI-agents en menselijke ontwikkelaars mogelijk te maken.

### Server Config & Omgeving
*   **Lokale virtuele omgeving**: De Python-omgeving bevindt zich in de map [`.venv/`](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/.venv).
*   **Server Root**: De configuratie, handleidingen en templates van de phase gate server zijn opgeslagen in [`.pgmcp/`](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/.pgmcp).

### Belangrijke Richtlijnen voor Agents
1.  **Git & GitHub Operations**: Gebruik altijd de specifieke MCP-tools (`git_*` / `create_issue` / `submit_pr` / etc.) in plaats van ruwe terminalcommando's via `run_in_terminal` of `run_command`.
2.  **Architectuur Contract**: Alle code-aanpassingen moeten voldoen aan de standaarden in `.pgmcp/docs/coding_standards/ARCHITECTURE_PRINCIPLES.md`.
3.  **TDD (Test-Driven Development)**: Ontwikkeling volgt strikt de RED → GREEN → REFACTOR cyclus.
4.  **Three-Agent Model**:
    *   `@co`: Coördinatie autoriteit en epic workflow eigenaar.
    *   `@imp`: Child-issue implementatie executor (productiecode & tests).
    *   `@qa`: QA autoriteit (read-only, tests en kwaliteitsgates runnen).
