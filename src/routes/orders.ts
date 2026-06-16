import { Router } from "express";
import { z } from "zod";
import { getNextOrderId, orders } from "../data/orders";
import { NewOrder, Order } from "../types/order";
import { createHttpError } from "../lib/httpError";
import { paginate, parsePagination } from "../lib/pagination";

const router = Router();

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  total: z.number().positive("Total must be a positive number"),
  status: z.string().optional(),
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
  try {
    const pagination = parsePagination(req);
    res.json(paginate(orders, pagination));
  } catch (error) {
    next(error);
  }
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
    const validatedData = createOrderSchema.parse(req.body);

    const newOrderData: NewOrder = {
      customerName: validatedData.customerName,
      total: validatedData.total,
      ...(validatedData.status && { status: validatedData.status }),
    };

    const newOrder: Order = {
      id: getNextOrderId(),
      ...newOrderData,
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
