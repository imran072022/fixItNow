import z from "zod";

export const reviewSchema = z.object({
  body: z
    .object({
      bookingId: z.uuid("Invalid booking ID"),
      rating: z
        .number()
        .int("Rating must be a whole number")
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5"),
      review: z.string().trim().max(100, "Review can't exceed 100 characters"),
    })
    .strict(),
});
