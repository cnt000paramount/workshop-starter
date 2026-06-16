# Copilot Instructions

## Project context

- Language: **TypeScript (strict mode)**.
- Framework: **Express.js**.
- Testing: **Jest** with **supertest**.
- Validation: **Zod** schemas for request bodies.
- Data layer for now: in-memory arrays (no database).

## Coding style

- Write code and comments in **English**.
- Keep code simple, readable, and beginner-friendly.
- Prefer small, focused functions and clear variable names.
- Keep existing project structure and naming conventions.
- Use `async` handlers consistently for routes.

## API conventions

- Base routes are mounted under `/api` in `src/app.ts`.
- Return consistent JSON error payloads (e.g. `{ "error": "..." }`).
- Validate inputs before processing.
- Always use the centralized `errorHandler` middleware for error handling.
- For invalid client input, return **400**.
- For successful resource creation, return **201** with created payload.
- For unexpected errors, return **500** with generic message.

## TypeScript conventions

- Preserve strict typing.
- No `any` type allowed.
- Reuse shared types from `src/types` when possible.
- Keep imports minimal and remove unused imports.

## Naming conventions

- Use **camelCase** for variables and functions.
- Use **PascalCase** for types and interfaces.

## Testing conventions

- Place route tests in `src/routes/__tests__/`.
- Use `supertest` against `createApp()` from `src/app.ts`.
- Cover:
  - happy path responses
  - validation failures
  - edge cases for query/body parameters
  - internal error branch when relevant
- Keep tests deterministic: reset in-memory state in `beforeEach`.

## What to avoid

- Do not introduce new libraries unless explicitly requested.
- Do not refactor unrelated files when implementing a scoped request.
- Do not change API response contracts without explicit instruction.

## Typical commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Test: `npm test`
