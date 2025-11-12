import config from "@/config";
import { getToken } from "@/lib/auth/session";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken("access-token");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetchWithAuth(
    `${config.BASE_API_URL}/${endpoint}`,
    options,
  );
  if (!response.ok) {
    return null as T;
  }
  return await response.json();
}

export async function apiPost<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetchWithAuth(`${config.BASE_API_URL}/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function apiPatch<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetchWithAuth(`${config.BASE_API_URL}/${endpoint}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(`${config.BASE_API_URL}/${endpoint}`, {
    method: "DELETE",
  });

  if (response.status === 204) return true as T;
  return await response.json();
}
