# Bioniq Support System

Bioniq Support System is a fully standalone, independent customer care platform and admin dashboard. It replaces all dependencies, concepts, and branding of third-party platforms with a clean, modern web application built on Next.js 15, Prisma (SQLite), and the Vercel AI SDK.

## Features

1. **WhatsApp Mock Chat Portal (`/chat`)**:
   - Secure phone-based client onboarding.
   - Restores message history on page reload.
   - Streams AI assistant responses using Vercel AI SDK.
   - Direct database tool-calling (AI can fetch profile, stock, orders, create tickets, book appointments).
   - Self-healing mock stream fallback for graceful degradation when no OpenAI key is set.
2. **Agent Console Dashboard (`/admin`)**:
   - Live chat session list with manual takeover (sends messages directly into active chats).
   - CRUD database tables for Customers, Support Tickets, Appointments, Hardware Orders, and Product Inventory.
   - Comprehensive system stats cards.
3. **Optimized Build & Container**:
   - Self-hostable with `docker-compose.yml` using mounted SQLite volume.
   - Multi-stage optimized Docker builds.

## Directory Structure

```text
├── legacy/                   # Reference Taskade micro-app assets
├── prisma/
│   ├── schema.prisma         # Relational database schema
│   ├── seed.ts               # JSON database migrator & seeder
│   └── dev.db                # Auto-generated database file
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Standalone Entry Hub
│   │   ├── chat/             # WhatsApp Customer view
│   │   ├── admin/            # Support Dashboard view
│   │   └── api/              # API Route Handlers
│   └── lib/
│       └── db.ts             # Prisma Client singleton (Prisma 7 adapter)
├── Dockerfile                # Multi-stage Docker builder
└── docker-compose.yml        # Self-hosting setup
```

## Getting Started

### Local Development Setup

1. **Clone and Install Dependencies**:
   ```bash
   npm install
   ```
2. **Sync Database Schema**:
   ```bash
   npx prisma db push
   ```
3. **Seed Database with Legacy Taskade Dumps**:
   ```bash
   npx tsx prisma/seed.ts
   ```
4. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="your-openai-api-key"
   ```
5. **Launch Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

### Docker Deployment

To spin up the entire stack self-hosted:

1. Build and run containers:
   ```bash
   docker compose up --build -d
   ```
2. The application will start at [http://localhost:3000](http://localhost:3000), initializing the SQLite database at `/app/prisma_db/production.db` within a persistent volume.
