# Answer V2 Playground

An open-source, browser-based chat interface for the [Qwant Answer V2 API](https://www.npmjs.com/package/@qwant/answer).

Built with **React + Vite + TypeScript**, powered by the official `@qwant/answer` SDK.

## Features

- **Streaming answers** — token-by-token rendering via SSE
- **Source cards** — clickable references with domain + title
- **Related questions** — clickable follow-up chips
- **Conversation history** — multi-turn context sent automatically
- **Markdown rendering** — full GFM support via `react-markdown`
- **Custom sources** — bypass Bloom search with your own URLs
- **Domain filter** — restrict answers to a single domain
- **Dual theme** — light / dark / system with localStorage persistence
- **Fully configurable** — API key, base URL, mode, query rewrite, and more

## Getting started

### Prerequisites

- Node.js ≥ 18
- An API key for the Qwant Answer V2 API

### Local development

```bash
git clone https://github.com/Qwant/answer-v2-playground.git
cd answer-v2-playground
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and enter your API key in the **Settings** panel (⚙️ top right).

### Build

```bash
npm run build
npm run preview
```

## Deployment

### GitHub Pages (automated)

The included [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) automatically deploys to GitHub Pages on every push to `main`.

1. Fork or clone this repository
2. Go to **Settings → Pages** and set the source to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

The `VITE_BASE` env var in the workflow is set to `/answer-v2-playground/`. Update it to match your repository name if you fork under a different name.

### Manual deploy

```bash
VITE_BASE=/your-repo-name/ npm run build
# Upload dist/ to any static host
```

## Configuration

All settings are persisted to `localStorage` (API key uses `sessionStorage`).

| Setting | Description | Default |
|---|---|---|
| **API Key** | Bearer token for the Answer V2 API | — |
| **Base URL** | API base URL, useful for local dev | `https://api.staan.ai/v2` |
| **Domain filter** | Restrict search to a single domain | — |
| **Response length** | `short` or `long` | `short` |
| **Markdown** | Render response as Markdown | `true` |
| **Related questions** | Show follow-up question chips | `false` |
| **Query rewrite** | Rewrite query before search | `true` |
| **Sources mode** | `search` (fetch + rerank) or `context` (direct injection) | `search` |
| **Custom sources** | Provide your own URLs, bypassing Bloom | — |

## Tech stack

| Package | Role |
|---|---|
| [`@qwant/answer`](https://www.npmjs.com/package/@qwant/answer) | Official SDK — streaming, SSE parsing, types |
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vite.dev) | Build tool |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Markdown rendering |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | GitHub Flavored Markdown |

## Project structure

```
src/
├── App.tsx                  # Root component — layout + header
├── types.ts                 # Shared TypeScript types
├── index.css                # Global styles (CSS variables, dual theme)
├── components/
│   ├── ChatMessage.tsx      # Individual message bubble
│   ├── ChatInput.tsx        # Textarea + send/stop buttons
│   ├── EmptyState.tsx       # Welcome screen
│   ├── Icons.tsx            # Inline SVG icons
│   ├── RelatedQueries.tsx   # Follow-up question chips
│   ├── SettingsDrawer.tsx   # Side drawer — all configuration
│   └── SourcesList.tsx      # Source cards grid
├── hooks/
│   ├── useChat.ts           # Streaming logic via @qwant/answer
│   ├── useSettings.ts       # Settings state + localStorage sync
│   └── useTheme.ts          # Theme toggle + persistence
└── lib/
    └── storage.ts           # localStorage / sessionStorage helpers
```

## License

MIT
