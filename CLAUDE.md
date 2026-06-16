# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Express + TypeScript starter API used in the "AI for Developers Workshop — Module 2". It exposes health, products, and orders endpoints backed by in-memory arrays (no database). State resets on every server restart.

## Stack

- Node.js 20, TypeScript 5.x, Express.js
- Testing: Jest + supertest

## Commands

- `npm run dev` — start dev server in watch mode via `tsx` (transpile-only) on `http://localhost:3000`. The port can be overridden with the `PORT` env var.
- `npm run build` — compile with `tsc` to `dist/`. This runs the full type checker (unlike `dev` and `test`), so it is the only command that catches type errors.
- `npm start` — run the compiled output from `dist/`.
- `npm test` — run all Jest tests.
- `npx jest src/routes/__tests__/products.test.ts` — run a single test file.
- `requests.http` — ready-to-run HTTP requests for the REST Client VS Code extension.

## Architecture

- `src/index.ts` is the entrypoint: it only reads `PORT` and calls `app.listen`. All Express wiring lives in `src/app.ts`.
- `src/app.ts` exports `createApp()`, which builds and configures the app **without listening**. Tests import `createApp()` and drive it with `supertest`; never start a real server in tests.
- Routers under `src/routes/` are mounted under `/api/*` in `createApp()`. `errorHandler` is registered **last**, after all routes.
- `src/data/*.ts` are the in-memory stores. Each exports its array plus a `getNext*Id()` helper that derives the next id from the current max. Routes mutate these arrays directly (`.push(...)`), so tests must reset state in `beforeEach`.
- `src/types/*.ts` hold the shared domain models (e.g. `Product` + `NewProduct = Omit<Product, "id">`). Reuse these instead of redeclaring shapes.

### Error handling contract

Routes do **not** send error responses directly. Instead they build an `Error` augmented with `status` (and optional `details`) via a local `createHttpError(...)` helper and forward it with `next(err)`. The centralized `errorHandler` middleware reads `err.status` (defaulting to 500) and `err.details`, and returns `{ error: <message>, details?: <details> }`. Follow this pattern for any new route — keep response shaping in the middleware.

### Request validation

Request bodies are validated with **Zod** schemas defined at the top of each route file. On `ZodError`, routes forward a 400 via `createHttpError("Validation failed", 400, error.errors)`. Pagination (`page`, `limit`) on list endpoints is validated manually (not via Zod): both are **required**, `page >= 1`, and `1 <= limit <= 100`; invalid values return 400 with a specific message.

## Conventions

- TypeScript strict mode; **no `any`**. Reuse types from `src/types`.
- Route handlers are `async`. Successful creation returns **201** with the created object; client errors return **400**; unexpected errors return **500** with a generic message.
- Code and comments in English; camelCase for values/functions, PascalCase for types.
- Place route tests in `src/routes/__tests__/` and exercise them through `createApp()` + `supertest`, covering happy path, validation failures, and pagination edge cases.
- Do not add new libraries, change API response contracts, or refactor unrelated files unless explicitly asked.

## Build vs. test type-checking

`jest.config.js` sets ts-jest `diagnostics: false`, and `dev` uses `tsx` transpile-only — so **tests and the dev server will run even with type errors**. Only `npm run build` (`tsc`) enforces types. Run `npm run build` to validate typing before considering a change complete.

## Workshop-specific note

`README.md` describes `src/routes/products.ts` as "to complete" and `src/middleware/errorHandler.ts` as containing an intentional `err.status` type bug (Lab 1 exercises). In the current code **both are already implemented and fixed** — `products.ts` has working GET/POST and `errorHandler.ts` types `err` as `Error & { status?: number; details?: unknown }`. Trust the source over the README's lab framing.
