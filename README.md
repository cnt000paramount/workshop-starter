# workshop-starter

Starter **Express + TypeScript** project for the _AI for Developers Workshop — Module 2: AI-Assisted Coding_.
This is the same project that evolves across the module labs (initialized in Module 1, Lab 3).

## Prerequisites

- Node.js 18+ and npm
- VS Code with **GitHub Copilot** and **GitHub Copilot Chat** extensions
- (recommended) **REST Client** extension to use `requests.http`

## Setup

```bash
npm install
npm run dev          # starts watch mode on http://localhost:3000
```

Quick check (sample endpoint already implemented):

```bash
curl http://localhost:3000/api/health
# {"status":"ok","timestamp":"..."}
```

## Scripts

- `npm run dev`: Starts the server in watch mode via tsx (transpile-only)
- `npm run build`: Compiles with `tsc` into `dist/`
- `npm start`: Runs the compiled build
- `npm test`: Runs Jest tests

## Structure

```text
workshop-starter/
├── src/
│   ├── index.ts                 Bootstrap: starts the server on port 3000
│   ├── app.ts                   Creates/configures the Express app (testable)
│   ├── types/product.ts         Product model (+ NewProduct)
│   ├── data/products.ts         In-memory store with sample data
│   ├── routes/
│   │   ├── health.ts            ✅ GET /api/health — reference example
│   │   ├── products.ts          ⬅️ TO COMPLETE in Lab 1 (GET + POST)
│   │   └── __tests__/health.test.ts   Sample test (template for Lab 2)
│   └── middleware/errorHandler.ts     ⚠️ contains an intentional bug (Lab 1 · C)
├── requests.http                Ready-to-run requests (REST Client)
├── jest.config.js · tsconfig.json · package.json
└── .vscode/extensions.json
```

## What you will do in the labs

- **Lab 1** — Complete `src/routes/products.ts`: `GET /api/products` (inline + Inline Chat for page/limit validation) and `POST /api/products` (via Chat). Fix the intentional bug in `src/middleware/errorHandler.ts` with **/fix**.
- **Lab 2** — Generate tests with `/tests` (save in `src/routes/__tests__/products.test.ts`), generate JSDoc with `/doc`, and create `.github/copilot-instructions.md`.
- **Lab 4** — The React `ProductCard` component will consume `GET /api/products`. ⚠️ Port note: the API runs on `:3000`; if the frontend uses a separate dev server, configure a proxy or enable CORS.

## Intentional bug note

`src/middleware/errorHandler.ts` accesses `err.status`, a property that does not exist on the `Error` type: you will see a TypeScript error highlighted in VS Code. This is intentional — you will fix it in Lab 1 with **/fix**. With `npm run dev` (tsx, transpile-only) the server still starts; `npm run build` will fail until the bug is fixed.

---

## Project API Overview

### Description

This project is an **Express + TypeScript** starter API for workshop exercises.
It exposes a health endpoint and a products API with:

- pagination via query params (`page`, `limit`)
- payload validation with **Zod**
- in-memory product storage

### Quick Start

```bash
npm install
npm run dev
```

The server runs by default at:

```text
http://localhost:3000
```

### API Endpoints

#### 1) Health check

**GET** `/api/health`

```bash
curl -X GET http://localhost:3000/api/health
```

Example response:

```json
{ "status": "ok", "timestamp": "2026-01-01T12:00:00.000Z" }
```

#### 2) List products (paginated)

**GET** `/api/products?page=<number>&limit=<number>`

Valid request:

```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=2"
```

Validation error example (negative page):

```bash
curl -X GET "http://localhost:3000/api/products?page=-1&limit=10"
```

Expected error response:

```json
{ "error": "Invalid page parameter" }
```

#### 3) Create product

**POST** `/api/products`

With category:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":49.99,"category":"tech"}'
```

Without category:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Notebook","price":3.5}'
```

Validation error example (negative price):

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Invalid","price":-1}'
```

Expected error response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "message": "Price must be a positive number"
    }
  ]
}
```

### Run Tests

Run all tests:

```bash
npm test
```

Run a single test file:

```bash
npx jest src/routes/__tests__/products.test.ts
```
