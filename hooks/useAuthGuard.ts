"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearAuthSession, getStoredAuth, type AuthUser } from "@/lib/auth";

export function useAuthGuard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, user: storedUser } = getStoredAuth();

    if (!token) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [router]);

  const signOut = () => {
    clearAuthSession();
    router.push("/login");
  };

  return { user, loading, signOut };
}
