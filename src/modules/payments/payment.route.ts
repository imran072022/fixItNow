import { Router } from "express";
import express from "express";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();
// create checkout session
router.post(
  "/create-checkout-session",
  authentication,
  authorization(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

// router.post("/webhook", paymentController.handleWebhook);
// customers can view their payment history (all payment, search/filter not implemented)
router.get(
  "/",
  authentication,
  authorization(Role.CUSTOMER),
  paymentController.getAllPayments,
);

router.post("/confirm", paymentController.confirmPayment);
router.get("/:id", paymentController.getSinglePayment);

export const paymentRoutes = router;
