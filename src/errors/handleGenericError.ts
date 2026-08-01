import type { TErrorResponse } from "../types/error.types.js";
import buildErrorDetails from "../utils/buildErrorDetails.js";

const handleGenericError = (error: Error): TErrorResponse => {
  return {
    statusCode: 500,
    message: error.message,
    ...buildErrorDetails(error),
  };
};

export default handleGenericError;
