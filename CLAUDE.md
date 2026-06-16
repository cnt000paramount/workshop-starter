# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start with live reload (tsx watch)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled output
npm test         # Run all Jest tests
npx jest src/routes/__tests__/products.test.ts  # Run a single test file
```

## Architecture

Express/TypeScript API with in-memory data storage. The app factory pattern (`src/app.ts` exports `createApp()`) separates the Express instance from the server bootstrap (`src/index.ts`), making routes testable via supertest without starting a real server.

```
src/
  app.ts           # Express app factory — mounts routers under /api, attaches error handler
  index.ts         # Server entry point — reads PORT (default 3000), calls app.listen()
  routes/          # One file per resource; __tests__/ lives here alongside routes
  types/           # Shared interfaces (Product, Order) and their NewX variants
  data/            # In-memory arrays acting as the data layer; ID generation via Math.max()
  middleware/
    errorHandler.ts  # Reads err.status and err.details; defaults to 500
```

## Conventions

**TypeScript**: Strict mode, no `any`. Types live in `src/types/`. Keep imports minimal, remove unused ones. camelCase for variables/functions, PascalCase for types/interfaces.

**Validation**: Zod schemas at the route layer — query params validated inline, body with a dedicated schema. Validation failures respond 400 with `{ error: "...", details?: [...] }`. Always validate inputs before processing.

**Status codes**: 200 GET success, 201 POST success, 400 validation failure, 500 unexpected error. Do not change API response contracts without explicit instruction.

**Pagination**: All list endpoints accept `page` (int ≥ 1) and `limit` (int 1–100) query params.

**Routes**: Use `async` handlers consistently. Always route errors through the centralized `errorHandler` middleware — never send error responses directly in routes.

**Error handler**: Custom errors must have a `status: number` property (not on the standard `Error` type — this is a known intentional gap; `diagnostics: false` in ts-jest allows tests to compile despite it).

**Tests**: Each test file snapshots the initial data store in `beforeEach`, splices the array to reset state, and uses `jest.spyOn` to force error paths. Cover happy path, validation failures, edge cases for query/body params, and the internal error branch.

**Scope**: Do not refactor unrelated files when implementing a scoped request. Do not add new npm packages without explicit instruction.
