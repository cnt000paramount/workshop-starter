import { Router } from "express";
import { z } from "zod";
import { products, getNextId } from "../data/products";
import { Product } from "../types/product";

const router = Router();

// Validation schema for POST request body
const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().optional(),
});

function createHttpError(
  message: string,
  status: number,
  details?: unknown,
): Error & { status: number; details?: unknown } {
  const error = new Error(message) as Error & {
    status: number;
    details?: unknown;
  };

  error.status = status;

  if (details !== undefined) {
    error.details = details;
  }

  return error;
}

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
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;

  const page = parseInt(pageParam, 10);
  const limit = parseInt(limitParam, 10);

  // Validation
  if (!pageParam || Number.isNaN(page) || page < 1) {
    return next(createHttpError("Invalid page parameter", 400));
  }

  if (!limitParam || Number.isNaN(limit) || limit < 1 || limit > 100) {
    return next(createHttpError("Invalid limit parameter (max 100)", 400));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  res.json(paginatedProducts);
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
    // Validate request body
    const validatedData = CreateProductSchema.parse(req.body);

    // Create new product with generated id
    const newProduct: Product = {
      id: getNextId(),
      name: validatedData.name,
      price: validatedData.price,
      ...(validatedData.category && { category: validatedData.category }),
    };

    // Add product to in-memory array
    products.push(newProduct);

    // Return 201 with created product
    res.status(201).json(newProduct);
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return next(createHttpError("Validation failed", 400, error.errors));
    }

    // Generic internal error
    return next(createHttpError("Internal server error", 500));
  }
});

export default router;
