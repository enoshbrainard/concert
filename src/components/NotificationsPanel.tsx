
"use client";

import { Bell, Calendar, Ticket, Info, X } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function NotificationsPanel({ bookings }: { bookings: any[] }) {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const upcoming = bookings
            .filter(b => new Date(b.event.date) > new Date())
            .map(b => ({
                id: b._id,
                title: `Reminder: ${b.event.title}`,
                message: `Your event is scheduled for ${format(new Date(b.event.date), 'PPP')}. Don't forget your tickets!`,
                time: b.event.date,
                icon: <Bell className="w-4 h-4 text-purple-400" />,
                type: 'reminder'
            }));

        const welcome = {
            id: 'welcome',
            title: 'Welcome to EventHorizon!',
            message: 'Browse the latest events and book your next experience with ease.',
            time: new Date().toISOString(),
            icon: <Info className="w-4 h-4 text-blue-400" />,
            type: 'info'
        };

        setNotifications([welcome, ...upcoming]);
    }, [bookings]);

    if (notifications.length === 0) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-black text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-500" />
                    Notifications
                </h3>
                <span className="bg-purple-600/20 text-purple-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {notifications.length} NEW
                </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                    <div key={n.id} className="p-6 border-b border-slate-800/50 hover:bg-slate-800/20 transition-all group">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 group-hover:border-purple-500/30 transition-all">
                                {n.icon}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-sm text-gray-200">{n.title}</p>
                                <p className="text-xs text-gray-500 leading-relaxed font-light">{n.message}</p>
                                <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest pt-2">
                                    {format(new Date(n.time), 'MMM d, h:mm a')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
