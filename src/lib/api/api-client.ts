import { getSession } from "@/lib/auth/session";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const session = await getSession();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      ...(session.jwt && { Authorization: `Bearer ${session.jwt}` }),
    },
  });
}

export async function apiGet<T>(
  endpoint: string,
  fetchTag?: string,
): Promise<T> {
  const response = await fetchWithAuth(
    `${process.env.API_BASE_URL}${endpoint}`,
    fetchTag ? { next: { tags: [fetchTag] } } : undefined,
  );
  if (!response.ok) {
    return null as T;
  }
  return await response.json();
}

export async function apiPost<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetchWithAuth(
    `${process.env.API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  return await response.json();
}

export async function apiPatch<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetchWithAuth(
    `${process.env.API_BASE_URL}${endpoint}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );

  return await response.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(
    `${process.env.API_BASE_URL}${endpoint}`,
    {
      method: "DELETE",
    },
  );

  if (response.status === 204) return true as T;
  return await response.json();
}
