import { Prisma } from "../../prisma/generated/prisma/client.js";
import type { TErrorResponse } from "../types/error.types.js";
import buildErrorDetails from "../utils/buildErrorDetails.js";
import getCleanErrorMessage from "../utils/getCleanErrorMessage.js";

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
    let message = getCleanErrorMessage(error.message);

    switch (error.code) {
      case "P2002": {
        statusCode = 409;

        const target = error.meta?.target;

        if (Array.isArray(target)) {
          message = `${target.join(", ")} already exists.`;
        }

        break;
      }

      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed.";
        break;

      case "P2025":
        statusCode = 404;
        message = "Requested resource not found.";
        break;
    }

    return {
      statusCode,
      message,
      errorCode: error.code,
      ...buildErrorDetails(error),
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: getCleanErrorMessage(error.message),
      ...buildErrorDetails(error),
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: getCleanErrorMessage(error.message),
      ...buildErrorDetails(error),
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      statusCode: 500,
      message: getCleanErrorMessage(error.message),
      ...buildErrorDetails(error),
    };
  }

  return {
    statusCode: 500,
    message: getCleanErrorMessage(error.message),
    ...buildErrorDetails(error),
  };
};
