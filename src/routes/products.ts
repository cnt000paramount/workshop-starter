import { Router } from "express";
import { z } from "zod";
import { products, getNextId } from "../data/products";
import { Product, NewProduct } from "../types/product";

const router = Router();

// Schema di validazione per il body del POST
const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().optional(),
});

router.get("/", async (req, res) => {
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;

  const page = parseInt(pageParam);
  const limit = parseInt(limitParam);

  // Validazione
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

router.post("/", async (req, res) => {
  try {
    // Valida il body della richiesta
    const validatedData = CreateProductSchema.parse(req.body);

    // Crea il nuovo prodotto con id generato
    const newProduct: Product = {
      id: getNextId(),
      name: validatedData.name,
      price: validatedData.price,
      ...(validatedData.category && { category: validatedData.category }),
    };

    // Aggiunge il prodotto all'array
    products.push(newProduct);

    // Ritorna 201 con il prodotto creato
    res.status(201).json(newProduct);
  } catch (error) {
    // Gestisce errori di validazione
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    // Errore generico
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
