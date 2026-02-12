
"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, CheckCircle, Database, Calendar, DollarSign, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        price: "",
    });

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✨ Event created successfully!");
                setFormData({ title: "", date: "", price: "" });
                setTimeout(() => router.push("/events"), 2000);
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (err) {
            setMessage("❌ Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/seed");
            const data = await res.json();
            setMessage("✅ Database reset and seeded!");
            router.refresh();
        } catch (err) {
            setMessage("❌ Failed to seed database");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Create New Event
                </h1>
                <p className="text-gray-400 font-light">Add a new experience to the EventHorizon platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Event Name</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Summer Jazz Festival"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Event Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                                    <input
                                        required
                                        type="datetime-local"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-500 outline-none transition-all text-white"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Ticket Price ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="49.99"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-white"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 text-lg uppercase tracking-widest active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-6 h-6" /> Create Event Now</>}
                        </button>
                    </form>
                </div>

                {/* Quick Tools Section */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Quick Actions
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={handleSeed}
                                disabled={loading}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                            >
                                <Database className="w-4 h-4" /> RESET & SEED DB
                            </button>
                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter text-center">
                                Warning: Resetting wipes all custom data.
                            </p>
                        </div>
                    </div>

                    <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-3xl">
                        <h4 className="font-bold text-purple-400 text-sm mb-2 uppercase tracking-widest">Admin Tip</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Newly created events will use default placeholders for description, location, and images to keep it quick. You can edit these details later in management.
                        </p>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`mt-8 p-4 rounded-2xl text-center font-bold animate-pulse border ${message.includes('Error') || message.includes('Failed')
                        ? 'bg-red-500/10 border-red-500/20 text-red-500'
                        : 'bg-green-500/10 border-green-500/20 text-green-500'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
