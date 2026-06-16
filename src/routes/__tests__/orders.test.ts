import request from "supertest";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { createApp } from "../../app";
import { orders } from "../../data/orders";

describe("Orders routes", () => {
  const initialOrdersSnapshot = orders.map((order) => ({ ...order }));

  beforeEach(() => {
    orders.splice(
      0,
      orders.length,
      ...initialOrdersSnapshot.map((order) => ({ ...order })),
    );
    jest.restoreAllMocks();
  });

  describe("GET /api/orders", () => {
    it("returns 400 when page query param is missing", async () => {
      const res = await request(createApp()).get("/api/orders?limit=10");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid page parameter" });
    });

    it("returns 400 when page is not a number", async () => {
      const res = await request(createApp()).get(
        "/api/orders?page=abc&limit=10",
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid page parameter" });
    });

    it("returns 400 when page is negative", async () => {
      const res = await request(createApp()).get(
        "/api/orders?page=-1&limit=10",
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid page parameter" });
    });

    it("returns 400 when limit query param is missing", async () => {
      const res = await request(createApp()).get("/api/orders?page=1");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid limit parameter (max 100)" });
    });

    it("returns 400 when limit is greater than 100", async () => {
      const res = await request(createApp()).get(
        "/api/orders?page=1&limit=101",
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid limit parameter (max 100)" });
    });

    it("returns paginated orders when page and limit are valid", async () => {
      const res = await request(createApp()).get("/api/orders?page=1&limit=2");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(orders.slice(0, 2));
    });
  });

  describe("POST /api/orders", () => {
    it("creates an order with status and returns 201", async () => {
      const payload = {
        customerName: "Emma Wilson",
        total: 79.99,
        status: "paid",
      };

      const res = await request(createApp()).post("/api/orders").send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        customerName: payload.customerName,
        total: payload.total,
        status: payload.status,
      });
      expect(typeof res.body.id).toBe("number");
      expect(orders.some((order) => order.id === res.body.id)).toBe(true);
    });

    it("creates an order without status and returns 201", async () => {
      const payload = {
        customerName: "Noah Brown",
        total: 24.5,
      };

      const res = await request(createApp()).post("/api/orders").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.customerName).toBe(payload.customerName);
      expect(res.body.total).toBe(payload.total);
      expect(typeof res.body.id).toBe("number");
      expect(res.body.status).toBeUndefined();
    });

    it("returns 400 when validation fails for negative total", async () => {
      const payload = {
        customerName: "Invalid Order",
        total: -1,
      };

      const res = await request(createApp()).post("/api/orders").send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Validation failed" });
    });

    it("returns 400 when validation fails for missing customerName", async () => {
      const payload = {
        total: 15,
      };

      const res = await request(createApp()).post("/api/orders").send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Validation failed" });
    });

    it("returns 500 when an unexpected error occurs", async () => {
      jest.spyOn(orders, "push").mockImplementation(() => {
        throw new Error("Unexpected failure");
      });

      const payload = {
        customerName: "Valid Order",
        total: 15,
      };

      const res = await request(createApp()).post("/api/orders").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });
});
