import { ZodError } from "zod";
import type { TErrorResponse } from "./error.types";

export const handleZodError = (error: ZodError): TErrorResponse => {
  return {
    statusCode: 400,
    message: "Validation failed. Please correct the highlighted fields.",
    errors: error.issues.map((issue) => ({
      field: issue.path.slice(1).join("."),
      message: issue.message,
    })),
  };
};
