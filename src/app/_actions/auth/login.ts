"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import type { AuthResponse } from "@/app/_actions/auth/types";
import config from "@/config";
import { createSession, deleteSession } from "@/lib/auth/session";
import { loginFormValidationSchema } from "@/lib/validation/login-form-validation-schema";

export async function loginAction(
  data: z.infer<typeof loginFormValidationSchema>,
): Promise<boolean | null> {
  const validation = validateFields(data);
  if (!validation) return false;
  const response = await fetch(`${config.BASE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });
  if (!response.ok) return null;
  const loginData = (await response.json()) as AuthResponse;
  if (!loginData.ok) return false;
  await createSession({
    accessToken: loginData.token,
    refreshToken: loginData.refreshToken,
    id: loginData.id,
  });
  return true;
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

function validateFields(
  values: z.infer<typeof loginFormValidationSchema>,
): boolean {
  const validatedFields = loginFormValidationSchema.safeParse({
    email: values.email,
    password: values.password,
  });

  return validatedFields.success;
}
