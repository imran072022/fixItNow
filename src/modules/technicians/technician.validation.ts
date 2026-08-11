import z from "zod";
import { DayOfWeek } from "../../../prisma/generated/prisma/enums";

export const getTechnicianSchema = z.object({
  params: z
    .object({
      id: z.uuid("Invalid technician profile ID"),
    })
    .strict(),
});

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().optional(),
      photoUrl: z.string().trim().optional(),
      dob: z.coerce.date().optional(),
      location: z.string().trim().optional(),
      experience: z.number().optional(),
    })
    .strict(),
});

export const availabilitySlotSchema = z.object({
  body: z
    .object({
      dayOfWeek: z.enum([
        DayOfWeek.SUNDAY,
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
      ]),
      startMinute: z.number().int().min(0).max(1439).multipleOf(30),
      endMinute: z.number().int().min(0).max(1440).multipleOf(30),
    })
    .refine((data) => data.endMinute > data.startMinute, {
      message: "End time must be after start time",
      path: ["endMinute"],
    })
    .strict(),
});
