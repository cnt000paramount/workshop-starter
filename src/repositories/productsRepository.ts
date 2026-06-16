import { getNextId, products } from "../data/products";
import { NewProduct, Product } from "../types/product";

/**
 * Data-access layer for products. Encapsulates the in-memory store so routes and
 * services never touch the raw array. Swapping to a real database means
 * reimplementing only this module.
 *
 * Note: operates on the shared `products` array exported from `data/products`
 * (not a copy) so existing tests can spy on `products.push` to simulate failures.
 */
export const productsRepository = {
  list(): Product[] {
    return products;
  },

  create(data: NewProduct): Product {
    const newProduct: Product = { id: getNextId(), ...data };
    products.push(newProduct);
    return newProduct;
  },
};
