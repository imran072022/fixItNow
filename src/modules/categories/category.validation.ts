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
export const categoryUpdateSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid param"),
  }),
  body: z.object({
    name: z.string().trim().min(3, "Name must be minimum 3 characters"),
  }),
});
export const categoryDeleteParamsSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid param"),
  }),
});
