import type z from "zod";
import type { createBookingSchema } from "./booking.validation";

export type BookingPayload = z.infer<typeof createBookingSchema>["body"];
