export interface Order {
  id: number;
  customerName: string;
  total: number;
  status?: string;
}

export type NewOrder = Omit<Order, "id">;
