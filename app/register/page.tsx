"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, LoaderCircle, UserRound } from "lucide-react";

import { AuthPageShell } from "@/components/auth-page-shell";
import { Button } from "@/components/ui/button";
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
    <AuthPageShell
      eyebrow="Get started"
      title="Create your account"
      description="Choose a username and password to set up your Workspace access."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-700 underline-offset-4 transition hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-slate-800">
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
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-sm shadow-slate-900/[0.02] focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-800">
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
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-sm shadow-slate-900/[0.02] focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
              required
            />
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-slate-950 text-white transition-colors hover:bg-slate-800"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
          {isSubmitting ? (
            <LoaderCircle className="ml-auto size-4 animate-spin" />
          ) : (
            <ArrowRight className="ml-auto size-4" />
          )}
        </Button>
      </form>
    </AuthPageShell>
  );
}
