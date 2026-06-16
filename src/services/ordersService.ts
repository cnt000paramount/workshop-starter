import { z } from "zod";
import { ordersRepository } from "../repositories/ordersRepository";
import { NewOrder, Order } from "../types/order";
import { Pagination, paginate } from "../lib/pagination";
import { validateBody } from "../lib/validateBody";

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
    const validatedData = validateBody(createOrderSchema, body);

    const newOrderData: NewOrder = {
      customerName: validatedData.customerName,
      total: validatedData.total,
      ...(validatedData.status && { status: validatedData.status }),
    };

    return ordersRepository.create(newOrderData);
  },
};
