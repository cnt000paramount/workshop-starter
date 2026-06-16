export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface Order {
  id: number;
  customerName: string;
  total: number;
  status?: OrderStatus;
}

export type NewOrder = Omit<Order, "id">;
