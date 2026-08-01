import type { ErrorRequestHandler } from "express";

import { AppError } from "./AppError.js";

import { handlePrismaError } from "./handlePrismaError.js";
import { isPrismaError } from "./isPrismaError.js";
import handleAppError from "./handleAppError.js";
import handleGenericError from "./handleGenericError.js";
import config from "../config/index.js";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  let formattedError;

  if (isPrismaError(error)) {
    formattedError = handlePrismaError(error);
  } else if (error instanceof AppError) {
    formattedError = handleAppError(error);
  } else if (error instanceof Error) {
    formattedError = handleGenericError(error);
  } else {
    formattedError = {
      statusCode: 500,
      message: "Something went wrong.",
      errorName: "UnknownError",
    };
  }
  const { statusCode, ...response } = formattedError;
  const isDevelopment = config.node_env === "development";

  res.status(statusCode).json({
    success: false,
    message: response.message,

    ...(isDevelopment && {
      errorName: response.errorName,
      errorCode: response.errorCode,
      location: response.location,
    }),
  });
};
