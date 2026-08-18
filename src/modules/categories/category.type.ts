import type z from "zod";
import type {
  categoryDeleteParamsSchema,
  categorySchema,
  categoryUpdateSchema,
} from "./category.validation";

export type CategoryPayload = z.infer<typeof categorySchema>["body"];

export type TUpdateCategoryParams = z.infer<
  typeof categoryUpdateSchema
>["params"];
export type TUpdateCategoryBody = z.infer<typeof categoryUpdateSchema>["body"];

export type TDeleteCategoryParams = z.infer<
  typeof categoryDeleteParamsSchema
>["params"];
