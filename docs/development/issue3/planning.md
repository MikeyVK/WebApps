<!-- docs\development\issue3\planning.md -->
<!-- template=planning version=130ac5ea created=2026-07-09T19:48Z updated=2026-07-09T19:50Z -->
# Implementation Plan for Centralized Styling & Metadata SsoT

**Status:** APPROVED  
**Version:** 1.1  
**Last Updated:** 2026-07-09  
**Validation Outcome:** PASS  
**Issue:** #3  

---

## Prerequisites

Read these first:
1.  [AGENTS.md](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/AGENTS.md) for the **UI/Frontend Styling Exemption for TDD**.
2.  [design.md](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/docs/development/issue3/design.md) for architectural and layout design rules.
---

## Summary

This plan details the four sequential cycles to migrate WebApps styling and metadata configurations to a centralized, DRY structure, realign the Maatwerk Scan flow, and standardize terminology to 'Scan'.

---

## TDD / Verification Cycles

### Cycle 1: Centralized Styles & Metadata Config

**Goal:** Establish shared/styles/themes.css and apps-metadata.json in root, configure Vite file servers and tsconfig aliases.

*   **Production Deliverables**:
    *   [apps-metadata.json](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps-metadata.json) [NEW] (standardized terminology configs).
    *   [shared/types/metadata.ts](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/shared/types/metadata.ts) [NEW] (TypeScript typing).
    *   [shared/styles/themes.css](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/shared/styles/themes.css) [NEW] (shared theme custom properties and print rules).
    *   Update [apps/project_intake_scan/vite.config.ts](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/project_intake_scan/vite.config.ts) (server fs allow, path mapping).
    *   Update [apps/maatwerk_risico_scan/vite.config.ts](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/maatwerk_risico_scan/vite.config.ts) (server fs allow, path mapping).
    *   Update [apps/fysiek_fabriek_portal/vite.config.ts](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/fysiek_fabriek_portal/vite.config.ts) (server fs allow, path mapping).
    *   Update [apps/portal/vite.config.ts](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/portal/vite.config.ts) (server fs allow, path mapping).

*   **Verification / Test Deliverables**:
    *   Run `npx tsc --noEmit` on all modified workspaces to verify TypeScript typing compiles.
    *   Run `npm run lint` on all workspaces to verify lint-check compliance.

*   **Success Criteria**:
    *   All workspaces compile successfully.
    *   `apps-metadata.json` and `themes.css` exist in their respective root paths.

---

### Cycle 2: Refactor Project Intake Scan

**Goal:** Update Project Intake Scan to consume root themes.css and apps-metadata.json, replacing hardcoded styles and standardizing naming to Scan.

*   **Production Deliverables**:
    *   Update [apps/project_intake_scan/src/index.css](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/project_intake_scan/src/index.css) to import central themes.
    *   Update [apps/project_intake_scan/src/pages/ProjectIntakeScan.tsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/project_intake_scan/src/pages/ProjectIntakeScan.tsx) to consume metadata properties, replace hardcoded colors and shadows with Tailwind theme properties, and standardize copy to "Scan" (replacing "checklist").

*   **Verification / Test Deliverables**:
    *   Compile the workspace using `npx tsc --noEmit`.
    *   Visually inspect the layout in the browser: confirm Brutalist shadows, borders, warm background, and terminology changes render correctly.

*   **Success Criteria**:
    *   Intake Scan displays in Brutalist style reading theme properties.
    *   Checklist terminology replaced by Scan in all copy.

*   **Dependencies**: Cycle 1: Centralized Styles & Metadata Config

---

### Cycle 3: Refactor Maatwerk Risico Scan

**Goal:** Rewrite Maatwerk Risico Scan into a step-by-step wizard flow, persist local history under key maatwerk_risico_scan_history, add FMEA-lite matrix for Orange status, and implement print layout.

*   **Production Deliverables**:
    *   Update [apps/maatwerk_risico_scan/src/index.css](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/maatwerk_risico_scan/src/index.css) to import themes.
    *   Refactor [apps/maatwerk_risico_scan/src/pages/MaatwerkRisicoScan.tsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/maatwerk_risico_scan/src/pages/MaatwerkRisicoScan.tsx) to use the 4 views (Dashboard with local storage history table, Setup, Wizard deck, printable Result card).
    *   Implement "Print Rapport" button utilizing the central print CSS classes.
    *   Implement FMEA-lite matrix interface and table render for Orange status.
    *   Standardize triage terminology to Scan in all copy.

*   **Verification / Test Deliverables**:
    *   Compile the workspace using `npx tsc --noEmit`.
    *   Run `npm run lint` inside the workspace.
    *   Visually verify wizard view transitions, print layout preview, and FMEA matrix additions in the browser.
    *   Verify `localStorage` key `maatwerk_risico_scan_history` accumulates history items correctly.

*   **Success Criteria**:
    *   Triage stoplicht layout rewritten to 4 sequential views with printable reports and local history storage.

*   **Dependencies**: Cycle 1: Centralized Styles & Metadata Config

---

### Cycle 4: Portal Realignment & Integration

**Goal:** Realign FysiekFabriek Portal and main portal to load cards dynamically from apps-metadata.json, sort Intake before Risico Scan, and redesign FF portal in Brutalist style.

*   **Production Deliverables**:
    *   Update [apps/fysiek_fabriek_portal/src/index.css](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/fysiek_fabriek_portal/src/index.css) to import themes.
    *   Refactor [apps/fysiek_fabriek_portal/src/App.tsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/fysiek_fabriek_portal/src/App.tsx) to render cards dynamically from `apps-metadata.json` sorted by `"order"`, and style in warm light-mode Neo-brutalisme.
    *   Refactor [apps/portal/src/App.tsx](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/portal/src/App.tsx) to read from `apps-metadata.json`.

*   **Verification / Test Deliverables**:
    *   Compile all portal workspaces.
    *   Visually verify card ordering (Intake Scan first) and visual theme matches design.

*   **Success Criteria**:
    *   Portals dynamically render cards, sorting Project Intake Scan first, in warm light-mode Neo-brutalisme.

*   **Dependencies**: Cycle 2: Refactor Project Intake Scan, Cycle 3: Refactor Maatwerk Risico Scan

---

## Risks & Mitigation

-   **Risk**: Vite restricts files outside workspace root.
    *   **Mitigation**: Add `server.fs.allow: ['..']` to all `vite.config.ts` configurations.
-   **Risk**: TypeScript compilation breaks on monorepo path imports.
    *   **Mitigation**: Setup relative pathing or explicit path mapping configurations in `tsconfig.json`.

---

## Related Documentation
None

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-09 | Agent | Initial draft |
| 1.1 | 2026-07-09 | Agent | Realignment to visual verification / compiler-driven strategy |
