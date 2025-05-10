import type { APIContext } from "astro";
import { createErrorResponse } from "../lib/api/error-handling";

type RateLimitStore = Record<
  string,
  {
    count: number;
    resetTime: number;
  }
>;

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

export async function rateLimit(context: APIContext) {
  const ip = context.request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const key = `${ip}:${context.url.pathname}`;

  // Clean up expired entries
  Object.keys(store).forEach((k) => {
    if (store[k].resetTime < now) {
      delete store[k];
    }
  });

  // Initialize or get existing rate limit data
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  // Check if rate limit exceeded
  if (store[key].count >= MAX_REQUESTS) {
    return createErrorResponse(429, "Too many requests", {
      retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
    });
  }

  // Increment request count
  store[key].count++;

  // Add rate limit headers
  context.response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
  context.response.headers.set("X-RateLimit-Remaining", String(MAX_REQUESTS - store[key].count));
  context.response.headers.set("X-RateLimit-Reset", String(Math.ceil(store[key].resetTime / 1000)));

  return null;
}
