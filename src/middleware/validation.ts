import type { APIContext } from "astro";
import { createErrorResponse } from "../lib/api/error-handling";
import type { z } from "zod";

export async function validateRequest<T extends z.ZodType>(
  context: APIContext,
  schema: T,
  source: "query" | "body" = "query"
): Promise<z.infer<T> | Response> {
  try {
    let data: unknown;

    if (source === "query") {
      const url = new URL(context.request.url);
      data = Object.fromEntries(url.searchParams);
    } else {
      const contentType = context.request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await context.request.json();
      } else {
        return createErrorResponse(400, "Invalid content type. Expected application/json");
      }
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      return createErrorResponse(400, "Validation error", {
        errors: result.error.errors,
      });
    }

    return result.data;
  } catch (error) {
    return createErrorResponse(400, "Invalid request data", error);
  }
}
