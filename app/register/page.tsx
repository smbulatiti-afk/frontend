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
import { registerUser } from "@/lib/api";
import { getStoredAuth, saveAuthSession } from "@/lib/auth";

export default function RegisterPage() {
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
      const data = await registerUser({
        username: form.username,
        password: form.password,
      });

      saveAuthSession(data.token, data.user);
      router.push("/dashboard");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account right now.";
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
              A good place to get started
            </div>
            <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
              Make this space yours.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">
              Create an account to bring your workspace and account details
              together in one simple place.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-300">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                <Fingerprint className="size-4" />
              </div>
              <span>Get set up in just a few moments.</span>
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
                Get started
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Create your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Choose a username and password to set up your workspace access.
              </p>
            </div>

            <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
              <CardHeader className="sr-only">
                <CardTitle>Create account</CardTitle>
                <CardDescription>Choose your username and password.</CardDescription>
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
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
                        autoComplete="new-password"
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
                    <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
                    {!isSubmitting ? <ArrowRight className="ml-auto size-4" /> : null}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-700 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
