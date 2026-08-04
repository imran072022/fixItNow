import { Prisma } from "../../prisma/generated/prisma/client.js";
import type { TErrorResponse } from "./error.types.js";

export const handlePrismaError = (
  error:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientValidationError
    | Prisma.PrismaClientInitializationError
    | Prisma.PrismaClientRustPanicError
    | Prisma.PrismaClientUnknownRequestError,
): TErrorResponse => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = 400;
    let message = "Database request failed.";

    if (error.code === "P2002") {
      statusCode = 409;
      message = "A duplicate value was provided for a unique field.";
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "The requested resource was not found.";
    } else if (error.code === "P2003") {
      message = "A related record could not be found.";
    }

    return {
      statusCode,
      message,
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: "The database query is invalid.",
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: "The database could not be initialized.",
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      statusCode: 500,
      message: "The database engine crashed.",
    };
  }

  return {
    statusCode: 500,
    message: "An unknown database error occurred.",
  };
};
