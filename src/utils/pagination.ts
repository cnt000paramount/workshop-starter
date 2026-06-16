import { ParsedQs } from "qs";

const MAX_LIMIT = 100;

export type PaginationParams = { page: number; limit: number };
export type PaginationError = { error: string; status: 400 };

export function parsePaginationParams(
  query: ParsedQs,
): PaginationParams | PaginationError {
  const pageParam = query.page as string;
  const limitParam = query.limit as string;

  const page = parseInt(pageParam, 10);
  const limit = parseInt(limitParam, 10);

  if (!pageParam || Number.isNaN(page) || page < 1) {
    return { error: "Invalid page parameter", status: 400 };
  }

  if (!limitParam || Number.isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
    return { error: `Invalid limit parameter (max ${MAX_LIMIT})`, status: 400 };
  }

  return { page, limit };
}

export function isPaginationError(
  result: PaginationParams | PaginationError,
): result is PaginationError {
  return "error" in result;
}
