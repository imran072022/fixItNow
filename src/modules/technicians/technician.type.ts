import type z from "zod";
import type {
  availabilitySlotSchema,
  getTechnicianSchema,
} from "./technician.validation";

export type TechnicianProfileId = z.infer<
  typeof getTechnicianSchema
>["params"]["id"];

export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>["body"];
