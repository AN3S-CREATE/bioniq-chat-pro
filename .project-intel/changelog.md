# Changelog

All notable analyses and changes to the Bioniq Chat Pro workspace will be documented in this file.

## [1.1.3-Intel] - 2026-07-09

### Fixed
- **Missing Build Pipeline (ACT-001)**: Created `apps/default/scripts/build.mjs` and configured `apps/default/tailwind.config.js` to compile CSS and JS bundles using ESBuild and Tailwind. Verified build runs successfully.
- **Agent Prompts Alignment (ACT-002)**: Replaced outdated "solar panel installation" descriptions, introductions, and conversation starters inside `agents/01K8BSAKNHPDZHBSZ3RV4DK9E9.json` with accurate Bioniq ISP parameters (uncapped speeds, fiber packages, router upgrades, support tickets).
- **PostMessage Security Check (ACT-003)**: Hardened the PostMessage handler in `apps/default/src/lib/theme-bridge.ts` to validate parent origins against trusted domains (`https://*.taskade.com`) and local development ports.
- **Private Dependency Bypass**: Removed type dependencies on private package `@taskade/parade-shared` from `package.json` and declared inline stubs in `genesis.tsx` to enable local compilation of the React code from the public npm registry.

## [1.1.2-Intel] - 2026-07-09

### Added
- Created ProjectIntel state tracking (`.project-intel/project-state.json`).
- Generated Phase 3 Comprehensive Project Report (`.project-intel/report.md`).
- Generated Phase 5 Improvement & Modernization Plan (`.project-intel/improvement_modernization_plan.md`).
- Generated Phase 6 Action Plan (`.project-intel/action_plan.md`).
- Generated full developer and architectural documentation under `.project-intel/docs/`:
  - `readme_enhancement.md`
  - `architecture.md`
  - `installation_configuration.md`
  - `data_models.md`
  - `component_catalog.md`
  - `development_standards.md`

### Identified
- **Critical Missing Files**: Identified that `scripts/build.mjs` referenced in `package.json` is missing from the workspace.
- **Agent Specification Mismatch**: Found that `agents/01K8BSAKNHPDZHBSZ3RV4DK9E9.json` defines a "solar panel installation business" agent, whereas the databases, inventory, and UI copy are built for an ISP named "Bioniq".
- **Dead Code / Unused Views**: Identified that `App.tsx` directly mounts `FullScreenWhatsApp` and bypasses `OldLandingPage.tsx` and all other module components (like `SecurityModule`, `AdminPanel`, `AccessibilityTester`, etc.), leaving them as dead code in the repository.
- **Security Vulnerability**: Highlighted hardcoded password `admin123` in the dead code component `AdminPanel.tsx`.
