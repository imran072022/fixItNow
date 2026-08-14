import { Router } from "express";
import express from "express";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-checkout-session",
  authentication,
  authorization(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

// router.post("/webhook", paymentController.handleWebhook);
router.post("/confirm", paymentController.confirmPayment);
router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getSinglePayment);

export const paymentRoutes = router;
