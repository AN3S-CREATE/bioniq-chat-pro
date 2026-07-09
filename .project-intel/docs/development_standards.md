# Development Standards & Contributor Guide

This guide establishes conventions for modifying the Bioniq Chat Pro codebase.

## Code Conventions

*   **TypeScript**: All source files must reside in `src/` and use strict typing. Avoid using `any` type definitions.
*   **Tailwind CSS**: Follow mobile-first utility styling. For complex layouts (such as the WhatsApp bubble tails and header), use custom utility configurations inline or within `@layer utilities`.
*   **Clean Up Handlers**: When writing hooks, event listeners, or network cycles (e.g. `AbortController` in chat fetch streams), always implement cleanups in `useEffect` to prevent browser resource leaks.

## State Management

*   State is managed locally using React state hooks or globally via `zustand` if multiple views are introduced.
*   Avoid adding redundant global state. Keep API streaming and bubble scroll locks encapsulated in the respective UI components.

## Submitting Changes

1.  Before writing changes, verify the workspace target paths.
2.  If adding packages, install them inside [`apps/default/package.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/apps/default/package.json) using exact version definitions.
3.  On modifying or adding UI features, update the walkthrough records.
