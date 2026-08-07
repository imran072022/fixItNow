import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import { bookingRoutes } from "./modules/bookings/bookings.route";
import { categoryRoutes } from "./modules/categories/category.route";
import { paymentRoutes } from "./modules/payments/payments.route";
import { serviceRoutes } from "./modules/services/service.route";
import { reviewRoutes } from "./modules/reviews/reviews.route";
import { technicianRoutes } from "./modules/technicians/technician.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./errors/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", serviceRoutes);
app.use("/api", reviewRoutes);
app.use("/api", technicianRoutes);
app.use("/api/admin", adminRoutes);

// 404 Not Found Middleware
app.use(notFound);
app.use(globalErrorHandler);
export default app;
