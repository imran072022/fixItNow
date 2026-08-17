import z from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().optional(),
      phone: z
        .string()
        .trim()
        .regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number")
        .optional(),
      photoUrl: z.string().trim().optional(),
      dob: z.coerce.date().optional(),
      location: z.string().trim().optional(),
      experience: z.number().optional(),
    })
    .strict(),
});
