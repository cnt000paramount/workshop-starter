import { Router } from "express";

const router = Router();

// ✅ Sample endpoint, already implemented.
// Use it as a style reference while completing products.ts in Lab 1.
router.get("/", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
