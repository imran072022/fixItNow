import { z } from "zod";
import type {
  createServiceSchema,
  getServicesSchema,
} from "./service.validation";
export type TCreateService = z.infer<typeof createServiceSchema>["body"];
export type TGetServicesQuery = z.infer<typeof getServicesSchema>["query"];
