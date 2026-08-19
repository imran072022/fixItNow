import z from "zod";

export const createBookingSchema = z.object({
  body: z
    .object({
      serviceId: z.uuid("Invalid service ID"),
      bookingDate: z.iso.datetime({ offset: true }),
      location: z
        .string()
        .trim()
        .max(100, "Location cannot exceed 100 characters"),
      bookingDetails: z
        .string()
        .trim()
        .max(250, "Booking details cannot exceed 250 characters"),
    })
    .strict(),
});
