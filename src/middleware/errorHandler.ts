import { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/httpError";

export function errorHandler(
  err: Error & Partial<HttpError>,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("[errorHandler]", err.message);

  const errorResponse = {
    error: err.message,
    ...(err.details !== undefined && { details: err.details }),
  };

  res.status(err.status ?? 500).json(errorResponse);
}
