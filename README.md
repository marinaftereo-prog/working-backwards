# Working Backwards

A quiet, cinematic reflection exercise. You answer a few honest questions, and an
AI writes two obituaries for you — one for the life you're living now, one for
the life you could grow into — then distills the few things that matter most.

Built with **React + Vite + Tailwind CSS** (frontend) and **Express + Node**
(backend), powered by the **Anthropic API** (`claude-opus-4-8`).

```
working-backwards/
├── client/    # React + Vite + Tailwind frontend
└── server/    # Express backend (calls the Anthropic API)
```

## The five screens

1. **Welcome** — a bold, minimal landing page with a single invitation.
2. **Current intake** — your name and four questions about your life today.
3. **Current obituary** — your life as it reads now, in spacious serif.
4. **Aspirational intake** — four questions about who you could become.
5. **Aspirational obituary + what matters most** — the life you could grow into,
   plus three quiet lines of focus, and actions to copy, share, edit, download, or save.

## Prerequisites

- **Node.js 18+** (the server uses ES modules and `node --watch`)
- An **Anthropic API key** — get one at <https://console.anthropic.com/>

## Setup

From the project root:

```bash
# 1. Backend
cd server
npm install
cp .env.example .env          # then open .env and paste your ANTHROPIC_API_KEY

# 2. Frontend (in a second terminal)
cd client
npm install
```

## Running it

Run the two pieces in separate terminals.

```bash
# Terminal 1 — backend on http://localhost:3001
cd server
npm run dev

# Terminal 2 — frontend on http://localhost:5173
cd client
npm run dev
```

Open **http://localhost:5173**. Vite proxies all `/api` calls to the Express
server, so you don't need to configure anything else for local development.

To check the backend is alive and your key is loaded:

```bash
curl http://localhost:3001/api/health
# { "ok": true, "model": "claude-opus-4-8", "keyConfigured": true }
```

## Building for production

```bash
cd client
npm run build      # outputs to client/dist/
npm run preview    # preview the production build locally
```

In production, serve `client/dist/` from any static host and point its `/api`
routes at the running Express server (set `PORT` in `server/.env` as needed).

## API

All endpoints accept and return JSON.

| Method & path                  | Body                                                 | Returns                          |
| ------------------------------ | ---------------------------------------------------- | -------------------------------- |
| `POST /api/generate-obituary`    | `{ name, q1, q2, q3, q4 }`                           | `{ obituary }`                   |
| `POST /api/generate-aspirational`| `{ name, q1, q2, q3, q4 }`                           | `{ obituary }`                   |
| `POST /api/generate-focus`       | `{ currentObituary, aspirationalObituary }`          | `{ lines: [string, string, string] }` |
| `GET  /api/health`               | —                                                    | `{ ok, model, keyConfigured }`   |

The model, prompts, and request parameters live in [`server/index.js`](server/index.js).

## Notes

- **Save** is shown as active but, in this MVP, prompts that persistence requires
  a free account. The reminder feature ("Have Working Backwards remind you…") is a
  non-MVP placeholder.
- **Download PDF** uses the browser's print dialog with a print stylesheet that
  isolates the obituary — choose "Save as PDF" there. No extra dependencies.
- Nothing is stored server-side; each session lives only in the browser.
