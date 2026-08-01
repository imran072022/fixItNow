import { getErrorLocation } from "./getErrorLocation";

const buildErrorDetails = (error: Error) => {
  const details = {
    errorName: error.name,
  };

  if (!error.stack) {
    return details;
  }
  const location = getErrorLocation(error.stack);

  return {
    ...details,
    ...(location && { location }),
  };
};

export default buildErrorDetails;
