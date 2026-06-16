import { Router } from "express";
import { z } from "zod";
import { getNextId, orders } from "../data/orders";
import { Order } from "../types/order";
import { createHttpError } from "../utils/httpError";
import { isPaginationError, parsePaginationParams } from "../utils/pagination";

const router = Router();

const CreateOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  total: z.number().positive("Total must be a positive number"),
  status: z.enum(["pending", "paid", "shipped", "cancelled"]).optional(),
});

/**
 * GET /
 * Returns the order list with pagination.
 *
 * Query params:
 * - page: page number (required, integer >= 1)
 * - limit: items per page (required, integer between 1 and 100)
 *
 * Responses:
 * - 200: paginated orders array
 * - 400: invalid page/limit parameters
 */
router.get("/", async (req, res, next) => {
  const pagination = parsePaginationParams(req.query);
  if (isPaginationError(pagination)) {
    return next(createHttpError(pagination.error, pagination.status));
  }

  const { page, limit } = pagination;
  const startIndex = (page - 1) * limit;
  const paginatedOrders = orders.slice(startIndex, startIndex + limit);

  res.json(paginatedOrders);
});

/**
 * POST /
 * Creates a new order and stores it in the in-memory collection.
 *
 * Request body:
 * - customerName: required non-empty string
 * - total: required positive number
 * - status: optional string
 *
 * Responses:
 * - 201: created order object
 * - 400: validation failed (invalid request body)
 * - 500: unexpected internal error
 */
router.post("/", async (req, res, next) => {
  try {
    const validatedData = CreateOrderSchema.parse(req.body);

    const newOrder: Order = {
      id: getNextId(),
      customerName: validatedData.customerName,
      total: validatedData.total,
      ...(validatedData.status && { status: validatedData.status }),
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(createHttpError("Validation failed", 400));
    }

    return next(createHttpError("Internal server error", 500));
  }
});

export default router;
