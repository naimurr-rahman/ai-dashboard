"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSignup = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // STEP 1: Check if user already exists (try login)
            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            if (!loginError) {
                setError("Email already exists. Please login.");
                setLoading(false);
                return;
            }

            // STEP 2: Signup new user
            const { error: signupError } =
                await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: "http://localhost:3000/dashboard",
                    },
                });

            if (signupError) {
                setError(signupError.message);
                setLoading(false);
                return;
            }

            // STEP 3: Show success message
            setSuccess("Check your email to confirm signup.");
        } catch (err: any) {
            setError("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_45px_rgba(99,102,241,0.18)] p-8 space-y-6">

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
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">
                        {success}
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-medium shadow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                {/* Footer */}
                <p className="text-xs text-center text-slate-500">
                    Already have an account?{" "}
                    <span
                        onClick={() => router.push("/login")}
                        className="text-indigo-600 cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
}