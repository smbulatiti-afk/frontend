import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex h-20 items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-indigo-700" strokeWidth={1.8} />
            <span className="font-semibold tracking-tight text-slate-900">Workspace</span>
          </div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            Secure account access
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <section className="w-full max-w-[400px]">
            <p className="text-sm font-medium text-indigo-700">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-7 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
              {footer}
            </div>
          </section>
        </div>

        <footer className="border-t border-slate-200/80 py-5 text-center text-xs text-slate-500">
          Workspace
        </footer>
      </div>
    </main>
  );
}
