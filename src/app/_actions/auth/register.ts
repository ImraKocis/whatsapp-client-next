"use server";

import type { z } from "zod";
import type { AuthResponse } from "@/app/_actions/auth/types";
import config from "@/config";
import { createSession } from "@/lib/auth/session";
import { registerFormValidationSchema } from "@/lib/validation/register-form-validation-schema";

export async function registerAction(
  values: z.infer<typeof registerFormValidationSchema>,
) {
  const validation = validateFields(values);
  if (!validation) return false;
  const response = await fetch(`${config.BASE_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    }),
  });

  if (!response.ok) {
    console.error(
      "Error occurred while creating register",
      response.status,
      response.statusText,
    );
    return false;
  }
  const data = (await response.json()) as AuthResponse;
  if (!data.ok) {
    console.error("Response is okay, data have failed: ", data);
    return false;
  }
  await createSession({
    accessToken: data.token,
    refreshToken: data.refreshToken,
    id: data.id,
  });
  return true;
}

function validateFields(
  values: z.infer<typeof registerFormValidationSchema>,
): boolean {
  const validatedFields = registerFormValidationSchema.safeParse({
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    confirmPassword: values.password,
  });

  return validatedFields.success;
}
