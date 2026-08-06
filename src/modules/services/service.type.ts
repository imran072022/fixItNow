import { z } from "zod";
import type { serviceSchema } from "./service.validation";
export type servicePayload = z.infer<typeof serviceSchema>["body"];
