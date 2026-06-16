import { Order } from "../types/order";

export const orders: Order[] = [
  { id: 1, customerName: "Alice Johnson", total: 129.99, status: "pending" },
  { id: 2, customerName: "Marco Rossi", total: 54.5, status: "paid" },
  { id: 3, customerName: "Sofia Bianchi", total: 210, status: "shipped" },
  { id: 4, customerName: "Liam Carter", total: 19.99, status: "pending" },
];

export function getNextOrderId(): number {
  return orders.length ? Math.max(...orders.map((order) => order.id)) + 1 : 1;
}
