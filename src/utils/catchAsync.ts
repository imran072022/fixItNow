import type { NextFunction, Request, Response } from "express";

// const catchAsync =
//   (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };

const catchAsync = <L extends Record<string, any> = Record<string, any>>(
  fn: (
    req: Request,
    res: Response<unknown, L>,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return (req: Request, res: Response<unknown, L>, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
