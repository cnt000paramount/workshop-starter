import { getNextOrderId, orders } from "../data/orders";
import { NewOrder, Order } from "../types/order";

/**
 * Data-access layer for orders. Encapsulates the in-memory store so routes and
 * services never touch the raw array. Swapping to a real database means
 * reimplementing only this module.
 *
 * Note: operates on the shared `orders` array exported from `data/orders` (not a
 * copy) so existing tests can spy on `orders.push` to simulate failures.
 */
export const ordersRepository = {
  list(): Order[] {
    return orders;
  },

  create(data: NewOrder): Order {
    const newOrder: Order = { id: getNextOrderId(), ...data };
    orders.push(newOrder);
    return newOrder;
  },
};
