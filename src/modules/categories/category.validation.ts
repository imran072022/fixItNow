import { z } from "zod";
export const categorySchema = z.object({
  body: z.object({
    categoryName: z
      .string()
      .trim()
      .min(3, "Category name must be at least 3 characters")
      .max(30, "Category name cannot exceed 30 characters"),
  }),
});
