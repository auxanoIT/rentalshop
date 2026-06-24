import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message: string, details?: unknown) {
  return new AppError(message, 400, "BAD_REQUEST", details);
}

export function unauthorized(message = "Authentication required") {
  return new AppError(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "Access denied") {
  return new AppError(message, 403, "FORBIDDEN");
}

export function notFound(message = "Not found") {
  return new AppError(message, 404, "NOT_FOUND");
}

export function conflict(message: string, details?: unknown) {
  return new AppError(message, 409, "CONFLICT", details);
}

export function rateLimited(message = "Too many requests") {
  return new AppError(message, 429, "RATE_LIMITED");
}

export function toErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request payload",
          issues: error.flatten()
        }
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    );
  }

  console.error(error);

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong"
      }
    },
    { status: 500 }
  );
}
