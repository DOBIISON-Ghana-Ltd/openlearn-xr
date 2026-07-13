import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { JSend } from "./jsend";
import { Prisma } from "@/generated/prisma/client";

type RouteHandler<TParams = any> = (
  req: NextRequest,
  ctx: { params: Promise<TParams> }
) => Promise<NextResponse>;

/**
 * Parses and handles errors globally, returning a standardized JSend response.
 */
export function handleApiError(error: any) {
  // 1. Zod Validation Errors
  if (error instanceof z.ZodError) {
    const errorDetails = JSON.stringify(error.flatten());
    return JSend.error(`Validation Error: ${errorDetails}`, 400);
  }

  // 2. Prisma Known Request Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return JSend.error("Conflict: Record already exists", 409);
      case "P2025":
        return JSend.error("Not Found: Record does not exist", 404);
      default:
        return JSend.error(`Database Error: ${error.message}`, 500);
    }
  }

  // 3. Prisma Validation Errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return JSend.error("Database Validation Error", 400);
  }

  // 4. Custom or Generic Errors
  const message = error?.message || "Internal Server Error";
  const statusCode = error?.statusCode || error?.status || 500;
  const code = typeof error?.code === 'number' ? error.code : undefined;

  return JSend.error(message, statusCode, code);
}

/**
 * Global wrapper for public API routes.
 * Catches errors and formats them using JSend.
 */
export function apiHandler<TParams>(handler: RouteHandler<TParams>) {
  return async (req: NextRequest, ctx: { params: Promise<TParams> }) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
