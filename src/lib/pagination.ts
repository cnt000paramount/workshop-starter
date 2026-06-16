import { Request } from "express";
import { createHttpError } from "./httpError";

export interface Pagination {
  page: number;
  limit: number;
}

/**
 * Parses and validates `page`/`limit` query params shared by list endpoints.
 *
 * Rules (kept identical to the original inline validation so error contracts
 * don't change): both are required, `page >= 1`, `1 <= limit <= 100`.
 *
 * @throws HttpError 400 with a specific message on invalid input.
 */
export function parsePagination(req: Request): Pagination {
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;

  const page = parseInt(pageParam, 10);
  const limit = parseInt(limitParam, 10);

  if (!pageParam || Number.isNaN(page) || page < 1) {
    throw createHttpError("Invalid page parameter", 400);
  }

  if (!limitParam || Number.isNaN(limit) || limit < 1 || limit > 100) {
    throw createHttpError("Invalid limit parameter (max 100)", 400);
  }

  return { page, limit };
}

/** Returns the slice of `items` for the given pagination window. */
export function paginate<T>(items: T[], { page, limit }: Pagination): T[] {
  const startIndex = (page - 1) * limit;
  return items.slice(startIndex, startIndex + limit);
}
