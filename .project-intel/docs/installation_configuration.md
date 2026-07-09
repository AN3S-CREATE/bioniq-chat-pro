# Installation & Configuration Procedures

This document provides setup instructions and deployment configuration for Bioniq Chat Pro.

## Setup Requirements

*   **Node.js**: Version 18 or newer recommended.
*   **Package Manager**: `npm` (configured in the repository).

## Installation

1.  Navigate to the app template root folder:
    ```bash
    cd apps/default
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Development and Building (Work-in-Progress)

Currently, the default scripts inside [`package.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/apps/default/package.json#L15) are configured to run:
```bash
npm run build
# runs: node scripts/build.mjs
```

> [!WARNING]
> The `scripts` directory and `build.mjs` are missing. Local execution will fail. To build this project locally, a custom Vite configuration or an esbuild runner must be configured (refer to [ACT-001](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/.project-intel/action_plan.md) in the Action Plan).

## API Configuration

To target a different Taskade AI Agent, update the following variables inside [`FullScreenWhatsApp.tsx`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/apps/default/src/components/FullScreenWhatsApp.tsx#L4):
*   `AGENT_ID`: Set to the target Taskade AI Agent identifier.
*   `API_BASE`: Set to the Taskade proxy endpoint (defaults to `/api/taskade`).
