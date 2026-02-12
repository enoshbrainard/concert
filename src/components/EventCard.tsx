
"use client";

import Link from 'next/link';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface EventProps {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    image: string;
    availableSeats: number;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';

export default function EventCard({ event }: { event: EventProps }) {
    const { data: session } = useSession();
    const imageUrl = event.image || DEFAULT_IMAGE;

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-slate-800 group">
            <div className="relative h-48 overflow-hidden bg-slate-800">
                <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== DEFAULT_IMAGE) {
                            target.src = DEFAULT_IMAGE;
                        }
                    }}
                />
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    ${event.price}
                </div>
                {event.availableSeats === 0 && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest rotate-[-10deg] shadow-2xl border-2 border-white/20">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        {event.date ? format(new Date(event.date), 'PPP p') : 'TBA'}
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                        {event.location}
                    </div>
                </div>

                {session?.user.role !== 'admin' && (
                    <Link
                        href={`/events/${event._id}`}
                        className={`block w-full text-center font-semibold py-2 px-4 rounded-lg transition-all shadow-lg ${event.availableSeats === 0
                            ? 'bg-slate-800 text-gray-500 cursor-not-allowed pointer-events-none'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-purple-500/25'
                            }`}
                    >
                        {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                    </Link>
                )}
                {session?.user.role === 'admin' && (
                    <Link
                        href={`/events/${event._id}`}
                        className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all border border-slate-700"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );
}
