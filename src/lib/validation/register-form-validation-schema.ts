import { z } from "zod";

export const registerFormValidationSchema = z
  .object({
    firstName: z
      .string()
      .regex(/^[a-zA-Z0-9šćčžđŠĆČŽĐ]+$/, "Please use only letters and numbers")
      .min(2)
      .max(50),
    lastName: z
      .string()
      .regex(/^[a-zA-Z0-9šćčžđŠĆČŽĐ]+$/, "Please use only letters and numbers")
      .min(2)
      .max(50),
    email: z.email("Please input valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(24, "Password can be 24 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).*$/,
        "Please use at least one number and one letter",
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(24, "Password can be 24 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).*$/,
        "Please use at least one number letter",
      ),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Password must match",
      path: ["confirmPassword"],
    },
  );
