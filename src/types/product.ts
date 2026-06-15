// Modello dati condiviso del catalogo prodotti.
// Usato da Lab 1 (API), Lab 2 (test) e Lab 4 (componente React).
export interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
}

// Payload di creazione (senza id, generato dal server).
export type NewProduct = Omit<Product, 'id'>;
