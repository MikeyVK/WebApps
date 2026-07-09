<!-- docs\development\issue3\research.md -->
<!-- template=research version=8b7bb3ab created=2026-07-09T19:12Z updated= -->
# Research Neo-Brutalisme Styling Alignment & Single Source of Truth Metadata

**Status:** PRELIMINARY  
**Version:** 1.0  
**Last Updated:** 2026-07-09  
**Validation Outcome:** PENDING  
**Issue:** #3  

---

## Purpose

Investigate styling centralization and DRY optimization for the WebApps monorepo.

---

## Scope

**In Scope:**
Centralized theme architecture, Neo-brutalisme restyling of maatwerk_risico_scan and fysiek_fabriek_portal, single source of truth metadata, print and storage DRY candidates analysis.

**Out of Scope:**
Database integrations, backend migrations, or modification of clinical/medical logic inside the triage models.

---

## Prerequisites

Read these first:
1. Read ARCHITECTURE_PRINCIPLES.md
2. Read DOCUMENTATION_STANDARD.md
3. Understanding of Tailwind CSS v4 custom theme definitions
---

## Problem Statement

The Maatwerk Risico Scan and FysiekFabriek Portal use dark themes that conflict with the Project Intake Scan's warm Neo-brutalisme design. App metadata is hardcoded, violating DRY/SSOT, and card ordering is incorrect.

---

## Research Goals

- Define a centralized styling architecture using CSS custom properties to allow easy theme switching.
- Scan the codebase for DRY candidates (PDF printing, localStorage) to prevent code duplication as apps scale.
- Establish a Single Source of Truth configuration for app names (apps-metadata.json) accessible by all workspaces.

---

## Background

Currently, the sub-apps and portals inside the monorepo suffer from design fragmentation. The `project_intake_scan` uses a warm light-mode Neo-brutalisme design, while `maatwerk_risico_scan` and `fysiek_fabriek_portal` use a dark-mode theme. Furthermore, display names, descriptions, and metadata are hardcoded in multiple layouts, creating a Single Source of Truth (SsoT) violation.

---

## Findings

### 1. Centralized Theme System Architecture
To avoid hardcoding style values directly in components, we can define a central CSS custom properties stylesheet in a shared path `shared/styles/themes.css`. This maps theme-specific variables (e.g. background color, text color, border width, and flat shadow offsets) to classes like `.theme-brutalist` and `.theme-dark`.
In each sub-app, we import `shared/styles/themes.css` and map these properties inside the Tailwind CSS v4 `@theme` directive, utilizing tokens like `bg-bg-app`, `border-app-width`, and `shadow-app`. This allows changing the theme of an entire app instantly by changing a single class on the root element.

### 2. Single Source of Truth (apps-metadata.json)
We can centralize all application metadata (names, display names, subtitles, URLs, descriptions, and default active themes) in a root `/apps-metadata.json` file.
*   **Vite Integration**: To allow sub-apps to import the root JSON file directly (`import metadata from '../../../apps-metadata.json'`), we configure `server.fs.allow: ['..']` in all workspace `vite.config.ts` configurations. This preserves clean code and prevents directory traversal blocks.

### 3. DRY Candidates Scan

#### A. PDF Printing & Clipboard Reports
*   **Current State**: `project_intake_scan` uses standard `window.print()` coupled with print CSS media queries (`@media print`, `print:hidden`, etc.). `maatwerk_risico_scan` does not support printing, only markdown clipboard copying.
*   **DRY Candidate**: Extract print-only CSS class definitions (e.g., hiding headers/footers, forcing light backgrounds, eliminating shadow offsets on paper) into `shared/styles/themes.css` so all applications share print utility classes.
*   **Feature Alignment**: Implement a "Print Rapport" button in the Maatwerk Risico Scan that uses the shared print utilities for a clean PDF outcome.

#### B. Storage Helpers
*   **Current State**: Only `project_intake_scan` uses `localStorage` (via custom state initializer logic).
*   **DRY Candidate**: Create a shared `useLocalStorage` React hook under `shared/hooks/` or catalog it as a candidate for when a shared hooks library is introduced.

#### C. Brand Header Layout
*   **Current State**: Both scans independently duplicate the welcome header, home/back button, and logo layout.
*   **DRY Candidate**: Catalog the app header as a candidate for a shared `AppHeader` component library.

---

## Approved Strategy

1.  **Centralized Theme Definitions**: Create [themes.css](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/shared/styles/themes.css) under a new `shared/styles/` directory. Define `.theme-brutalist` and `.theme-dark` styles.
2.  **Tailwind CSS v4 Integration**: Configure `@theme` variables mapping in each app's `index.css` to read from the custom properties.
3.  **SsoT Metadata**: Create [apps-metadata.json](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps-metadata.json) at the root. Configure Vite `server.fs.allow: ['..']` in all workspaces.
4.  **Visual Realignment**: Redesign `maatwerk_risico_scan` and `fysiek_fabriek_portal` to default to `theme-brutalist` (warm light-mode Neo-brutalisme: off-white cream background, thick slate borders, hard flat shadows, orange/indigo accents).
5.  **App Card Ordering**: Change card ordering in `fysiek_fabriek_portal` to show the Project Intake Scan before the Maatwerk Risico Scan.
6.  **Print Styling**: Move print CSS selectors into `themes.css` and add printing support to `maatwerk_risico_scan`.
7.  **Structural Alignment (Flow realignment)**: Redesign the `maatwerk_risico_scan` flow to match the `project_intake_scan` structure: a starting dashboard showing local storage history (using `maatwerk_risico_scan_history` key), project setup page, single-focused wizard question cards, and print-ready report outcomes (with FMEA matrix for orange status).
8.  **Terminology Alignment**: Standardize terminology across the codebase to use "Scan". Replace user-facing mentions of "triage" (in Maatwerk Scan) and "checklist" (in Project Intake Scan) with "Scan" in all copy, headings, and reports.

---

## Expected Results

1.  Centrally configurable app metadata and themes.
2.  Consistent Neo-brutalisme design language across all FysiekFabriek applications and sub-portals.
3.  Harmonized single-focused scan wizard flows and localStorage history tables for both apps.
4.  Aligned "Scan" terminology used consistently across headers, layouts, and copy.
5.  Successful build, lint, and type-check validations across all workspaces.
---

## Related Documentation
- **[Tailwind CSS v4 Themes: https://tailwindcss.com/docs/theme][related-1]**
- **[Vite Server fs Options: https://vite.dev/config/server-options.html#server-fs-allow][related-2]**

<!-- Link definitions -->
[related-1]: https://tailwindcss.com/docs/theme
[related-2]: https://vite.dev/config/server-options.html#server-fs-allow

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-09 | Agent | Initial draft with CSS themes & SsoT metadata research |
