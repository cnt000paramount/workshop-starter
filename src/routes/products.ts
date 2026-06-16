import { Router } from "express";
import { productsService } from "../services/productsService";
import { createHttpError, HttpError } from "../lib/httpError";
import { parsePagination } from "../lib/pagination";

const router = Router();

/**
 * GET /
 * Returns the product list with pagination.
 *
 * Query params:
 * - page: page number (required, integer >= 1)
 * - limit: items per page (required, integer between 1 and 100)
 *
 * Responses:
 * - 200: paginated products array
 * - 400: invalid page/limit parameters
 */
router.get("/", async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    res.json(productsService.list(pagination));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /
 * Creates a new product and stores it in the in-memory collection.
 *
 * Request body:
 * - name: required non-empty string
 * - price: required positive number
 * - category: optional string
 *
 * Responses:
 * - 201: created product object
 * - 400: validation failed (invalid request body)
 * - 500: unexpected internal error
 */
router.post("/", async (req, res, next) => {
  try {
    const newProduct = productsService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    // Known client errors (e.g. validation) carry an HTTP status; forward them.
    if (error instanceof HttpError) {
      return next(error);
    }
    // Anything else is unexpected -> generic 500.
    return next(createHttpError("Internal server error", 500));
  }
});

export default router;
