import type { APIContext } from "astro";
import { createErrorResponse } from "../lib/api/error-handling";

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function cacheResponse(context: APIContext) {
  // Only cache GET requests
  if (context.request.method !== "GET") {
    return null;
  }

  const url = new URL(context.request.url);
  const cacheKey = `${url.pathname}${url.search}`;

  // Check if we have a cached response
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
      },
    });
  }

  // Store the response in cache
  const response = await context.next();
  if (response.status === 200) {
    const data = await response.clone().json();
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  return response;
}

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}, CACHE_TTL);
