import type z from "zod";
import type { categorySchema } from "./category.validation";

export type CategoryPayload = z.infer<typeof categorySchema>["body"];
