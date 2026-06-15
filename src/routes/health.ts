import { Router } from 'express';

const router = Router();

// ✅ Endpoint di ESEMPIO, già implementato.
// Usalo come riferimento di stile mentre completi products.ts nel Lab 1.
router.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
