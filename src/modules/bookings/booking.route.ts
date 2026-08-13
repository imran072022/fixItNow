import { Router } from "express";

import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingSchema } from "./booking.validation";

const router = Router();

// users will send a request of booking to a technician
router.post(
  "/bookings",
  authentication,
  authorization("CUSTOMER"),
  validateRequest(createBookingSchema),
  bookingController.createBooking,
);

// users or technicians can see all their bookings. Admin can see all bookings (role based)
router.get("/bookings", bookingController.getAllBookings);

// users/technicians can view/get a single booking of them
router.get("/bookings/:id", bookingController.getASingleBooking);

// technician can either accept or decline request and it will change booking status
router.patch("/bookings/:id", bookingController.updateBookingStatus);

// implement later that users can track their booking status and get notified when the status changes

export const bookingRoutes = router;
