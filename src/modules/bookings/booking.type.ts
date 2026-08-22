import type z from "zod";
import type {
  createBookingSchema,
  getBookingParamSchema,
} from "./booking.validation";

export type BookingPayload = z.infer<typeof createBookingSchema>["body"];
export type TBookingParams = z.infer<typeof getBookingParamSchema>["params"];
