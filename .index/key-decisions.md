# Key Architectural Decisions

## DECISION-001: Standalone Architecture Design

- **Status**: Proposed
- **Decision**: Rebuild the Taskade Parade micro-app as a standalone Next.js 15 App Router application with separate client/admin views and database.
- **Rationale**: Replaces iframe and platform API dependencies with self-contained, customizable, production-grade codebase.
- **Implications**: Requires migrating unstructured Taskade JSON data structures to a relational schema.
