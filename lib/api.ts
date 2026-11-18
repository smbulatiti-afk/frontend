import { getStoredAuth, type AuthUser } from "./auth";
import { API_URL } from "./config";

type ApiResponse<T> = T;

export type Position = {
  id: string | number;
  positionCode: string;
  positionName: string;
  createdAt: string;
};

export type PositionInput = Pick<Position, "positionCode" | "positionName">;

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

export async function getPositions() {
  const positions = await apiRequest<unknown>("/positions");

  const isPosition = (position: unknown): position is Position =>
    typeof position === "object" &&
    position !== null &&
    "id" in position &&
    (typeof position.id === "string" || typeof position.id === "number") &&
    "positionCode" in position &&
    typeof position.positionCode === "string" &&
    "positionName" in position &&
    typeof position.positionName === "string" &&
    "createdAt" in position &&
    typeof position.createdAt === "string";

  if (!Array.isArray(positions) || !positions.every(isPosition)) {
    throw new Error("The positions API returned data in an unexpected format.");
  }

  return positions;
}

export function createPosition(position: PositionInput) {
  return apiRequest<unknown>("/positions", {
    method: "POST",
    body: JSON.stringify(position),
  });
}

export function updatePosition(id: Position["id"], position: PositionInput) {
  return apiRequest<unknown>(`/positions/${encodeURIComponent(String(id))}`, {
    method: "PUT",
    body: JSON.stringify(position),
  });
}

export function deletePosition(id: Position["id"]) {
  return apiRequest<unknown>(`/positions/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
}
