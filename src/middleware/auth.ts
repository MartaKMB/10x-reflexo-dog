import type { APIContext } from "astro";
import { createErrorResponse } from "../lib/api/error-handling";

export async function requireAuth(context: APIContext) {
  const authHeader = context.request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return createErrorResponse(401, "Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await context.locals.supabase.auth.getUser(token);

    if (error || !user) {
      return createErrorResponse(401, "Invalid or expired token");
    }

    // Add user to context for use in route handlers
    context.locals.user = user;
    return null;
  } catch (error) {
    return createErrorResponse(500, "Authentication error", error);
  }
}
