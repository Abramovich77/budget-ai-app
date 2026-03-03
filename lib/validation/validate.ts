/**
 * Validation utility functions for API endpoints
 * Provides consistent error formatting and response helpers
 */

import { NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";

/**
 * Format Zod validation errors into a user-friendly structure
 */
export function formatZodError(error: ZodError): {
  message: string;
  errors: Array<{ field: string; message: string }>;
} {
  const errors = error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return {
    message: errors[0]?.message || "Validation failed",
    errors,
  };
}

/**
 * Validate request body with Zod schema
 * Returns validated data or throws formatted error
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return validated;
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = formatZodError(error);
      throw NextResponse.json(
        {
          error: formatted.message,
          details: formatted.errors,
        },
        { status: 400 }
      );
    }
    throw error;
  }
}

/**
 * Validate query parameters with Zod schema
 * Returns validated data or throws formatted error
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): T {
  try {
    // Convert URLSearchParams to object
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const validated = schema.parse(params);
    return validated;
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = formatZodError(error);
      throw NextResponse.json(
        {
          error: formatted.message,
          details: formatted.errors,
        },
        { status: 400 }
      );
    }
    throw error;
  }
}

/**
 * Safe validation that returns result instead of throwing
 */
export async function safeValidateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<
  | { success: true; data: T }
  | { success: false; error: ReturnType<typeof formatZodError> }
> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: formatZodError(result.error) };
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Invalid JSON in request body",
        errors: [{ field: "body", message: "Could not parse JSON" }],
      },
    };
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      sanitized[key] = sanitizeHtml(value) as any;
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) =>
        typeof item === "object" && item !== null ? sanitizeObject(item) : item
      ) as any;
    }
  }

  return sanitized;
}

/**
 * Create error response with consistent format
 */
export function errorResponse(
  message: string,
  status: number = 400,
  details?: unknown
) {
  const response: { error: string; details?: unknown } = { error: message };
  if (details) {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

/**
 * Create success response with consistent format
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  message?: string
) {
  return NextResponse.json(
    {
      ...(message && { message }),
      ...data,
    },
    { status }
  );
}
