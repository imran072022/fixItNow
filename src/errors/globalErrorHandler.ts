import type { ErrorRequestHandler } from "express";

import { AppError } from "../errors/AppError.js";
import { isPrismaError } from "./isPrismaError.js";
import { handlePrismaError } from "./handlePrismaError.js";
import type { TErrorResponse } from "../types/errorResponse.types.js";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  let formattedError: TErrorResponse;

  if (isPrismaError(error)) {
    formattedError = handlePrismaError(error);
  } else if (error instanceof AppError) {
    formattedError = {
      statusCode: error.statusCode,
      message: error.message,
    };
  } else if (error instanceof Error) {
    formattedError = {
      statusCode: 500,
      message: "Something went wrong.",
    };
  } else {
    formattedError = {
      statusCode: 500,
      message: "Something went wrong.",
    };
  }

  res.status(formattedError.statusCode).json({
    success: false,
    statusCode: formattedError.statusCode,
    message: formattedError.message,
  });
};
