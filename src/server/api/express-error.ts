import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends Error {
  statusCode = 400;
  constructor(message: string = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends Error {
  statusCode = 500;
  constructor(message: string = "Internal server error") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class TooManyRequestsError extends Error {
  statusCode = 429;
  constructor(message: string = "Too many requests") {
    super(message);
    this.name = "TooManyRequestsError";
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Log error
  console.error("Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      message: "Invalid input",
      errors: error.errors,
    });
  }

  // Handle custom errors
  if (
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof BadRequestError ||
    error instanceof ForbiddenError ||
    error instanceof TooManyRequestsError
  ) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
    });
  }

  // Handle InternalServerError
  if (error instanceof InternalServerError) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }

  // Default error
  return res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "An unexpected error occurred",
  });
}
