import { Router } from "express";
import { z } from "zod";
import { products, getNextId } from "../data/products";
import { Product, NewProduct } from "../types/product";

const router = Router();

// Validation schema for POST request body
const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().optional(),
});

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
router.get("/", async (req, res) => {
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;

  const page = parseInt(pageParam);
  const limit = parseInt(limitParam);

  // Validation
  if (!pageParam || isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid page parameter" });
  }
  if (!limitParam || isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: "Invalid limit parameter (max 100)" });
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
router.post("/", async (req, res) => {
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
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    // Generic internal error
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
