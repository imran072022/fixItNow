import type z from "zod";
import type {
  availabilitySlotParamSchema,
  availabilitySlotSchema,
  getTechnicianProfilesSchema,
  getTechnicianSchema,
  updateAvailabilitySchema,
} from "./technician.validation";

export type TGetTechnicianProfilesQuery = z.infer<
  typeof getTechnicianProfilesSchema
>["query"];
export type TechnicianProfileId = z.infer<
  typeof getTechnicianSchema
>["params"]["id"];
export type TAvailabilitySlot = z.infer<typeof availabilitySlotSchema>["body"];
export type TAvailabilitySlotParams = z.infer<
  typeof availabilitySlotParamSchema
>["params"];
export type TUpdateAvailability = z.infer<typeof updateAvailabilitySchema>;
