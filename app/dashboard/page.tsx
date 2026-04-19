"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const supabase = getSupabaseClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const init = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUser(user);

            // fetch recent generations
            const { data } = await supabase
                .from("generations")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            setItems(data || []);
            setLoading(false);
        };

        init();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
                    <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl" />
                    <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
                </div>
                <p className="relative text-slate-600">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/35 blur-3xl" />
                <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-violet-200/35 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-200/35 blur-3xl" />
            </div>

            {/* Sidebar */}
            <aside className="relative w-64 border-r border-white/70 bg-white/75 backdrop-blur-xl p-6 space-y-6 shadow-[0_12px_45px_rgba(99,102,241,0.12)]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    AI SaaS
                </h2>

                <nav className="space-y-2">
                    <button className="block w-full text-left px-4 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-indigo-50 transition">
                        Dashboard
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/generate")}
                        className="block w-full text-left px-4 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-indigo-50 transition"
                    >
                        Generate
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/history")}
                        className="block w-full text-left px-4 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-indigo-50 transition"
                    >
                        History
                    </button>
                </nav>
            </aside>

            {/* Main */}
            <main className="relative flex-1 p-6 space-y-6">
                {/* Top bar */}
                <div className="flex justify-between items-center rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-[0_12px_45px_rgba(99,102,241,0.12)]">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-medium shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(99,102,241,0.10)]">
                        <p className="text-sm text-slate-600">Total Generations</p>
                        <h2 className="text-3xl font-bold text-slate-800">{items.length}</h2>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(99,102,241,0.10)]">
                        <p className="text-sm text-slate-600">Account</p>
                        <h2 className="text-lg font-semibold text-slate-800">Active</h2>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(99,102,241,0.10)]">
                        <p className="text-sm text-slate-600">Plan</p>
                        <h2 className="text-lg font-semibold text-slate-800">Free</h2>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-[0_12px_45px_rgba(99,102,241,0.12)]">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Generations</h2>

                    {items.length === 0 ? (
                        <p className="text-slate-500 text-sm">No activity yet</p>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 rounded-xl border border-indigo-100 bg-white hover:bg-indigo-50/40 transition"
                                >
                                    <p className="text-sm font-medium text-slate-800">{item.prompt}</p>
                                    <p className="text-xs text-slate-500 truncate">{item.response}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}