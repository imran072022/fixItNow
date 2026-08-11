import type z from "zod";
import type {
  availabilitySlotSchema,
  getTechnicianSchema,
  updateProfileSchema,
} from "./technician.validation";

export type TechnicianProfileId = z.infer<
  typeof getTechnicianSchema
>["params"]["id"];

export type TUpdateProfile = z.infer<typeof updateProfileSchema>["body"];
export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>["body"];
