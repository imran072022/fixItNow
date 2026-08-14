import { Router } from "express";
import { paymentsController } from "./payment.controller";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
  "/create-checkout-session",
  authentication,
  authorization(Role.CUSTOMER),
  paymentsController.createCheckoutSession,
);

router.post("/confirm", paymentsController.confirmPayment);
router.get("/", paymentsController.getAllPayments);
router.get("/:id", paymentsController.getSinglePayment);

export const paymentRoutes = router;
