import { isValidPhoneNumber } from "libphonenumber-js";
import z from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters.")
        .max(30, "Name cannot exceed 30 characters.")
        .optional(),

      phone: z
        .string()
        .trim()
        .refine((value) => isValidPhoneNumber(value), "Invalid phone number.")
        .optional(),

      photoUrl: z
        .string()
        .trim()
        .max(500, "Photo URL cannot exceed 500 characters.")
        .optional(),

      dob: z.iso
        .datetime("Invalid date of birth.")
        .refine(
          (value) => new Date(value) <= new Date(),
          "Date of birth cannot be in the future.",
        )
        .optional(),

      location: z
        .string()
        .trim()
        .max(120, "Location cannot exceed 120 characters.")
        .optional(),

      experience: z
        .number()
        .int("Experience must be a whole number.")
        .min(0, "Experience cannot be negative.")
        .max(80, "Experience cannot exceed 80 years.")
        .optional(),
    })
    .strict(),
});
