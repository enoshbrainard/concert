
"use client";

import { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function EventClientDetails({ event }: { event: any }) {
    const [tickets, setTickets] = useState(1);
    const router = useRouter();
    const { data: session } = useSession();

    const handleBooking = () => {
        if (!session) {
            router.push(`/login?callbackUrl=/events/${event._id}`);
            return;
        }
        router.push(`/checkout/${event._id}?tickets=${tickets}`);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <Link href="/events" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to All Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Event Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl bg-slate-800">
                        <img
                            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
                            <div className="flex flex-wrap gap-4">
                                <span className="bg-purple-600/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Featured Event
                                </span>
                                <span className="bg-pink-600/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Selling Fast
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white">About this Event</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg font-light">
                            {event.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Date & Time</p>
                                    <p className="font-bold text-sm">{format(new Date(event.date), 'PPP')}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Location</p>
                                    <p className="font-bold text-sm">{event.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Capacity</p>
                                    <p className="font-bold text-sm">{event.availableSeats} Remaining</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex justify-between items-end mb-8 relative z-10">
                            <div>
                                <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest font-black">Starting Price</p>
                                <h3 className="text-5xl font-black text-white">${event.price}</h3>
                            </div>
                            <div className="flex items-center text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                OFFICIAL
                            </div>
                        </div>

                        {session?.user.role !== 'admin' && (
                            <div className="space-y-4 mb-8 relative z-10">
                                {event.availableSeats > 0 ? (
                                    <>
                                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 focus-within:border-purple-500/50 transition-all">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Select Tickets</label>
                                            <select
                                                value={tickets}
                                                onChange={(e) => setTickets(parseInt(e.target.value))}
                                                className="w-full bg-transparent text-white font-bold outline-none cursor-pointer text-lg"
                                            >
                                                {Array.from({ length: Math.min(10, event.availableSeats) }, (_, i) => i + 1).map(n => (
                                                    <option key={n} value={n} className="bg-slate-900">{n} Ticket{n > 1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Amount</label>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-purple-400">${(event.price * tickets).toFixed(2)}</span>
                                                <span className="text-gray-500 text-xs">{tickets} x ${event.price}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 bg-red-600/10 rounded-2xl border border-red-600/20 text-center">
                                        <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-2">Sold Out</p>
                                        <p className="text-gray-500 text-xs">Join the waitlist to be notified of new releases.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {session?.user.role !== 'admin' ? (
                            <>
                                <button
                                    onClick={handleBooking}
                                    disabled={event.availableSeats === 0}
                                    className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center space-x-3 text-lg uppercase tracking-widest ${event.availableSeats === 0
                                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/25'
                                        }`}
                                >
                                    <Ticket className="w-6 h-6" />
                                    <span>{event.availableSeats === 0 ? 'Sold Out' : 'Checkout Now'}</span>
                                </button>

                                <p className="text-center text-gray-500 text-[10px] mt-8 uppercase tracking-tighter">
                                    Secure processing by <span className="text-white font-bold">Stripe</span> • No hidden fees
                                </p>
                            </>
                        ) : (
                            <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl text-center">
                                <p className="text-purple-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">Admin View Only</p>
                                <Link
                                    href="/admin/manage-events"
                                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all text-sm mb-3"
                                >
                                    EDIT THIS EVENT
                                </Link>
                                <p className="text-gray-500 text-[10px] uppercase">Review mode enabled • Booking disabled for staff</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <h4 className="font-bold text-white mb-3 text-sm">Booking Guarantee</h4>
                        <ul className="text-xs text-gray-500 space-y-3">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1"></div>
                                <span>Instant mobile ticket delivery to your dashboard</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1"></div>
                                <span>100% Buyer protection and verified sellers</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
