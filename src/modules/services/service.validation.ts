import { z } from "zod";

export const createServiceSchema = z.object({
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
export const getServicesSchema = z.object({
  query: z
    .object({
      search: z.string().trim().optional(),
      category: z.string().trim().optional(),
      minPrice: z.coerce.number().int().min(0).optional(),
      maxPrice: z.coerce.number().int().min(0).optional(),
      sortBy: z.enum(["price", "createdAt"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
    })
    .strict()
    .refine(
      (data) =>
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.maxPrice >= data.minPrice,
      {
        message: "maxPrice must be greater than or equal to minPrice",
        path: ["maxPrice"],
      },
    ),
});
