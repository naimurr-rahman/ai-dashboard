"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
    const supabase = getSupabaseClient();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!password) return;

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            password,
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Password updated successfully!");

        setTimeout(() => {
            router.push("/login");
        }, 1500);
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
                        Reset Password
                    </h1>
                    <p className="text-sm text-slate-600">
                        Enter your new password to secure your account
                    </p>
                </div>

                {/* Input */}
                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition"
                    />
                </div>

                {/* Message */}
                {message && (
                    <div className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                        {message}
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={handleUpdate}
                    disabled={loading || !password}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-medium shadow-lg shadow-indigo-200 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>

                {/* Footer links */}
                <div className="text-sm text-center">
                    <span
                        onClick={() => router.push("/login")}
                        className="text-indigo-600 cursor-pointer hover:underline"
                    >
                        Back to login
                    </span>
                </div>
            </div>
        </div>
    );
}