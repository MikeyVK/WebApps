<!-- c:\1Voudig\99_Programming\FysiekFabriek-Triage\docs\development\issue1\planning.md -->
<!-- template=planning version=130ac5ea created=2026-07-09T17:02Z updated= -->
# Planning Monorepo Setup for WebApps

**Status:** APPROVED  
**Version:** 1.0  
**Last Updated:** 2026-07-09

---

## Purpose

Provide a detailed breakdown of implementation cycles, deliverables, and validation criteria for migrating the WebApps project to the npm workspaces monorepo structure.

## Scope

**In Scope:**
Initial workspaces setup, moving and converting apps to apps/ directories, TSX migration of TriageStoplicht, portal creation, branding colors implementation, and clean-up of legacy files.

**Out of Scope:**
Generic/shared helper utilities (print wrappers, storage wrappers) and modifications to core business logic.

## Prerequisites

Read these first:
1. Research document docs/development/issue1/research.md is approved.
2. Understanding of npm workspaces, Vite, Tailwind CSS v4, and TypeScript configs.
---

## Summary

Plan to split the single Vite app into an npm workspaces monorepo structure with apps/portal, apps/fysiek_fabriek_portal, apps/project_intake_scan, and apps/maatwerk_risico_scan. It includes TSX conversion of the triage stoplicht tool, independent Vercel deployment setups, separate localStorage keys, and visual branding adjustments without brand name text mentions.

---

## Dependencies

- Vercel monorepo configuration for independent workspace projects.

---

## TDD Cycles


### Cycle 1: Cycle 1: Monorepo Foundation & Tooling Setup

**Goal:** Setup npm workspaces, root configurations, and target directory structure under apps/ while keeping the legacy app active.

**Tests:**

**Success Criteria:**
- Root package.json configured with workspaces: ["apps/*"].
- Base tsconfig.json and eslint.config.js created and configured.
- Directories apps/portal, apps/fysiek_fabriek_portal, apps/project_intake_scan, apps/maatwerk_risico_scan initialized.



### Cycle 2: Cycle 2: Migrate Fokus Checklist to apps/project_intake_scan

**Goal:** Move Fokus Checklist component into its own standalone Vite workspace with TypeScript, updating its localStorage key and links.

**Tests:**

**Success Criteria:**
- project_intake_scan workspace configured with package.json, tsconfig.json, vite.config.ts, and index.html.
- Component FysiekFabriekFlowchart.tsx moved to apps/project_intake_scan/src/pages/ProjectIntakeScan.tsx.
- LocalStorage key 'fysiek_fabriek_projects_v2' replaced with 'project_intake_scan_history'.
- Compilation (tsc --noEmit) and build for project_intake_scan workspace succeed.

**Dependencies:** Cycle 1: Monorepo Foundation & Tooling Setup


### Cycle 3: Cycle 3: Migrate Triage Stoplicht to apps/maatwerk_risico_scan (TSX Conversion)

**Goal:** Move Triage Stoplicht component into its own Vite workspace and convert it from JS to TSX.

**Tests:**

**Success Criteria:**
- maatwerk_risico_scan workspace configured with package.json, tsconfig.json, vite.config.ts, and index.html.
- TriageStoplicht.jsx migrated and fully annotated to MaatwerkRisicoScan.tsx in apps/maatwerk_risico_scan/src/pages/MaatwerkRisicoScan.tsx.
- LocalStorage key replaced with 'maatwerk_risico_scan_history'.
- Compilation (tsc --noEmit) and build for maatwerk_risico_scan workspace succeed.

**Dependencies:** Cycle 1: Monorepo Foundation & Tooling Setup


### Cycle 4: Cycle 4: Create Nested Portal apps/fysiek_fabriek_portal

**Goal:** Create the nested portal app to bundle and route the two FysiekFabriek tools.

**Tests:**

**Success Criteria:**
- fysiek_fabriek_portal workspace configured as a React-Vite app.
- FysiekFabriekPortal.tsx implemented, linking to project_intake_scan and maatwerk_risico_scan via relative paths or <a> links.
- Compilation and build for fysiek_fabriek_portal workspace succeed.

**Dependencies:** Cycle 2: Migrate Fokus Checklist to apps/project_intake_scan, Cycle 3: Migrate Triage Stoplicht to apps/maatwerk_risico_scan (TSX Conversion)


### Cycle 5: Cycle 5: Create Main Portal apps/portal (Navy/Peach Styling)

**Goal:** Create the primary landing portal with Navy/Peach branding and zero 1Voudig mentions.

**Tests:**

**Success Criteria:**
- portal workspace configured as a React-Vite app.
- MainPortal.tsx implemented using Navy Blue (#0f294a) and Peach/Orange (#f19d76) branding without naming 1Voudig.
- Zero mentions of the word '1Voudig' in code or text copy.
- Compilation and build for portal workspace succeed.

**Dependencies:** Cycle 4: Create Nested Portal apps/fysiek_fabriek_portal


### Cycle 6: Cycle 6: Clean-up and Legacy Code Removal

**Goal:** Remove legacy src/, index.html, and vite.config.js from the root directory.

**Tests:**

**Success Criteria:**
- Legacy root src/ folder, index.html, and vite.config.js deleted.
- Global tsc, build, and lint commands at root run successfully across all workspaces.

**Dependencies:** Cycle 2: Migrate Fokus Checklist to apps/project_intake_scan, Cycle 3: Migrate Triage Stoplicht to apps/maatwerk_risico_scan (TSX Conversion), Cycle 4: Create Nested Portal apps/fysiek_fabriek_portal, Cycle 5: Create Main Portal apps/portal (Navy/Peach Styling)

---

## Quality Gates & Verification

The quality gates for this project have been migrated from Python/Ruff/Mypy to Node.js/ESLint/TypeScript:
- **Gate 0: ESLint**: Runs `npx eslint --format=compact` across the workspace to check JavaScript and TypeScript code style.
- **Gate 1: TypeScript**: Runs `npx tsc --noEmit` from the root directory to perform global type checking.

These gates will be executed via `run_quality_gates(files=[...])` before phase transitions and PR creation.

---

## Risks & Mitigation
- **Risk:** Tailwind CSS v4 compile failure across workspaces.
  - **Mitigation:** Configure Tailwind inside each workspace's local index.css via standard Vite plugin setup.
- **Risk:** React double bundling / Hook runtime errors.
  - **Mitigation:** Use peerDependencies for react and react-dom in sub-apps, allowing root package-lock resolution.

---

## Milestones

- Cycle 1 Complete: Workspaces and base configurations set up.
- Cycle 3 Complete: Triage tool migrated and converted to TypeScript.
- Cycle 5 Complete: All portals and apps configured and functional locally.
- Cycle 6 Complete: Legacy code removed, monorepo fully operational.

## Related Documentation
None
---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-09 | Agent | Initial draft |