import type { ApiError } from "../../types";

export function createErrorResponse(status: number, message: string, details?: unknown): Response {
  const error: ApiError = {
    message,
    code: `ERR_${status}`,
    details: details ? { error: details } : undefined,
  };

  return new Response(JSON.stringify(error), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
