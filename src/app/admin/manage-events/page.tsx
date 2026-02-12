
"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Calendar, MapPin, DollarSign, Trash2, Edit, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        title: '',
        price: 0,
        availableSeats: 0,
    });
    const router = useRouter();

    const fetchEvents = async () => {
        setLoading(true);
        const res = await fetch('/api/events-featured');
        const data = await res.json();
        setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
        fetchEvents();
    };

    const handleEdit = (event: any) => {
        setEditingId(event._id);
        setEditForm({
            title: event.title,
            price: event.price,
            availableSeats: event.availableSeats,
        });
    };

    const handleSave = async (id: string) => {
        await fetch(`/api/admin/events/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
        });
        setEditingId(null);
        fetchEvents();
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">Manage Events</h1>
                    <p className="text-gray-400">Update pricing and availability in real-time.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {events.map((event: any) => (
                        <div key={event._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                            <img
                                src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'}
                                className="w-24 h-24 rounded-2xl object-cover bg-slate-800"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';
                                }}
                            />

                            <div className="flex-1 space-y-2">
                                {editingId === event._id ? (
                                    <input
                                        className="bg-slate-950 border border-purple-500/50 rounded-lg px-3 py-1 text-white w-full"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    />
                                ) : (
                                    <h3 className="text-xl font-bold">{event.title}</h3>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Price</p>
                                    {editingId === event._id ? (
                                        <input
                                            type="number"
                                            className="bg-slate-950 border border-purple-500/50 rounded-lg px-2 py-1 text-white w-20 text-center"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                                        />
                                    ) : (
                                        <p className="text-xl font-black text-purple-400">${event.price}</p>
                                    )}
                                </div>

                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Seats</p>
                                    {editingId === event._id ? (
                                        <input
                                            type="number"
                                            className="bg-slate-950 border border-purple-500/50 rounded-lg px-2 py-1 text-white w-20 text-center"
                                            value={editForm.availableSeats}
                                            onChange={(e) => setEditForm({ ...editForm, availableSeats: parseInt(e.target.value) })}
                                        />
                                    ) : (
                                        <p className="text-xl font-black text-pink-400">{event.availableSeats}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {editingId === event._id ? (
                                        <>
                                            <button onClick={() => handleSave(event._id)} className="p-3 bg-green-600/20 text-green-500 rounded-xl hover:bg-green-600/30 transition-all"><Save className="w-5 h-5" /></button>
                                            <button onClick={() => setEditingId(null)} className="p-3 bg-slate-800 text-gray-400 rounded-xl hover:bg-slate-700 transition-all"><X className="w-5 h-5" /></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(event)} className="p-3 bg-purple-600/20 text-purple-500 rounded-xl hover:bg-purple-600/30 transition-all"><Edit className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(event._id)} className="p-3 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600/30 transition-all"><Trash2 className="w-5 h-5" /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
