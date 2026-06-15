# workshop-starter

Progetto starter **Express + TypeScript** per il *Workshop AI per Sviluppatori — Modulo 2: AI-Assisted Coding*.
È lo stesso progetto che si evolve lungo i quattro laboratori del modulo (e che hai inizializzato nel Lab 3 del Modulo 1).

## Prerequisiti
- Node.js 18+ e npm
- VS Code con le estensioni **GitHub Copilot** e **GitHub Copilot Chat**
- (consigliata) estensione **REST Client** per usare `requests.http`

## Setup
```bash
npm install
npm run dev          # avvia in watch su http://localhost:3000
```
Verifica rapida (endpoint di esempio già implementato):
```bash
curl http://localhost:3000/api/health
# {"status":"ok","timestamp":"..."}
```

## Script
| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Avvia il server in watch con tsx (transpile-only) |
| `npm run build` | Compila con `tsc` in `dist/` |
| `npm start` | Esegue la build compilata |
| `npm test` | Esegue i test Jest |

## Struttura
```
workshop-starter/
├── src/
│   ├── index.ts                 Bootstrap: avvia il server sulla porta 3000
│   ├── app.ts                   Crea/configura l'app Express (testabile)
│   ├── types/product.ts         Modello Product (+ NewProduct)
│   ├── data/products.ts         Store in memoria con dati di esempio
│   ├── routes/
│   │   ├── health.ts            ✅ GET /api/health — esempio di riferimento
│   │   ├── products.ts          ⬅️ DA COMPLETARE nel Lab 1 (GET + POST)
│   │   └── __tests__/health.test.ts   Test di esempio (modello per il Lab 2)
│   └── middleware/errorHandler.ts     ⚠️ contiene un bug intenzionale (Lab 1 · C)
├── requests.http                Richieste pronte (REST Client)
├── jest.config.js · tsconfig.json · package.json
└── .vscode/extensions.json
```

## Cosa farai nei laboratori
- **Lab 1** — Completa `src/routes/products.ts`: `GET /api/products` (inline + Inline Chat per la validazione page/limit) e `POST /api/products` (via Chat). Correggi il bug intenzionale in `src/middleware/errorHandler.ts` con **/fix**.
- **Lab 2** — Genera i test con `/tests` (salva in `src/routes/__tests__/products.test.ts`), il JSDoc con `/doc`, e crea `.github/copilot-instructions.md`.
- **Lab 4** — Il componente React `ProductCard` consumerà `GET /api/products`. ⚠️ Nota porte: l'API gira sulla `:3000`; se il frontend usa un dev server separato, configura un proxy o abilita CORS.

## Nota sul bug intenzionale
`src/middleware/errorHandler.ts` accede a `err.status`, proprietà inesistente sul tipo `Error`: vedrai l'errore TypeScript sottolineato in VS Code. È voluto — lo correggerai nel Lab 1 con **/fix**. Con `npm run dev` (tsx, transpile-only) il server parte comunque; `npm run build` invece fallirà finché il bug non è corretto.
