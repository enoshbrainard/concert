
"use client";

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Ticket, Grid, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function EventsGrid({ initialEvents }: { initialEvents: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const filteredEvents = useMemo(() => {
        return initialEvents.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialEvents, searchQuery]);

    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const getEventsForDay = (day: Date) => {
        return initialEvents.filter(event => isSameDay(new Date(event.date), day));
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter">Explore Events</h1>
                    <p className="text-gray-400 font-light">Find the perfect experience for your next outing.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* View Toggle */}
                    <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl w-full sm:w-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Grid className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-widest">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-widest">Calendar</span>
                        </button>
                    </div>

                    <div className="relative flex-1 sm:w-80 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search concerts, festivals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-gray-600 shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredEvents.map((event: any) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-500">
                            <Search className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No match found</h3>
                        <p className="text-gray-500 mb-10 font-light">Try adjusting your filters or search terms.</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="bg-purple-600/10 text-purple-400 border border-purple-500/20 px-10 py-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all font-black uppercase tracking-widest text-sm"
                        >
                            Clear Search
                        </button>
                    </div>
                )
            ) : (
                /* CALENDAR VIEW */
                <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-8 backdrop-blur-sm shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                            <span className="text-purple-500">{format(currentMonth, 'MMMM')}</span>
                            <span className="text-gray-700">{format(currentMonth, 'yyyy')}</span>
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className="p-3 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all text-white"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date())}
                                className="px-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all text-white font-bold text-xs uppercase tracking-widest"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                className="p-3 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all text-white"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-slate-800 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-slate-950/80 p-4 text-center text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, idx) => {
                            const dayEvents = getEventsForDay(day);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[140px] p-3 transition-all relative ${isCurrentMonth ? 'bg-slate-900/40 text-white' : 'bg-slate-950/20 text-gray-700'} ${isToday ? 'ring-2 ring-inset ring-purple-500/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-black ${isToday ? 'bg-purple-600 text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-lg' : ''}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {dayEvents.map(event => (
                                            <Link
                                                key={event._id}
                                                href={`/events/${event._id}`}
                                                className={`block p-2 rounded-xl text-[10px] font-bold leading-tight truncate transition-all border ${event.availableSeats === 0
                                                    ? 'bg-slate-800/50 border-slate-700 text-gray-500'
                                                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:scale-[1.02]'
                                                    }`}
                                            >
                                                {format(new Date(event.date), 'p')} {event.title}
                                                {event.availableSeats === 0 && ' (Sold Out)'}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
