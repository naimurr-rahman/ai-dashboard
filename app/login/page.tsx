"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
    const supabase = getSupabaseClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (!error) {
            router.push("/dashboard");
            return;
        }

        if (error.message.includes("Invalid login credentials")) {
            setError("Account not found. Please sign up.");
        } else {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
            {/* Soft decorative blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_45px_rgba(99,102,241,0.18)] p-8 space-y-6 bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-sm text-slate-600">
                        Start generating AI content instantly
                    </p>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-medium shadow-lg shadow-indigo-200 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p
                    onClick={() => router.push("/forgot-password")}
                    className="text-sm text-indigo-600 cursor-pointer hover:underline"
                >
                    Forgot password?
                </p>

                {/* Footer */}
                <p className="text-xs text-center text-slate-500">
                    By logging in, you agree to our terms and privacy policy
                </p>
            </div>
        </div>
    );
}