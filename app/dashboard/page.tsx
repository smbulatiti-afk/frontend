"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CircleUserRound,
  Fingerprint,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/api";
import { getStoredAuth, type AuthUser } from "@/lib/auth";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <LoaderCircle className="size-4 animate-spin text-indigo-600" />
          Loading your account...
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f4f6fb] px-4 py-6 sm:px-8 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 -top-40 -z-10 size-[34rem] rounded-full bg-indigo-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-32 -z-10 size-[32rem] rounded-full bg-sky-200/30 blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        <header className="mb-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-950 text-indigo-200 shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-semibold tracking-tight text-slate-950">
                Workspace
              </p>
              <p className="text-xs text-slate-500">Account center</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={signOut}
            className="h-10 gap-2 rounded-xl border-slate-200 bg-white/80 px-4 text-slate-700 hover:bg-white"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </header>

        <div className="space-y-6">
          <Card className="relative overflow-hidden rounded-[1.75rem] border-0 bg-slate-950 text-white shadow-xl shadow-indigo-950/10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.42),transparent_35%),radial-gradient(circle_at_5%_100%,rgba(14,165,233,0.2),transparent_40%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-32 size-96 rounded-full border border-white/10"
            />
            <CardContent className="relative flex flex-col justify-between gap-8 p-6 sm:p-9 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
                  <LayoutDashboard className="size-3.5" />
                  Your dashboard
                </div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome back, {profile?.username ?? "there"}
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                  Here’s a quick look at your account and sign-in status.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Check className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">You’re signed in</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Account access is active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  Overview
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Account details
                </h2>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                <Sparkles className="size-3.5 text-indigo-500" />
                Synced with your account
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50">
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-5 pt-5">
                  <div>
                    <CardDescription>Username</CardDescription>
                    <CardTitle className="mt-1.5 text-base font-semibold text-slate-950">
                      Your profile
                    </CardTitle>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <CircleUserRound className="size-5" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-4">
                  <p className="truncate text-lg font-semibold text-slate-900">
                    {profile?.username ?? "Not available"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Your account identifier
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50">
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-5 pt-5">
                  <div>
                    <CardDescription>Role</CardDescription>
                    <CardTitle className="mt-1.5 text-base font-semibold text-slate-950">
                      Access level
                    </CardTitle>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Fingerprint className="size-5" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-4">
                  <p className="text-lg font-semibold text-slate-900">
                    {profile?.role ?? "User"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Permissions for this account
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50">
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-5 pt-5">
                  <div>
                    <CardDescription>Status</CardDescription>
                    <CardTitle className="mt-1.5 text-base font-semibold text-slate-950">
                      Sign-in status
                    </CardTitle>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="size-5" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-4">
                  <p className="text-lg font-semibold text-emerald-700">
                    Authenticated
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Your session is active
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="rounded-2xl border-slate-200/80 bg-white/70 shadow-none">
            <CardContent className="flex items-start gap-3 p-4 sm:items-center sm:px-5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Your account is ready
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Your profile details are available here whenever you need them.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
