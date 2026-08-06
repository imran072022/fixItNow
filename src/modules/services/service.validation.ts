import { z } from "zod";

export const serviceSchema = z.object({
  body: z
    .object({
      categoryId: z.uuid("Invalid category ID"),
      name: z
        .string()
        .trim()
        .min(3, "Service name must be at least 3 characters long")
        .max(50, "Service name can't exceed 50 characters"),
      description: z
        .string()
        .trim()
        .min(30, "Service description must be at least 30 characters long")
        .max(350, "Service description can't exceed 350 characters"),

      price: z.number().positive("Price must be a positive number"),
    })
    .strict(),
});
