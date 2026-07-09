<!-- c:\1Voudig\99_Programming\FysiekFabriek-Triage\docs\development\issue1\research.md -->
<!-- template=research version=8b7bb3ab created=2026-07-09T16:56Z updated= -->
# Research Monorepo Structure for WebApps

**Status:** APPROVED  
**Version:** 1.0  
**Last Updated:** 2026-07-09

---

## Purpose

Investigate and document the architectural layout, branding colors, TypeScript requirements, and deployment strategy for the monorepo refactoring of WebApps.

## Scope

**In Scope:**
npm workspaces setup, folder reorganization into apps/ portal, apps/ fysiek_fabriek_portal, apps/ project_intake_scan, apps/ maatwerk_risico_scan, converting TriageStoplicht.jsx to TSX, and Tailwind CSS v4 monorepo scan setup.

**Out of Scope:**
Shared code/helpers (like print wrappers or storage helpers) and business logic changes to the scans.

## Prerequisites

Read these first:
1. Understanding of npm workspaces configuration.
2. Knowledge of Vite and React compilation.
3. Familiarity with Vercel monorepo deployment config.
---

## Problem Statement

Managing multiple applications under a single Vite configuration causes configuration conflicts, dependency bloat, and blocks independent Vercel deployments. We need to split them into separate apps inside a monorepo while keeping them clean, uniform, and deployable.

## Research Goals

- Establish monorepo directory layout for WebApps repository without 1Voudig mentions.
- Define independent Vercel deployment and local workspace compilation strategy.
- Migrate TriageStoplicht.jsx to TypeScript to ensure uniform typing.
- Enforce standalone behavior with separate localStorage and no shared helpers.

---

## Background

Currently, the repository is a single Vite + React project with pages for the portal, flowchart (FysiekFabriekFlowchart.tsx in TSX), and triage stoplicht (TriageStoplicht.jsx in JSX). This causes mixed dependencies and makes individual Vercel deployments difficult.

---

## Findings

1. Individual Apps: Splitting applications into separate directories under apps/ enables Vercel to build and deploy each target independently using individual Root Directories.
2. Portals: apps/portal provides the main entry portal (navy/peach branding, no 1Voudig text). apps/fysiek_fabriek_portal provides a nested portal specific to the FysiekFabriek triage and flowchart scans.
3. TypeScript: Uniformity is achieved by converting TriageStoplicht.jsx to TSX.
4. Storage: Separate localStorage keys (project_intake_scan_history and maatwerk_risico_scan_history) prevent shared storage coupling.
5. Resource Sharing: The scans remain fully standalone; no shared print or storage helpers will be built in this refactor.

---

## Approved Strategy

1. Directory Layout: Reorganize into apps/portal, apps/fysiek_fabriek_portal, apps/project_intake_scan, apps/maatwerk_risico_scan.
2. Naming & Package Config: No scope or 1Voudig naming in folder/workspace names. Workspaces: project_intake_scan, maatwerk_risico_scan, fysiek_fabriek_portal, portal.
3. Deployments: Individual Vercel project configurations mapping to each workspace directory in apps/* with custom ignore build step conditions.
4. Language Standard: TypeScript across all applications; TriageStoplicht.jsx migrated to TSX.
5. Resources & Storage: Separate localStorage keys per application; no shared print wrappers or storage helpers.
6. Visual Styling: Apply navy blue (#0f294a) and peach/orange (#f19d76) colors to apps/portal and app headers without text mentions of 1Voudig.

---

## Expected Results

1. A functional npm workspaces monorepo.
2. All 4 apps build and run locally under Vite.
3. TypeScript compilations pass.
4. Independent Vercel deployments succeed.
5. Huisstijl styling is applied to apps/portal.
6. Zero 1Voudig mentions exist in code.

## Related Documentation
- **[NPM Workspaces: https://docs.npmjs.com/cli/v7/using-npm/workspaces][related-1]**
- **[Vite config: https://vite.dev/config/][related-2]**
- **[Vercel Monorepo deployment: https://vercel.com/docs/concepts/monorepos][related-3]**

<!-- Link definitions -->

[related-1]: NPM Workspaces: https://docs.npmjs.com/cli/v7/using-npm/workspaces
[related-2]: Vite config: https://vite.dev/config/
[related-3]: Vercel Monorepo deployment: https://vercel.com/docs/concepts/monorepos

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-09 | Agent | Initial draft |