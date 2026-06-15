import { Router } from 'express';
import { products, getNextId } from '../data/products';
import { Product, NewProduct } from '../types/product';

const router = Router();

// ---------------------------------------------------------------------------
// TODO (Lab 1 · Parte A): implement GET /api/products
//
// Posiziona il cursore qui sotto e inizia a digitare:
//
//   router.get('/', async (req, res) => {
//
// Copilot proporrà il corpo come ghost text: premi Tab per accettare,
// Alt+] per ciclare tra le alternative.
// (Parte B) Poi seleziona il corpo e con Ctrl+I aggiungi la validazione
// dei query param page/limit.


// ---------------------------------------------------------------------------
// TODO (Lab 1 · Parte C): implement POST /api/products
//
// Apri la Chat (Ctrl+Alt+I) e chiedi a Copilot di generarlo:
//   body: name (string, required), price (number, required),
//         category (string, optional). Validazione con Zod o manuale.
//   Risposte: 201 con il prodotto creato, 400 se la validazione fallisce.


export default router;
