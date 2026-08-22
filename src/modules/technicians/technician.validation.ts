import z from "zod";
import { DayOfWeek } from "../../../prisma/generated/prisma/enums";

export const getTechnicianProfilesSchema = z.object({
  query: z
    .object({
      search: z.string().trim().optional(),
      category: z.string().trim().optional(),
      minExperience: z.coerce.number().int().min(0).optional(),
      minRating: z.coerce.number().min(0).max(5).optional(),
      sortBy: z.enum(["experience", "rating"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
    })
    .strict(),
});
export const getTechnicianSchema = z.object({
  params: z
    .object({
      id: z.uuid("Invalid technician profile ID"),
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
        DayOfWeek.SATURDAY,
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
