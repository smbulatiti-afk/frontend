export type AuthUser = {
  id?: string | number;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./config";

export function getStoredAuth() {
  if (typeof window === "undefined") {
    return { token: null as string | null, user: null as AuthUser | null };
  }

  try {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function saveAuthSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}
