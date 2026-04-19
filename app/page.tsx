import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default async function Home() {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 text-slate-800">
      {/* Background decorative gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Hero */}
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-white/70 px-4 py-1 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
            Build Content Faster with AI
          </span>

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              AI Content Generator SaaS
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            Generate high-quality content instantly with powerful AI workflows.
            Save, manage, and reuse your prompts from a clean, modern dashboard.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 active:scale-[0.99]"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-indigo-200 bg-white/80 px-7 py-3 font-semibold text-indigo-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            Login
          </Link>
        </div>

        {/* Features */}
        <div className="mt-14 grid w-full max-w-5xl gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/75 p-6 text-left shadow-[0_8px_30px_rgba(99,102,241,0.12)] backdrop-blur">
            <h3 className="text-lg font-semibold text-slate-800">AI Generation</h3>
            <p className="mt-2 text-sm text-slate-600">
              Turn simple prompts into polished content in seconds.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/75 p-6 text-left shadow-[0_8px_30px_rgba(139,92,246,0.12)] backdrop-blur">
            <h3 className="text-lg font-semibold text-slate-800">Save History</h3>
            <p className="mt-2 text-sm text-slate-600">
              Keep every generation organized and ready to reuse.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/75 p-6 text-left shadow-[0_8px_30px_rgba(236,72,153,0.12)] backdrop-blur">
            <h3 className="text-lg font-semibold text-slate-800">Secure Access</h3>
            <p className="mt-2 text-sm text-slate-600">
              Authentication keeps your projects and data protected.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}