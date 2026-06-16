import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error & { status?: number; details?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("[errorHandler]", err.message);

  const errorResponse = {
    error: err.message,
    ...(err.details !== undefined && { details: err.details }),
  };

  res.status(err.status || 500).json(errorResponse);
}
