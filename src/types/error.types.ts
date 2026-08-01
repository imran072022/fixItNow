export type TErrorResponse = {
  statusCode: number;
  message: string;
  errorName: string;
  errorCode?: string;
  location?: string;
};
