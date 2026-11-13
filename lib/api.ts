import { getStoredAuth, type AuthUser } from "./auth";
import { API_URL } from "./config";

type ApiResponse<T> = T;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const { token } = getStoredAuth();

  const headers = new Headers(options.headers ?? {});
  headers.set("Accept", "application/json");

  if (!(options.body instanceof FormData) && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: string }).message)
        : typeof payload === "object" && payload && "error" in payload
          ? String((payload as { error?: string }).error)
          : "Request failed";

    throw Object.assign(new Error(message), {
      status: response.status,
      details: payload,
    });
  }

  return payload as ApiResponse<T>;
}

export function loginUser(payload: { username: string; password: string }) {
  return apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload: {
  username: string;
  password: string;
}) {
  return apiRequest<{ token: string; user: AuthUser }>('/auth/register', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiRequest<{ user: AuthUser }>("/auth/me").then(({ user }) => user);
}
