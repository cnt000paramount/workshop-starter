import { z } from "zod";
import { ordersRepository } from "../repositories/ordersRepository";
import { NewOrder, Order } from "../types/order";
import { createHttpError } from "../lib/httpError";
import { Pagination, paginate } from "../lib/pagination";

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  total: z.number().positive("Total must be a positive number"),
  status: z.string().optional(),
});

/**
 * Business logic for orders. Validates input, applies pagination, and delegates
 * persistence to the repository. Throws `HttpError` for client/internal errors;
 * the route layer only maps those to HTTP responses.
 */
export const ordersService = {
  list(pagination: Pagination): Order[] {
    return paginate(ordersRepository.list(), pagination);
  },

  create(body: unknown): Order {
    let validatedData: z.infer<typeof createOrderSchema>;
    try {
      validatedData = createOrderSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createHttpError("Validation failed", 400);
      }
      throw error;
    }

    const newOrderData: NewOrder = {
      customerName: validatedData.customerName,
      total: validatedData.total,
      ...(validatedData.status && { status: validatedData.status }),
    };

    return ordersRepository.create(newOrderData);
  },
};
