# Calculator App

A production-quality, full-featured calculator web application built with Next.js, TypeScript, and Tailwind CSS. Supports standard arithmetic, scientific functions, programmer mode, unit conversion, calculation history, memory functions, and full keyboard support.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## Features

### Calculator Modes
- **Standard** — addition, subtraction, multiplication, division, percentage, negation
- **Scientific** — trig (sin/cos/tan + inverses + hyperbolic), log, ln, exponents, roots, factorial, absolute value, constants (π, e), degree/radian toggle
- **Programmer** — binary/octal/decimal/hex display, bitwise AND/OR/XOR/NOT, left/right shift
- **Converter** — 8 categories (length, weight, temperature, area, volume, speed, time, data), 50+ units

### UX
- Live preview of result while typing
- Glassmorphism-inspired UI with light/dark/system theme
- Full keyboard support (digits, operators, Enter, Backspace, Escape, paste)
- Calculation history with timestamps — click any entry to restore it
- Memory functions: MC, MR, MS, M+, M−
- Responsive and mobile-friendly
- Smooth animations and transitions

### Backend
- REST API built with Next.js API routes
- SQLite database via Prisma ORM
- Persists history, preferences, and saved formulas
- Currency conversion endpoint (requires API key — see setup)

---

## How to Run

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Run database migrations
npx prisma migrate dev

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm test          # run the math engine unit tests (52 tests)
npm run build     # production build
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Entry point
│   ├── layout.tsx            # Root layout + theme provider
│   ├── globals.css           # Design tokens, animations, glassmorphism styles
│   └── api/                  # REST API routes
│       ├── history/          # GET, POST, DELETE /api/history
│       ├── preferences/      # GET, PUT /api/preferences
│       ├── formulas/         # CRUD /api/formulas
│       └── rates/            # GET /api/rates (currency)
├── components/
│   ├── calculator/           # All calculator UI components
│   └── ui/                   # Reusable base components (Button, ThemeToggle)
├── engine/                   # Safe math expression engine (no eval)
│   ├── tokenizer.ts
│   ├── parser.ts
│   ├── evaluator.ts
│   ├── functions.ts
│   └── index.ts
├── store/                    # Zustand state management
├── hooks/                    # useKeyboard
├── lib/                      # Prisma client + database helpers
└── types/                    # TypeScript interfaces
```

---

## How the Math Engine Works

The calculator uses a custom **recursive descent parser** — no `eval()` anywhere. This is the same technique used in compilers and interpreters.

### Three stages

**1. Tokenizer** (`engine/tokenizer.ts`)

Converts a raw string into a list of typed tokens:
```
"sin(90) + 2*pi"
→ [IDENTIFIER:sin, LPAREN, NUMBER:90, RPAREN, PLUS, NUMBER:2, STAR, IDENTIFIER:pi, EOF]
```
Also inserts implicit multiplication tokens so `2pi` and `3(4+1)` work naturally.

**2. Parser** (`engine/parser.ts`)

Converts the token list into an Abstract Syntax Tree (AST) using this grammar:
```
expression  = term (('+' | '-') term)*
term        = power (('*' | '/' | '%') power)*
power       = postfix ('^' unary)*        ← right-associative
postfix     = unary ('!')*
unary       = ('-' | '+') unary | primary
primary     = NUMBER | IDENTIFIER'('args')' | IDENTIFIER | '('expression')'
```

This structure enforces correct operator precedence — multiplication before addition, exponents before multiplication, etc.

**3. Evaluator** (`engine/evaluator.ts`)

Walks the AST recursively and computes a number. Trig functions respect the current degree/radian setting.

### Error handling

The engine never throws to the UI. All errors are returned as typed values:
```typescript
calculate("1/0")   // → { value: null, error: { kind: 'EVAL_ERROR', message: 'Division by zero' } }
calculate("2+3*4") // → { value: 14, display: '14' }
```

Incomplete expressions (while the user is still typing) return `null` silently — no "Error" flash mid-input.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand with localStorage persistence |
| Database | SQLite via Prisma ORM v7 |
| Validation | Zod |
| Icons | Lucide React |
| Themes | next-themes |
| Testing | Jest + ts-jest |

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

## Environment Variables

```bash
# .env

# SQLite database (default — no changes needed for local dev)
DATABASE_URL="file:./dev.db"

# Optional: enable live currency conversion
# Get a free key at https://www.exchangerate-api.com/
EXCHANGE_RATE_API_KEY=your_key_here
```

---

## Future Improvements

- Graphing mode — plot functions like `y = x^2`
- Saved formulas UI — the backend CRUD is complete; just needs a panel component
- User accounts — swap SQLite for PostgreSQL and add auth for cross-device sync
- Bitwise evaluation — extend the parser to evaluate `AND`/`OR`/`XOR` natively
- Share calculations — generate a shareable link for any expression/result
