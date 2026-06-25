<p align="center">
  <img src="https://img.shields.io/badge/CloudSphere-AI-6366f1?style=for-the-badge&logo=cloudflare&logoColor=white" alt="CloudSphere AI" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Workers_AI-Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers AI" />
</p>

<h1 align="center">☁️ CloudSphere AI</h1>

<p align="center">
  <strong>Intelligent Storage Query Engine powered by RAG + Cloudflare Workers AI</strong>
  <br />
  Ask natural-language questions about your Google Drive documents and get instant, AI-generated answers with source citations.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Natural Language Queries** | Ask questions in plain English — the AI retrieves and synthesizes answers from your documents. |
| **RAG Pipeline** | Retrieval-Augmented Generation using Cloudflare Workers AI (`bge-base-en-v1.5` embeddings + `Llama 3.1 8B` LLM) for accurate, grounded responses. |
| **Google Drive Integration** | OAuth 2.0 authentication to securely access and index your Drive files (PDFs, DOCX, text). |
| **Real-time Pipeline Visualization** | Watch each RAG stage (Parse → Chunk → Embed → Retrieve → Reason) animate live as your query processes. |
| **Interactive Dashboard** | Glassmorphic dark-mode UI with stats, charts, AI insights, and a full file explorer. |
| **Document Parsing** | Extracts text from PDFs (`pdf-parse`), Word documents (`mammoth`), and plain text files. |
| **Smart AI Insights** | Auto-generated summaries and actionable intelligence about your document repository. |
| **File Management** | Star important documents, sort by name/date/size, filter by type, and browse by folder category. |
| **Auto-Sync** | Sync with Google Drive to detect new and modified files; skip unchanged files for efficiency. |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│                                                          │
│  ┌──────────┐  ┌───────────┐  ┌────────────────────────┐ │
│  │ Sidebar  │  │ Dashboard │  │  Query Bar + Results   │ │
│  │ Nav      │  │ Stats /   │  │  (RAG Pipeline Viz)    │ │
│  │          │  │ Charts    │  │                        │ │
│  └──────────┘  └───────────┘  └────────────────────────┘ │
│                        │                                 │
│              Zustand Store + React Query                 │
└────────────────────────┼─────────────────────────────────┘
                         │ HTTP (Axios)
                         ▼
┌──────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                   │
│                                                          │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ Auth         │  │ Drive      │  │ Query            │  │
│  │ Controller   │  │ Controller │  │ Controller       │  │
│  └──────┬───────┘  └─────┬──────┘  └────────┬─────────┘  │
│         │                │                   │            │
│  ┌──────▼───────┐  ┌─────▼──────┐  ┌────────▼─────────┐  │
│  │ Google OAuth │  │ Drive API  │  │ RAG Pipeline     │  │
│  │ + JWT        │  │ + Parser   │  │ Cloudflare AI    │  │
│  └──────────────┘  └────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────┘
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │ Cloudflare Workers  │
                                   │ AI API              │
                                   │ • bge-base-en-v1.5  │
                                   │ • Llama 3.1 8B      │
                                   └────────────────────┘
```

### RAG Pipeline Flow

```
User Query ─→ Embed Query (Cloudflare bge-base-en-v1.5) ─→ Vector Search (Cosine Similarity)
                                                                    │
                                                                    ▼
                                                            Top-K Relevant Chunks
                                                                    │
                                                                    ▼
                                                         Augmented Prompt + Context
                                                                    │
                                                                    ▼
                                              Cloudflare Llama 3.1 8B Generation ─→ Answer + Sources
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework with concurrent features |
| [TypeScript 5](https://www.typescriptlang.org/) | Type-safe development |
| [Vite 5](https://vitejs.dev/) | Lightning-fast build tool & HMR |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling with custom glassmorphic design system |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management |
| [TanStack React Query](https://tanstack.com/query) | Server state & caching |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Zod](https://zod.dev/) | Runtime schema validation |
| [Axios](https://axios-http.com/) | HTTP client |
| [date-fns](https://date-fns.org/) | Date utility library |

### Backend

| Technology | Purpose |
|---|---|
| [Express.js](https://expressjs.com/) | REST API server |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | LLM inference (`@cf/meta/llama-3.1-8b-instruct`) & embeddings (`@cf/baai/bge-base-en-v1.5`) |
| [Google APIs (googleapis)](https://github.com/googleapis/google-api-nodejs-client) | Google Drive API access & OAuth 2.0 |
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | PDF text extraction |
| [mammoth](https://www.npmjs.com/package/mammoth) | DOCX text extraction |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | JWT session management |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variable loading |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A [Google Cloud Console](https://console.cloud.google.com/) project with:
  - **OAuth 2.0 credentials** (Client ID + Client Secret)
  - **Google Drive API** enabled
- A [Cloudflare](https://dash.cloudflare.com/) account with:
  - **Workers AI** enabled
  - **Account ID** and an **API Token** with Workers AI permissions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CloudSphere-ai.git
cd CloudSphere-ai
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [`.env.example`](backend/.env.example)):

```env
PORT=5000
FRONTEND_URL=http://localhost:3000

# Google OAuth 2.0 Credentials
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Cloudflare Workers AI Credentials
# Get these from: https://dash.cloudflare.com/ → AI → Workers AI
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_API_TOKEN=your-cloudflare-api-token

# JWT Token Secret (use a strong random string in production)
JWT_SECRET=super-secret-jwt-signing-key-change-in-production
```

Start the backend dev server:

```bash
npm run dev
```

The API server will start on `http://localhost:5000`.

### 3. Setup the Frontend

Open a new terminal from the project root:

```bash
npm install
```

Start the frontend dev server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`.

### 4. Connect Google Drive

1. Navigate to `http://localhost:3000` in your browser.
2. Click **Connect Google Drive** to initiate OAuth login.
3. Grant access to your Drive files.
4. Click **Sync** to index your documents into the vector store.
5. Start querying your files in natural language!

---

## 📁 Project Structure

```
CloudSphere-ai/
├── backend/                          # Express.js API server
│   ├── src/
│   │   ├── app.ts                    # Express app setup (CORS, middleware, routes)
│   │   ├── server.ts                 # Server entry point
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # Google OAuth login/callback/logout/status
│   │   │   ├── drive.controller.ts   # Drive file listing, sync, starring
│   │   │   └── query.controller.ts   # RAG query processing
│   │   ├── routes/
│   │   │   ├── index.ts              # Route aggregator (/api/*)
│   │   │   ├── auth.routes.ts        # /api/auth/*
│   │   │   ├── drive.routes.ts       # /api/drive/*
│   │   │   └── query.routes.ts       # /api/query/*
│   │   ├── services/
│   │   │   ├── cloudflare.service.ts       # Cloudflare Workers AI (embeddings + LLM)
│   │   │   ├── cloudflare-rag.service.ts   # RAG orchestration via Cloudflare
│   │   │   ├── gemini.service.ts           # RAG service (uses Cloudflare under the hood)
│   │   │   ├── vector.service.ts           # In-memory vector store + cosine similarity
│   │   │   ├── drive.service.ts            # Google Drive API interactions
│   │   │   └── parser.service.ts           # PDF/DOCX/text extraction & chunking
│   │   └── utils/
│   │       └── logger.ts             # Logging utility
│   ├── db.json                       # Persisted vector database (auto-generated)
│   ├── .env.example                  # Environment variable template
│   ├── package.json
│   └── tsconfig.json
│
├── src/                              # React frontend source
│   ├── main.tsx                      # App entry point (React Query, Router)
│   ├── App.tsx                       # Root component with ErrorBoundary
│   ├── index.css                     # Global CSS & Tailwind imports
│   ├── App.css                       # App-level styles
│   ├── pages/
│   │   └── DashboardPage.tsx         # Main dashboard layout (tabs: Dashboard / Files)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Top navigation bar
│   │   │   ├── Sidebar.tsx           # Side navigation panel
│   │   │   ├── Footer.tsx            # Footer bar
│   │   │   └── StatsRow.tsx          # Stats widgets row
│   │   ├── common/
│   │   │   └── ErrorBoundary.tsx     # React error boundary
│   │   └── ui/                       # Reusable UI primitives
│   ├── features/
│   │   ├── query/
│   │   │   ├── components/
│   │   │   │   ├── QueryBar.tsx                # Natural language search input
│   │   │   │   ├── QueryResults.tsx            # AI-generated answer display
│   │   │   │   ├── PipelineViz.tsx             # RAG pipeline stage animation
│   │   │   │   ├── ResultCard.tsx              # Individual result card
│   │   │   │   ├── SearchActivityChart.tsx     # Query activity chart (SVG)
│   │   │   │   ├── StorageDistributionChart.tsx  # File type distribution (SVG)
│   │   │   │   └── SmartAIInsights.tsx         # AI insights panel
│   │   │   ├── hooks/
│   │   │   │   └── useAIQuery.ts               # Query hook (API + state)
│   │   │   └── store/
│   │   │       └── queryStore.ts               # Zustand query state
│   │   └── storage/
│   │       ├── components/
│   │       │   ├── FileGrid.tsx                # File explorer grid
│   │       │   └── FileCard.tsx                # Individual file card
│   │       └── store/
│   │           └── storageStore.ts             # Zustand storage state
│   ├── hooks/                        # Shared custom hooks
│   ├── lib/                          # Library wrappers
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── constants/
│   │   └── index.ts                  # App constants, pipeline steps, folder metadata
│   ├── utils/                        # Utility functions
│   └── styles/
│       └── globals.css               # Global design tokens & glassmorphism styles
│
├── public/                           # Static assets
├── index.html                        # HTML entry point
├── vite.config.ts                    # Vite configuration (path aliases, optimizations)
├── tailwind.config.ts                # Tailwind CSS configuration (custom theme)
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.js                  # ESLint configuration
├── postcss.config.js                 # PostCSS configuration
├── .prettierrc                       # Prettier configuration
├── .env.example                      # Frontend environment template
└── package.json                      # Frontend dependencies & scripts
```

---

## 📡 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/google` | Initiates Google OAuth 2.0 login flow |
| `GET` | `/api/auth/google/callback` | OAuth callback — exchanges code for tokens, sets JWT cookie |
| `GET` | `/api/auth/status` | Returns current authentication status |
| `POST` | `/api/auth/logout` | Clears session cookies and logs out |

### Google Drive (`/api/drive`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/drive/files` | Lists all indexed files (from vector DB, not live Drive) |
| `POST` | `/api/drive/sync` | Syncs Google Drive — downloads, parses, chunks, and embeds new/modified files |
| `POST` | `/api/drive/files/:id/star` | Toggles the starred status of a file |

### RAG Query (`/api/query`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/query` | Sends a natural language query through the full RAG pipeline |

**Request body:**
```json
{ "query": "Find invoices above ₹10,000" }
```

**Response:**
```json
{
  "answer": "Found 3 invoices exceeding ₹10,000...",
  "matches": [
    {
      "id": 12345,
      "driveId": "abc123",
      "relevance": "high",
      "reason": "Semantic similarity match",
      "highlight": "Invoice total: ₹15,000..."
    }
  ],
  "insight": null
}
```

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Returns server health status and timestamp |

---

## 📜 Available Scripts

### Frontend (root directory)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR (port 3000) |
| `npm run build` | Type-check & production build |
| `npm run preview` | Preview production build locally (port 4173) |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type checking (no emit) |
| `npm run test` | Run tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Generate test coverage report |

### Backend (`backend/` directory)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with auto-restart (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production server |

---

## 🧩 Key Design Decisions

| Decision | Rationale |
|---|---|
| **Cloudflare Workers AI over OpenAI/Gemini** | Free-tier friendly, low-latency inference via Cloudflare's edge network. Uses `bge-base-en-v1.5` for embeddings and `Llama 3.1 8B Instruct` for generation. |
| **In-Memory Vector Store** | Stored in `db.json` for development simplicity. Embeddings persisted to disk and loaded on startup. Swap for Pinecone/Weaviate/pgvector in production. |
| **Zustand over Redux** | Minimal boilerplate for a focused feature set. Store logic collocated within feature directories. |
| **Feature-based Architecture** | Code organized by domain (`query/`, `storage/`) rather than by type, improving cohesion and discoverability. |
| **ErrorBoundary Wrapping** | Every major component wrapped in an `ErrorBoundary` to prevent cascading UI failures. |
| **Glassmorphic Design System** | Custom CSS variables and Tailwind extensions create a cohesive dark-mode aesthetic with ambient effects. |
| **Path Aliases** | `@/`, `@components/`, `@features/` etc. configured in both Vite and TypeScript for clean imports. |
| **Incremental Sync** | Drive sync skips unchanged files (matching size + modified date) to avoid redundant API calls and re-embedding. |

---

## 🔒 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS (default: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth 2.0 Client Secret |
| `GOOGLE_REDIRECT_URI` | Yes | OAuth callback URL |
| `CF_ACCOUNT_ID` | Yes | Cloudflare Account ID |
| `CF_API_TOKEN` | Yes | Cloudflare API Token (with Workers AI permissions) |
| `JWT_SECRET` | Yes | Secret key for signing JWT session tokens |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "feat: add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

Please follow the existing code style and ensure all linting/type checks pass before submitting.

---

## 📄 License

This project is private and not currently open-sourced.

---

<p align="center">
  Built with ❤️ using React, TypeScript, and Cloudflare Workers AI
</p>
