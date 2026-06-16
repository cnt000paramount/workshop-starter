export function createHttpError(
  message: string,
  status: number,
  details?: unknown,
): Error & { status: number; details?: unknown } {
  const error = new Error(message) as Error & {
    status: number;
    details?: unknown;
  };
  error.status = status;
  if (details !== undefined) {
    error.details = details;
  }
  return error;
}
