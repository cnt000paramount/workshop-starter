import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) {
  console.error('[errorHandler]', err.message);
  res.status(err.status || 500).json({ error: err.message });
}
