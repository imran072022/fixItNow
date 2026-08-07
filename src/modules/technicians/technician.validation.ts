import z from "zod";

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
