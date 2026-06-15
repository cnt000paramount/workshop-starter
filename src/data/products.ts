import { Product } from '../types/product';

// Store in memoria (placeholder di un vero database).
// I dati si resettano a ogni riavvio del server.
export const products: Product[] = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 89.0, category: 'electronics' },
  { id: 3, name: 'Desk Lamp', price: 39.5, category: 'home' },
  { id: 4, name: 'Notebook A5', price: 4.99, category: 'stationery' },
];

// Restituisce il prossimo id disponibile.
export function getNextId(): number {
  return products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}
