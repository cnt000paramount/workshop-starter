import { z } from "zod";
import { createHttpError } from "./httpError";

/**
 * Validates a request body against a Zod schema, mapping a `ZodError` to a
 * 400 `HttpError`. Centralizes the validation-error contract so each service
 * doesn't repeat the same try/catch.
 *
 * @param withDetails when true, the Zod issues are attached as `details` on the
 *   error (products contract); when false they are omitted (orders contract).
 */
export function validateBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
  withDetails = false,
): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createHttpError(
        "Validation failed",
        400,
        withDetails ? error.errors : undefined,
      );
    }
    throw error;
  }
}
