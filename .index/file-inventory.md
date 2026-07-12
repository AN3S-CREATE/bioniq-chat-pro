# File Inventory

This inventory tracks files in the repository.

| Path | Purpose | Status | Key Symbols / Notes |
|---|---|---|---|
| `README.md` | Root documentation (setup & execution guides) | Active | Standalone Bioniq system info |
| `AUDIT_REPORT.md` | Legacy application technical audit report | Active | Score: 56/100 |
| `REPO_ANALYSIS_MEMORY.md` | Audit phase state memory | Active | Completed audit state |
| `legacy/` | Legacy Taskade Parade assets | Legacy | apps/, projects/, agents/ |
| `prisma/schema.prisma` | Relational database models | Active | Prisma 7 schema |
| `prisma/seed.ts` | JSON database migrator & seeder | Active | Seed default and migrated data |
| `src/lib/db.ts` | Prisma Client connection manager | Active | Singleton with SQLite adapter |
| `src/app/page.tsx` | Main portal entry hub | Active | Select Customer or Agent view |
| `src/app/globals.css` | Global styling & WhatsApp theme | Active | Tailwind v4 custom styles |
| `src/app/chat/page.tsx` | Customer WhatsApp mock chat client | Active | Connects via phone, streams AI |
| `src/app/admin/page.tsx` | Support agent admin portal dashboard | Active | Threads console & CRUD tables |
| `src/app/api/conversations/route.ts` | Conversation initialization API | Active | Customer lookup and session retrieve |
| `src/app/api/chat/route.ts` | AI chat streaming endpoint | Active | Vercel AI SDK tools & fallback |
| `src/app/api/threads/route.ts` | Conversation threads listing API | Active | Admin dashboard fetch |
| `src/app/api/threads/[id]/messages/route.ts` | Thread messages & agent takeover API | Active | GET history, POST manual replies |
| `src/app/api/admin/route.ts` | Admin CRUD controller API | Active | Handles customers, tickets, orders, etc. |
| `Dockerfile` | Multi-stage Docker builder | Active | Standard Next.js deployment |
| `docker-compose.yml` | Self-hosting compose configuration | Active | Mapped persistent SQLite volume |
| `docker-entrypoint.sh` | Container entry point script | Active | Migrates, seeds, starts app |
| `.env.example` | Template for environment variables | Active | Placeholders |
| `.index/README.md` | Index README | Active | Setup guidelines |
| `.index/file-inventory.md` | This file | Active | Track files |
| `.index/architecture.md` | High-level system overview and component layout | Active | Architectural structure |
| `.index/key-decisions.md` | Architectural decisions log (ADR) | Active | Decision logs |
| `.index/dead-code.md` | Dead/unused code log | Active | Technical debt tracking |
| `.index/context-refresh-log.md` | Log of context refreshes | Active | Tracking context index updates |
