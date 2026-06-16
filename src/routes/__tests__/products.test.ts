import request from "supertest";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { createApp } from "../../app";
import { products } from "../../data/products";

describe("Products routes", () => {
  const initialProductsSnapshot = products.map((p) => ({ ...p }));

  beforeEach(() => {
    products.splice(
      0,
      products.length,
      ...initialProductsSnapshot.map((p) => ({ ...p })),
    );
    jest.restoreAllMocks();
  });

  describe("GET /api/products", () => {
    it("returns 400 when page query param is missing", async () => {
      const res = await request(createApp()).get("/api/products?limit=10");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid page parameter" });
    });

    it("returns 400 when page is not a number", async () => {
      const res = await request(createApp()).get(
        "/api/products?page=abc&limit=10",
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid page parameter" });
    });

    it("should return 400 for negative page number", async () => {
      const res = await request(createApp()).get(
        "/api/products?page=-1&limit=10",
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid page parameter" });
    });

    it("returns 400 when limit query param is missing", async () => {
      const res = await request(createApp()).get("/api/products?page=1");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid limit parameter (max 100)" });
    });

    it("returns 400 when limit is greater than 100", async () => {
      const res = await request(createApp()).get(
        "/api/products?page=1&limit=101",
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid limit parameter (max 100)" });
    });

    it("returns paginated products when page and limit are valid", async () => {
      const res = await request(createApp()).get(
        "/api/products?page=1&limit=2",
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(products.slice(0, 2));
    });
  });

  describe("POST /api/products", () => {
    it("creates a product with category and returns 201", async () => {
      const payload = {
        name: "Nuovo prodotto",
        price: 19.99,
        category: "tech",
      };

      const res = await request(createApp())
        .post("/api/products")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: payload.name,
        price: payload.price,
        category: payload.category,
      });
      expect(typeof res.body.id).toBe("number");
      expect(products.some((p) => p.id === res.body.id)).toBe(true);
    });

    it("creates a product without category and returns 201", async () => {
      const payload = {
        name: "Prodotto senza categoria",
        price: 9.5,
      };

      const res = await request(createApp())
        .post("/api/products")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe(payload.name);
      expect(res.body.price).toBe(payload.price);
      expect(typeof res.body.id).toBe("number");
      expect(res.body.category).toBeUndefined();
    });

    it("returns 400 when validation fails (negative price)", async () => {
      const payload = {
        name: "Prodotto non valido",
        price: -10,
      };

      const res = await request(createApp())
        .post("/api/products")
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(Array.isArray(res.body.details)).toBe(true);
      expect(res.body.details.length).toBeGreaterThan(0);
    });

    it("returns 400 when validation fails (missing name)", async () => {
      const payload = {
        price: 10,
      };

      const res = await request(createApp())
        .post("/api/products")
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(Array.isArray(res.body.details)).toBe(true);
      expect(res.body.details.length).toBeGreaterThan(0);
    });

    it("returns 500 when an unexpected error occurs", async () => {
      jest.spyOn(products, "push").mockImplementation(() => {
        throw new Error("Unexpected failure");
      });

      const payload = {
        name: "Prodotto valido",
        price: 10,
      };

      const res = await request(createApp())
        .post("/api/products")
        .send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });
});
