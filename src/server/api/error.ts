import { TRPCError } from "@trpc/server";

export class NotFoundError extends TRPCError {
  constructor(message: string = "Not found") {
    super({ code: "NOT_FOUND", message });
  }
}

export class UnauthorizedError extends TRPCError {
  constructor(message: string) {
    super({ code: "UNAUTHORIZED", message });
  }
}

export class BadRequestError extends TRPCError {
  constructor(message: string) {
    super({ code: "BAD_REQUEST", message });
  }
}

export class InternalServerError extends TRPCError {
  constructor(message: string) {
    super({ code: "INTERNAL_SERVER_ERROR", message });
  }
}

export class ForbiddenError extends TRPCError {
  constructor(message: string) {
    super({ code: "FORBIDDEN", message });
  }
}

export class TooManyRequestsError extends TRPCError {
  constructor(message: string) {
    super({ code: "TOO_MANY_REQUESTS", message });
  }
}
