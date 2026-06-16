import { z } from "zod";
import { productsRepository } from "../repositories/productsRepository";
import { NewProduct, Product } from "../types/product";
import { Pagination, paginate } from "../lib/pagination";
import { validateBody } from "../lib/validateBody";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().optional(),
});

/**
 * Business logic for products. Validates input, applies pagination, and
 * delegates persistence to the repository. Throws `HttpError` for client/
 * internal errors; the route layer only maps those to HTTP responses.
 */
export const productsService = {
  list(pagination: Pagination): Product[] {
    return paginate(productsRepository.list(), pagination);
  },

  create(body: unknown): Product {
    const validatedData = validateBody(createProductSchema, body, true);

    const newProductData: NewProduct = {
      name: validatedData.name,
      price: validatedData.price,
      ...(validatedData.category && { category: validatedData.category }),
    };

    return productsRepository.create(newProductData);
  },
};
