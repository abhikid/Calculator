# Calculator App

A full-featured calculator web application built with Next.js, TypeScript, Tailwind CSS v4, and Prisma. Supports standard arithmetic, scientific functions, programmer mode, unit conversion, persistent calculation history, memory functions, and full keyboard support.

---

## Features

- **Standard mode** — arithmetic, percentage, negation
- **Scientific mode** — trig (sin/cos/tan + inverses + hyperbolic), log/ln, exponents, roots, factorial, constants (π, e), degree/radian toggle
- **Programmer mode** — binary/octal/decimal/hex display, bitwise AND/OR/XOR/NOT, bit shifts
- **Converter** — 8 categories (length, weight, temperature, area, volume, speed, time, data), 50+ units
- Live result preview while typing
- Full keyboard support (digits, operators, Enter, Backspace, Escape, paste)
- Calculation history with timestamps — click any entry to restore
- Memory functions: MC, MR, MS, M+, M−
- Light/dark/system theme toggle
- Responsive, mobile-friendly layout
- Persistent history, preferences, and saved formulas via SQLite

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State | Zustand with localStorage persistence |
| Database | SQLite via Prisma ORM v7 + better-sqlite3 |
| Validation | Zod |
| Icons | Lucide React |
| Themes | next-themes |
| Testing | Jest + ts-jest |

---

## Local Setup

### Prerequisites

- Node.js 20+
- npm

### Steps

```bash
# 1. Clone the repo and install dependencies
#    (this also auto-generates the Prisma client via postinstall)
npm install

# 2. Copy the environment file
cp .env.example .env

# 3. Initialize the database
npm run db:setup

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Steps 2 and 3 are only needed once on a fresh clone. After that, `npm run dev` is sufficient.

---

## Environment Variables

Copy `.env.example` to `.env`. The defaults work out of the box for local development.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite file path. Default: `file:./dev.db` |
| `EXCHANGE_RATE_API_KEY` | No | Enables live currency rates in the Converter tab. Get a free key at [exchangerate-api.com](https://www.exchangerate-api.com/) |

---

## Database

This project uses SQLite via Prisma v7. The database file (`dev.db`) is created locally and is not committed to the repo.

```bash
npm run db:setup     # apply migrations (creates dev.db if it doesn't exist)
```

Migrations live in `prisma/migrations/`. The Prisma client is generated automatically on `npm install` via the `postinstall` script and outputs to `src/generated/prisma/`.

---

## Running Tests

```bash
npm test             # run all tests (52 math engine unit tests)
npm run test:watch   # watch mode
```

Tests cover the custom recursive-descent math engine (`src/engine/`).

---

## Other Commands

```bash
npm run build        # production build
npm run lint         # ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Entry point
│   ├── layout.tsx            # Root layout + theme provider
│   ├── globals.css           # Design tokens, animations
│   └── api/                  # REST API routes
│       ├── history/          # GET, POST, DELETE /api/history
│       ├── preferences/      # GET, PUT /api/preferences
│       ├── formulas/         # CRUD /api/formulas
│       └── rates/            # GET /api/rates (currency)
├── components/
│   ├── calculator/           # Calculator UI components
│   └── ui/                   # Reusable base components
├── engine/                   # Custom math engine (no eval)
│   ├── tokenizer.ts
│   ├── parser.ts
│   ├── evaluator.ts
│   └── functions.ts
├── store/                    # Zustand state management
├── hooks/                    # useKeyboard
├── lib/                      # Prisma client singleton + DB helpers
└── types/                    # TypeScript interfaces
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/history` | Fetch calculation history |
| POST | `/api/history` | Save a calculation |
| DELETE | `/api/history` | Clear all history |
| DELETE | `/api/history/:id` | Delete one entry |
| GET | `/api/preferences` | Get user preferences |
| PUT | `/api/preferences` | Update preferences |
| GET | `/api/formulas` | List saved formulas |
| POST | `/api/formulas` | Save a formula |
| PUT | `/api/formulas/:id` | Update a formula |
| DELETE | `/api/formulas/:id` | Delete a formula |
| GET | `/api/rates` | Currency exchange rates |

---

## Implementation Notes

**Math engine** — The calculator uses a custom recursive-descent parser (no `eval()`). Three stages: tokenizer → AST parser → evaluator. Operator precedence, implicit multiplication (`2pi`, `3(4+1)`), and right-associative exponentiation are all handled in the grammar. Errors are returned as typed values rather than thrown exceptions.

**Prisma v7** — This project uses Prisma v7, which separates the datasource URL from `schema.prisma` into `prisma.config.ts`. The generated client outputs to `src/generated/prisma/` (not the default location) and is gitignored; `postinstall` regenerates it automatically.

**SQLite + better-sqlite3** — The Prisma client uses the `@prisma/adapter-better-sqlite3` driver adapter, which requires the `better-sqlite3` native module. This is installed automatically via `npm install`.
