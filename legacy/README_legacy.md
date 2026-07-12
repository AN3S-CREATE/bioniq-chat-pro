# Bioniq Chat Pro

Bioniq Chat Pro is an AI-powered customer care chat interface built for fiber internet support. It is designed to be embedded as an iframe within the Taskade editor as a **Taskade Parade micro-app**, providing a WhatsApp-like messaging experience.

## Architecture

The application is built using a modern frontend stack:
- **React 18**
- **Tailwind CSS 3**
- **esbuild** (Custom build script)

### Integration & Data Flow
```text
+-------------------+       +-----------------------+       +-------------------+
|                   |       |                       |       |                   |
|  Taskade Editor   | <---> |  ThemeBridge (postMs) | <---> |  Bioniq Chat Pro  |
|  (Host iframe)    |       |                       |       |  (React 18 App)   |
+-------------------+       +-----------------------+       +---------+---------+
                                                                      |
                                                                      v
                                                            +-------------------+
                                                            | /api/taskade      |
                                                            | (Host-side proxy) |
                                                            +-------------------+
```

- **Single Entry Point**: The app bypasses traditional routing and mounts a full-screen WhatsApp interface (`FullScreenWhatsApp.tsx`) directly.
- **Theme Bridge**: Theme synchronization between the Taskade Editor and the micro-app is handled securely via `postMessage` (see `src/lib/theme-bridge.ts`).
- **Streaming**: AI responses are streamed via Server-Sent Events (SSE) using `fetch` and `ReadableStream`.
- **Session Persistence**: Conversations are preserved across page reloads using `sessionStorage` (keyed by `bioniq_convo_id`), which clears when the tab is closed.

## Proxy Configuration (Critical for Deployment & Development)

All API calls to Taskade are routed through a host-side proxy at `/api/taskade`. 

**Why is this needed?**
To avoid CORS issues and securely manage API keys, the frontend does not call Taskade's backend directly. Instead, it relies on the hosting layer (Taskade's CDN or your own edge function) to inject the appropriate headers and route the request.

### Local Development Setup

To run the application locally, you must provide a proxy or a mock server that listens to `/api/taskade`.

1. Install dependencies:
   ```bash
   cd apps/default
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *Note: API calls will return 404s out-of-the-box unless you set up a mock API server or a reverse proxy pointing to your Taskade endpoint.*

### Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Serve the generated static files located in `apps/default/dist/` via your edge CDN.
3. **Important:** Ensure your CDN/edge layer is configured to correctly route `/api/taskade` to the Taskade backend.

## Project Structure

- `.taskade/`: Contains branding and integration metadata.
- `src/`: Core React components and logic.
  - `components/FullScreenWhatsApp.tsx`: The primary interface component.
  - `lib/theme-bridge.ts`: Secure message passing for theming.
  - `lib/genesis.tsx`: Error boundary and lifecycle logging.
- `projects/`: Taskade knowledge base data (mocked).
