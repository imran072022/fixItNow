import type z from "zod";
import type { updateProfileSchema } from "./profile.validation";

export type TUpdateProfile = z.infer<typeof updateProfileSchema>["body"];
