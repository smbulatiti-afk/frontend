"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, LogOut, ShieldCheck } from "lucide-react";

import { PositionsManager } from "@/components/positions-manager";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getCurrentUser } from "@/lib/api";
import { getStoredAuth, type AuthUser } from "@/lib/auth";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuthGuard();
  const [profile, setProfile] = useState<AuthUser | null>(user ?? getStoredAuth().user);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        setProfile(currentUser);
      } catch {
        setProfile(user);
      }
    };

    void loadProfile();
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div
          role="status"
          className="flex items-center gap-3 text-sm font-medium text-slate-600"
        >
          <LoaderCircle className="size-4 animate-spin text-indigo-700" />
          Loading your workspace...
        </div>
      </main>
    );
  }

  const accountName = profile?.name ?? profile?.username ?? "Account";
  const accountInitial = accountName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-indigo-700" strokeWidth={1.8} />
            <span className="font-semibold tracking-tight text-slate-900">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-medium text-slate-800">
                {accountName}
              </p>
              <p className="text-xs text-slate-500">{profile?.role ?? "Member"}</p>
            </div>
            <div
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
            >
              {accountInitial}
            </div>
            <Button
              variant="ghost"
              onClick={signOut}
              className="h-9 gap-2 rounded-lg px-3 text-slate-600 hover:bg-slate-200/70 hover:text-slate-950"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <section className="py-9 sm:py-11">
          <p className="text-sm font-medium text-indigo-700">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Manage the positions used across your organization.
          </p>
        </section>

        <section className="pb-12">
          <PositionsManager enabled={!loading && Boolean(user)} />
        </section>
      </div>
    </main>
  );
}
