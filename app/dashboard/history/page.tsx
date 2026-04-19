"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type Generation = {
    id: string;
    prompt: string;
    response: string;
    created_at: string;
    user_id: string;
};

export default function History() {
    const supabase = getSupabaseClient();
    const [items, setItems] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("User not found");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("generations")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch error:", error.message);
        } else {
            setItems(data || []);
        }

        setLoading(false);
    }, []);

    const handleDelete = async (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));

        const { error } = await supabase.from("generations").delete().eq("id", id);

        if (error) {
            console.error("Delete failed:", error.message);
            fetchData();
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen px-4 py-10 relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_45px_rgba(99,102,241,0.18)] p-6 md:p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        Generation History
                    </h1>
                    <p className="text-sm text-slate-600">
                        View and manage your previous AI generations
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        <div className="h-20 rounded-2xl bg-white/90 border border-indigo-100 animate-pulse" />
                        <div className="h-20 rounded-2xl bg-white/90 border border-indigo-100 animate-pulse" />
                        <div className="h-20 rounded-2xl bg-white/90 border border-indigo-100 animate-pulse" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center text-sm text-slate-600 rounded-2xl border border-indigo-100 bg-white p-6">
                        No history yet. Your generated results will appear here.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm hover:shadow-md transition"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-1">
                                            Prompt
                                        </p>
                                        <p className="text-sm text-slate-800 leading-relaxed">
                                            {item.prompt}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-500 mb-1">
                                            Response
                                        </p>
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {item.response}
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}