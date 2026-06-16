import { Router } from "express";
import { z } from "zod";
import { getNextOrderId, orders } from "../data/orders";
import { NewOrder, Order } from "../types/order";

const router = Router();

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  total: z.number().positive("Total must be a positive number"),
  status: z.string().optional(),
});

function createHttpError(
  message: string,
  status: number,
): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

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
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;

  const page = parseInt(pageParam, 10);
  const limit = parseInt(limitParam, 10);

  if (!pageParam || Number.isNaN(page) || page < 1) {
    return next(createHttpError("Invalid page parameter", 400));
  }

  if (!limitParam || Number.isNaN(limit) || limit < 1 || limit > 100) {
    return next(createHttpError("Invalid limit parameter (max 100)", 400));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = orders.slice(startIndex, endIndex);

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
