import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateRequest =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      return next(parsed.error);
    }
    next();
  };
