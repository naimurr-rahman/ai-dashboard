"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function Generate() {
    const supabase = getSupabaseClient();

    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            setResult(data.text || "No response generated");

            // Get user
            const {
                data: { user },
            } = await supabase.auth.getUser();

            // Save to DB
            if (user) {
                await supabase.from("generations").insert([
                    {
                        user_id: user.id,
                        prompt,
                        response: data.text,
                    },
                ]);
            }
        } catch (err) {
            setResult("Something went wrong. Try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
            </div>

            <div className="relative w-full max-w-3xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        AI Generator
                    </h1>
                    <p className="text-sm text-slate-600">
                        Generate beautiful content instantly with AI
                    </p>
                </div>

                {/* Input Card */}
                <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_45px_rgba(99,102,241,0.18)] p-6 space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Write your prompt here..."
                        className="w-full min-h-[140px] p-4 rounded-xl border border-indigo-100 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
                    />

                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">{prompt.length} characters</p>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-medium shadow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
                        >
                            {loading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_45px_rgba(99,102,241,0.18)] p-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                Result
                            </h2>

                            <button
                                onClick={() => navigator.clipboard.writeText(result)}
                                className="text-sm px-3 py-1.5 rounded-lg border border-indigo-100 text-slate-700 hover:bg-indigo-50 transition"
                            >
                                Copy
                            </button>
                        </div>

                        <div className="whitespace-pre-line text-slate-700 text-sm leading-relaxed">
                            {result}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}