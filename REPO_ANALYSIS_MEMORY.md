# Repository Analysis State — Bioniq Standalone Support Portal

## Current Analysis Phase & Progress
✅ STANDALONE MIGRATION COMPLETE. All features from legacy Taskade application re-implemented as a fully independent Next.js 15 + Prisma 7 web application.

## Key Architectural Insights Discovered
- **Prisma 7 Breaking Changes**: Connection URLs in schema files are deprecated. Instantiation of `PrismaClient` requires a driver adapter (`@prisma/adapter-better-sqlite3` for local development). Parent directories for SQLite databases must be explicitly created.
- **Vercel AI SDK 5/6 Breaking Changes**: Renamed `parameters` to `inputSchema` inside the `tool()` helper. StreamText result uses `toTextStreamResponse()` or `toUIMessageStreamResponse()` for response streaming.
- **Database Seeding**: Legacy JSON files representing "projects as data" have been successfully mapped to relational SQL tables (`Customer`, `Product`, `Order`, `SupportTicket`, `InstallationAppointment`, `ChatThread`, `ChatMessage`) and seeded.
- **Graceful Fallback**: The AI chat endpoint automatically detects if the `OPENAI_API_KEY` is missing and gracefully degrades to a simulated rule-based stream that mimics tool calling and database writes.

## Files Deeply Reviewed
- `src/lib/db.ts`: Connection singleton managing SQLite adapters.
- `src/app/chat/page.tsx`: WhatsApp Web simulated customer chat interface.
- `src/app/admin/page.tsx`: Agent panel dashboard showing core database tables and live active thread takeover.
- `src/app/api/chat/route.ts`: Vercel AI SDK tool orchestration and stream responses.
- `src/app/api/conversations/route.ts`: Session and customer profile lookup mapping.
- `src/app/api/admin/route.ts`: CRUD controller for admin operations.
- `prisma/schema.prisma`: Target relational database schema.
- `prisma/seed.ts`: Legacy data parser and seeder.
- `Dockerfile` & `docker-compose.yml`: Production containerization and deployment.

## Open Questions & Areas Needing Investigation
- (None) All core requirements fulfilled.

## Decisions Made & Rationale
- **SQLite inside Docker Volume**: Chosen as the default database for Docker Compose to provide immediate, zero-dependency local setup without database configuration overhead, while maintaining options for PostgreSQL.
- **Onboarding Phone Gateway**: Added customer phone number validation in `/chat` to pull their historical thread and data from the database, eliminating Taskade's opaque session IDs.

## Next Immediate Steps
1. Spin up the application locally using `npm run dev` or run in Docker using `docker compose up --build -d`.
2. Connect using one of the seeded customer numbers (e.g. `+1 555 010 0123`) to test WhatsApp support chat.
3. Open the admin console at `/admin` to monitor and manage support operations.

## Patterns & Recurring Issues Noticed
- (None) Build succeeds cleanly.

## Session Log
- [2026-07-12] Session started. Created `.index/` files to establish Persistent Project Context. Moved legacy Taskade files to `legacy/`. Initialized Next.js 15 inside `bioniq-web` and moved to root. Configured database schema and Prisma 7. Resolved Prisma 7 SQLite adapter requirements. Wrote seed script to parse and migrate legacy JSON dumps. Configured backend route handlers for chat streaming, session check, and admin CRUD. Rebuilt WhatsApp-like chat client and Agent dashboard. Created Dockerfile and Docker Compose. Excluded `legacy/` from typescript compiler and fixed useMemo imports. Verified build successfully. Updated index.
