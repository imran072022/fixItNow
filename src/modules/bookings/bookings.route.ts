import { Router } from "express";
import { bookingsController } from "./bookings.controller";

const router = Router();

// users will send a request of booking to a technician
router.post("/bookings", bookingsController.createBooking);

// users or technicians can see all their bookings. Admin can see all bookings (role based)
router.get("/bookings", bookingsController.getAllBookings);

// users/technicians can view/get a single booking of them
router.get("/bookings/:id", bookingsController.getASingleBooking);

// technician can either accept or decline request and it will change booking status
router.patch("/bookings/:id", bookingsController.updateBookingStatus);

// implement later that users can track their booking status and get notified when the status changes

export const bookingRoutes = router;
