import type { ErrorRequestHandler } from "express";

import { AppError } from "../errors/AppError.js";
import { isPrismaError } from "./isPrismaError.js";
import { handlePrismaError } from "./handlePrismaError.js";
import type { TErrorResponse } from "../types/error.types.js";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  let formattedError: TErrorResponse;

  if (isPrismaError(error)) {
    formattedError = handlePrismaError(error);
  } else if (error instanceof AppError) {
    formattedError = {
      statusCode: error.statusCode,
      message: error.message,
      ...(error.stack ? { stack: error.stack } : {}),
    };
  } else if (error instanceof Error) {
    formattedError = {
      statusCode: 500,
      message: error.message,
      ...(error.stack ? { stack: error.stack } : {}),
    };
  } else {
    formattedError = {
      statusCode: 500,
      message: "Something went wrong.",
    };
  }

  if (isDevelopment) {
    console.error(error);
  }

  const responseBody = {
    success: false,
    statusCode: formattedError.statusCode,
    message:
      isDevelopment || error instanceof AppError
        ? formattedError.message
        : "Something went wrong.",
  };

  if (isDevelopment) {
    res.status(formattedError.statusCode).json({
      ...responseBody,
      ...(formattedError.errorCode
        ? { errorCode: formattedError.errorCode }
        : {}),
      ...(formattedError.stack ? { stack: formattedError.stack } : {}),
    });

    return;
  }

  res.status(formattedError.statusCode).json(responseBody);
};
