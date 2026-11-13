"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import { getStoredAuth, saveAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getStoredAuth().token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleChange = (field: "username" | "password", value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await loginUser({
        username: form.username,
        password: form.password,
      });

      saveAuthSession(data.token, data.user);
      router.push("/dashboard");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6fb] px-4 py-6 sm:px-8 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[-7rem] size-[24rem] rounded-full bg-indigo-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-20 size-[28rem] rounded-full bg-sky-200/40 blur-3xl"
      />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_32px_100px_-48px_rgba(15,23,42,0.35)] lg:min-h-[720px] lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-14">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.34),transparent_35%),radial-gradient(circle_at_15%_90%,rgba(14,165,233,0.2),transparent_38%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 top-1/3 size-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 top-[38%] size-56 rounded-full border border-white/10"
          />

          <div className="relative flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-indigo-200 shadow-inner shadow-white/10">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Workspace</span>
          </div>

          <div className="relative max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-100">
              <Sparkles className="size-3.5" />
              A clearer space to get things done
            </div>
            <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
              Good to have you back.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">
              Sign in to pick up right where you left off and see your account
              at a glance.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-300">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                <Fingerprint className="size-4" />
              </div>
              <span>One account, ready when you are.</span>
            </div>
          </div>

          <p className="relative text-xs text-slate-500">
            A simple, secure way to access your workspace.
          </p>
        </aside>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-950 text-indigo-200">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-base font-semibold tracking-tight text-slate-900">
                Workspace
              </span>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-indigo-600">
                Welcome back
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Sign in to your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details below to continue to your dashboard.
              </p>
            </div>

            <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
              <CardHeader className="sr-only">
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Enter your username and password.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 sm:p-7">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700">
                      Username
                    </Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="username"
                        type="text"
                        value={form.username}
                        onChange={(event) => handleChange("username", event.target.value)}
                        placeholder="Your username"
                        autoComplete="username"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-10 focus-visible:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">
                      Password
                    </Label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-10 focus-visible:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {error ? (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                    >
                      {error}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-slate-950 text-white shadow-sm hover:bg-slate-800"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
                    {!isSubmitting ? <ArrowRight className="ml-auto size-4" /> : null}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="mt-7 text-center text-sm text-slate-500">
              New to Workspace?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-700 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
