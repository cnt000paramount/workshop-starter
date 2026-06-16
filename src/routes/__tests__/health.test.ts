import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import { createApp } from "../../app";

// Sample test already working: demonstrates Jest + supertest setup.
// In Lab 2 you will create src/routes/__tests__/products.test.ts on the same model.
describe("GET /api/health", () => {
  it("responds with 200 and status ok", async () => {
    const res = await request(createApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
