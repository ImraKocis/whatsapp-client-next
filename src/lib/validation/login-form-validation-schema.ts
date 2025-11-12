import { z } from "zod";

export const loginFormValidationSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string(),
});
