import { email, z } from "zod";
import { Role } from "../../../prisma/generated/prisma/enums";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(30, "Name cannot exceed 30 characters."),

    email: z
      .email("Invalid email address.")
      .transform((value) => value.trim().toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(32, "Password cannot exceed 32 characters.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/\d/, "Password must contain at least one number.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;'']/,
        "Password must contain at least one special character.",
      ),

    role: z.enum([Role.CUSTOMER, Role.TECHNICIAN]),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});
