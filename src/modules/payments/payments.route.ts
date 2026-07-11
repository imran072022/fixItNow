import { Router } from "express";
import { paymentsController } from "./payments.controller";

const router = Router();

router.post("/create", paymentsController.createPayment);
router.post("/confirm", paymentsController.confirmPayment);
router.get("/", paymentsController.getAllPayments);
router.get("/:id", paymentsController.getSinglePayment);

export const paymentRoutes = router;
