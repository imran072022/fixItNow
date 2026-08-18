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

// router.post("/webhook", paymentController.handleWebhook); handled in app.ts
// customers can view their payment history
router.get(
  "/",
  authentication,
  authorization(Role.CUSTOMER),
  paymentController.getAllPayments,
);

export const paymentRoutes = router;
