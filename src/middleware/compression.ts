import type { APIContext } from "astro";

const COMPRESSIBLE_TYPES = [
  "application/json",
  "text/plain",
  "text/html",
  "text/css",
  "text/javascript",
  "application/javascript",
];

export async function compressResponse(context: APIContext, response: Response): Promise<Response> {
  // Check if response should be compressed
  const contentType = response.headers.get("content-type");
  if (!contentType || !COMPRESSIBLE_TYPES.some((type) => contentType.includes(type))) {
    return response;
  }

  // Check if client accepts compression
  const acceptEncoding = context.request.headers.get("accept-encoding");
  if (!acceptEncoding?.includes("gzip")) {
    return response;
  }

  // Clone the response to avoid consuming it
  const clonedResponse = response.clone();
  const content = await clonedResponse.text();

  // Compress the content
  const encoder = new TextEncoder();
  const compressed = await compress(encoder.encode(content));

  // Create new response with compressed content
  return new Response(compressed, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      "Content-Encoding": "gzip",
      "Content-Length": String(compressed.length),
    },
  });
}

async function compress(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  const reader = cs.readable.getReader();

  // Write data to the compression stream
  await writer.write(data);
  await writer.close();

  // Read compressed data
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // Combine chunks into single Uint8Array
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}
