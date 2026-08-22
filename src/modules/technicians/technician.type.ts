import type z from "zod";
import type {
  availabilitySlotSchema,
  getTechnicianProfilesSchema,
  getTechnicianSchema,
} from "./technician.validation";

export type TGetTechnicianProfilesQuery = z.infer<
  typeof getTechnicianProfilesSchema
>["query"];
export type TechnicianProfileId = z.infer<
  typeof getTechnicianSchema
>["params"]["id"];
export type TAvailabilitySlot = z.infer<typeof availabilitySlotSchema>["body"];
