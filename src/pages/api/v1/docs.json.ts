import type { APIRoute } from "astro";
import { generateOpenAPI } from "../../../lib/api/docs";
import { compressResponse } from "../../../middleware/compression";

export const GET: APIRoute = async (context) => {
  const openapi = generateOpenAPI();
  const response = new Response(JSON.stringify(openapi, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return compressResponse(context, response);
};
