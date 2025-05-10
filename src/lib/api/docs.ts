import { z } from "zod";
import type { ReflexologyPointDTO } from "../../types";

interface EndpointDoc {
  path: string;
  method: string;
  description: string;
  parameters?: {
    name: string;
    in: "query" | "path" | "header";
    required: boolean;
    schema: z.ZodType;
  }[];
  responses: Record<
    number,
    {
      description: string;
      schema?: z.ZodType;
    }
  >;
}

const endpoints: EndpointDoc[] = [
  {
    path: "/api/v1/points",
    method: "GET",
    description: "Get a list of reflexology points with optional filtering and pagination",
    parameters: [
      {
        name: "layer",
        in: "query",
        required: false,
        schema: z.enum(["musculoskeletal", "digestive", "nervous"]),
      },
      {
        name: "system",
        in: "query",
        required: false,
        schema: z.string(),
      },
      {
        name: "page",
        in: "query",
        required: false,
        schema: z.number().int().positive(),
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: z.number().int().positive().max(100),
      },
    ],
    responses: {
      200: {
        description: "Successful response",
        schema: z.object({
          data: z.array(z.custom<ReflexologyPointDTO>()),
          meta: z.object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
          }),
        }),
      },
      400: {
        description: "Invalid query parameters",
      },
      401: {
        description: "Unauthorized",
      },
      404: {
        description: "No points found matching the criteria",
      },
      429: {
        description: "Too many requests",
      },
      500: {
        description: "Internal server error",
      },
    },
  },
];

export function generateOpenAPI() {
  const openapi = {
    openapi: "3.0.0",
    info: {
      title: "Reflexo Dog API",
      version: "1.0.0",
      description: "API for managing dog reflexology points and treatments",
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
    ],
    paths: {},
    components: {
      schemas: {
        ReflexologyPoint: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string" },
            anatomical_system: {
              type: "string",
              enum: ["musculoskeletal", "digestive", "nervous"],
            },
            coordinates: {
              type: "object",
              properties: {
                x: { type: "number" },
                y: { type: "number" },
              },
            },
            contraindications: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  };

  // Add paths from endpoint documentation
  endpoints.forEach((endpoint) => {
    const path = endpoint.path.replace("/api/v1", "");
    if (!openapi.paths[path]) {
      openapi.paths[path] = {};
    }

    openapi.paths[path][endpoint.method.toLowerCase()] = {
      summary: endpoint.description,
      parameters: endpoint.parameters?.map((param) => ({
        name: param.name,
        in: param.in,
        required: param.required,
        schema: {
          type: param.schema instanceof z.ZodNumber ? "number" : "string",
          enum: param.schema instanceof z.ZodEnum ? Object.values(param.schema.enum) : undefined,
        },
      })),
      responses: Object.entries(endpoint.responses).reduce((acc, [status, response]) => {
        acc[status] = {
          description: response.description,
          content: response.schema
            ? {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ReflexologyPoint" },
                      },
                      meta: {
                        type: "object",
                        properties: {
                          total: { type: "number" },
                          page: { type: "number" },
                          limit: { type: "number" },
                        },
                      },
                    },
                  },
                },
              }
            : undefined,
        };
        return acc;
      }, {}),
    };
  });

  return openapi;
}
