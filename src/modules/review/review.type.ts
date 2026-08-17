import type z from "zod";
import type { reviewSchema } from "./review.validation";

export type TReview = z.infer<typeof reviewSchema>["body"];
