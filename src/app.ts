import express from "express";
import healthRouter from "./routes/health";
import ordersRouter from "./routes/orders";
import productsRouter from "./routes/products";
import { errorHandler } from "./middleware/errorHandler";

// Builds and configures the Express app.
// Exported separately from index.ts so it can be tested (Lab 2) without
// starting a listening server.
export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/products", productsRouter);

  app.use(errorHandler);
  return app;
}
