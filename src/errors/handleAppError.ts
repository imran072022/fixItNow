import { AppError } from "./AppError.js";
import type { TErrorResponse } from "../types/error.types.js";
import buildErrorDetails from "../utils/buildErrorDetails.js";

const handleAppError = (error: AppError): TErrorResponse => {
  return {
    statusCode: error.statusCode,
    message: error.message,
    ...buildErrorDetails(error),
  };
};

export default handleAppError;
