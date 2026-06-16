/**
 * Error carrying an HTTP status code (and optional details) so the centralized
 * `errorHandler` middleware can shape the response. Use this instead of
 * redefining ad-hoc `Error & { status }` objects in each route.
 */
export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    if (details !== undefined) {
      this.details = details;
    }
  }
}

/** Convenience factory mirroring the previous `createHttpError` helper. */
export function createHttpError(
  message: string,
  status: number,
  details?: unknown,
): HttpError {
  return new HttpError(message, status, details);
}
