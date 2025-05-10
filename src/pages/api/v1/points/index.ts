import { z } from "zod";
import type { APIRoute } from "astro";
import type { ApiListResponse, ReflexologyPointDTO } from "../../../../types";
import { createErrorResponse } from "../../../../lib/api/error-handling";
import { logRequest } from "../../../../lib/api/logging";

// Query parameter validation schema
const querySchema = z.object({
  layer: z.enum(["musculoskeletal", "digestive", "nervous"]).optional(),
  system: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const GET: APIRoute = async (context) => {
  const startTime = Date.now();
  let status = 200;

  try {
    // Parse and validate query parameters
    const url = new URL(context.request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const validatedParams = querySchema.safeParse(queryParams);

    if (!validatedParams.success) {
      status = 400;
      const error = createErrorResponse(400, "Invalid query parameters", validatedParams.error);
      logRequest(context, startTime, status, validatedParams.error);
      return error;
    }

    const { layer, system, page, limit } = validatedParams.data;
    const offset = (page - 1) * limit;

    // Construct the database query
    let query = context.locals.supabase.from("reflexology_points").select("*", { count: "exact" });

    // Apply filters if provided
    if (layer) {
      query = query.eq("anatomical_system", layer);
    }
    if (system) {
      query = query.eq("system", system);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      status = 500;
      const errorResponse = createErrorResponse(500, "Database error", error);
      logRequest(context, startTime, status, error);
      return errorResponse;
    }

    // Handle empty results
    if (!data || data.length === 0) {
      status = 404;
      const errorResponse = createErrorResponse(404, "No points found matching the criteria");
      logRequest(context, startTime, status);
      return errorResponse;
    }

    // Transform the response
    const response: ApiListResponse<ReflexologyPointDTO> = {
      data: data as ReflexologyPointDTO[],
      meta: {
        total: count || 0,
        page,
        limit,
      },
    };

    logRequest(context, startTime, status);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    status = 500;
    const errorResponse = createErrorResponse(500, "Internal server error", error);
    logRequest(context, startTime, status, error);
    return errorResponse;
  }
};
