# ProjectIntel: Prioritized Action Plan
## Workspace: Bioniq Chat Pro

### Actionable Roadmap

| ID | Title | Category/Priority | Impact | Effort | Dependencies | Key Steps / Approach | Risks & Mitigations | Quick Win? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **ACT-001** | Restore build/dev scripts | **Critical (P0)** | High (H) | Small (S) | None | Create `apps/default/scripts/build.mjs` using `esbuild` or introduce a `vite` configuration to enable local builds. | Custom esbuild vs standard Vite configuration mismatch. Mitigation: Verify build matches Taskade preview expectations. | **Yes** |
| **ACT-002** | Align Agent Description Prompt | **High (P1)** | High (H) | Small (S) | None | Edit [`agents/01K8BSAKNHPDZHBSZ3RV4DK9E9.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/agents/01K8BSAKNHPDZHBSZ3RV4DK9E9.json) to replace "solar panel installation" text with "unrestricted uncapped internet service provider (ISP)" and fiber installation roles. | Low risk. Make sure JSON format remains valid. | **Yes** |
| **ACT-003** | PostMessage Origin Checks | **High (P1)** | Medium (M) | Small (S) | None | Update the window message event listener in `theme-bridge.ts` to validate origin matches known Taskade hosts. | Restricting origins could break preview if embedded on unknown subdomains. Mitigation: Allow wildcard configurations for local development hosts. | **Yes** |
| **ACT-004** | Clean Up Dead Code | **Recommended (P2)** | Medium (M) | Medium (M) | None | Delete bypassed components in `src/components/` and clean up imports in `OldLandingPage.tsx` to reduce bundle size and technical debt. | Risk of losing reference code. Mitigation: Save legacy code in a separate branch or archives directory. | No |
| **ACT-005** | Deconstruct FullScreenWhatsApp | **Recommended (P2)** | Medium (M) | Medium (M) | ACT-001 | Break the 510-line monolithic file into modular sub-components: `ChatHeader`, `MessageList`, `MessageBubble`, and `ChatComposer`. | Introducing rendering glitches or regression in scroll behaviors. Mitigation: Thoroughly test scroll-to-bottom functions and ref bindings. | No |

---

### Suggested Execution Timeline

#### Immediate (Next 30 Days)
*   **Restore Build Tooling (ACT-001)**: Enable local `npm run dev` and compilation to allow immediate team onboarding.
*   **Align AI Prompt (ACT-002)**: Correct the Agent prompt in JSON so it acts as an ISP support assistant instead of a solar panel installation assistant.
*   **PostMessage Security (ACT-003)**: Secure communication bridge in `theme-bridge.ts`.

#### Mid-Term (30-60 Days)
*   **Dead Code Cleanup (ACT-004)**: Purge bypassed views (e.g., `SecurityModule.tsx`, `CustomerServiceModule.tsx`) to streamline the repository.

#### Long-Term (60-90 Days)
*   **Component Modularization (ACT-005)**: Refactor `FullScreenWhatsApp.tsx` into clean, testable sub-components to ensure long-term maintainability.
