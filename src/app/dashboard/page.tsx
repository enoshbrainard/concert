
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Event from "@/models/Event";
import { redirect } from "next/navigation";
import { Ticket, Calendar, MapPin, Clock, CreditCard, Bell, Plus, Users, BarChart3, Settings, ShieldCheck, Activity } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import NotificationsPanel from "@/components/NotificationsPanel";
import SafeImage from "@/components/SafeImage";

async function getAdminStats() {
    await connectToDatabase();
    const [totalEvents, totalUsers, totalBookings] = await Promise.all([
        Event.countDocuments(),
        User.countDocuments(),
        Booking.countDocuments()
    ]);
    return { totalEvents, totalUsers, totalBookings };
}

async function getBookings(userId: string) {
    await connectToDatabase();
    const bookings = await Booking.find({ user: userId })
        .populate('event')
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(bookings));
}

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const isAdmin = session.user.role === 'admin';
    const bookings = isAdmin ? [] : await getBookings(session.user.id);
    const stats = isAdmin ? await getAdminStats() : null;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
                        {isAdmin ? "Command Center" : "Member Portal"}
                    </h1>
                    <p className="text-gray-400 font-light">
                        {isAdmin
                            ? "System overview and platform management tools."
                            : `Welcome back, ${session.user.name}. Manage your tickets and profile.`}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-xl">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border shadow-lg ${isAdmin ? "bg-pink-600 border-pink-400" : "bg-purple-600 border-purple-400"
                        }`}>
                        {session.user.name?.[0]}
                    </div>
                    <div>
                        <p className="font-black text-white tracking-wide">{session.user.name}</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${isAdmin ? "bg-pink-500/20 text-pink-500 border border-pink-500/30" : "bg-purple-500/20 text-purple-500 border border-purple-500/30"
                                }`}>
                                {session.user.role}
                            </span>
                            <span className="text-xs text-gray-500">{session.user.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isAdmin ? (
                /* ADMIN DASHBOARD */
                <div className="space-y-12">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -mr-16 -mt-16"></div>
                            <Activity className="w-8 h-8 text-purple-500 mb-4" />
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Total Events</p>
                            <h3 className="text-5xl font-black text-white mt-1">{stats?.totalEvents}</h3>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 blur-3xl -mr-16 -mt-16"></div>
                            <Users className="w-8 h-8 text-pink-500 mb-4" />
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Platform Users</p>
                            <h3 className="text-5xl font-black text-white mt-1">{stats?.totalUsers}</h3>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 blur-3xl -mr-16 -mt-16"></div>
                            <Ticket className="w-8 h-8 text-green-500 mb-4" />
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Active Bookings</p>
                            <h3 className="text-5xl font-black text-white mt-1">{stats?.totalBookings}</h3>
                        </div>
                    </div>

                    {/* Management Hub */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                                <ShieldCheck className="w-6 h-6 text-pink-500" />
                                Management Hub
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Link href="/admin/manage-events" className="group bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] hover:border-purple-500/50 transition-all shadow-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                        <div className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-purple-500/50 transition-all">
                                            →
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">Manage Events</h3>
                                    <p className="text-gray-500 text-sm font-light">Create, edit, and monitor all concert listings.</p>
                                </Link>

                                <Link href="/admin/manage-bookings" className="group bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] hover:border-green-500/50 transition-all shadow-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-4 bg-green-500/10 rounded-2xl text-green-500 group-hover:scale-110 transition-transform">
                                            <BarChart3 className="w-8 h-8" />
                                        </div>
                                        <div className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-green-500/50 transition-all">
                                            →
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">Sales Reports</h3>
                                    <p className="text-gray-500 text-sm font-light">View booking analytics and transaction logs.</p>
                                </Link>

                                <Link href="/admin/manage-users" className="group bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] hover:border-pink-500/50 transition-all shadow-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-4 bg-pink-500/10 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform">
                                            <Users className="w-8 h-8" />
                                        </div>
                                        <div className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-pink-500/50 transition-all">
                                            →
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">User Registry</h3>
                                    <p className="text-gray-500 text-sm font-light">Manage member accounts and permissions.</p>
                                </Link>

                                <Link href="/admin/create-event" className="group bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] hover:border-amber-500/50 transition-all shadow-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                                            <Settings className="w-8 h-8" />
                                        </div>
                                        <div className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-amber-500/50 transition-all">
                                            →
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">System Tools</h3>
                                    <p className="text-gray-500 text-sm font-light">Configure platform settings and seed data.</p>
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                                <h3 className="font-black text-xl mb-6 text-white uppercase tracking-tighter">Quick Status</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800">
                                        <span className="text-gray-500 text-sm">Server Status</span>
                                        <span className="text-green-500 text-xs font-black uppercase flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            Operational
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800">
                                        <span className="text-gray-500 text-sm">DB Connection</span>
                                        <span className="text-green-500 text-xs font-black uppercase flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            Stable
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* USER DASHBOARD */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Ticket className="w-6 h-6 text-purple-500" />
                            My Active Tickets
                        </h2>

                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map((booking: any) => (
                                    <div key={booking._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col sm:flex-row group shadow-lg">
                                        <div className="w-full sm:w-56 h-48 sm:h-auto relative">
                                            <SafeImage
                                                src={booking.event.image}
                                                alt={booking.event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-800"
                                            />
                                        </div>
                                        <div className="p-8 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-2xl font-black text-white tracking-tight">{booking.event.title}</h3>
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${booking.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-6">
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                                                        {format(new Date(booking.event.date), 'PPP')}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <MapPin className="w-4 h-4 mr-3 text-purple-500" />
                                                        {booking.event.location}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <CreditCard className="w-4 h-4 mr-3 text-purple-500" />
                                                        {booking.tickets} Tickets • ${booking.totalPrice}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-4">
                                                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-4 rounded-2xl transition-all text-sm uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-[0.98]">
                                                    Download Ticket
                                                </button>
                                                <button className="px-6 bg-slate-950 border border-slate-800 text-gray-500 hover:text-white transition-all rounded-2xl">
                                                    <Settings className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-slate-900/40 rounded-[3rem] border border-dashed border-slate-800">
                                <Ticket className="w-20 h-20 text-slate-800 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest mb-2">No Active Tickets</h3>
                                <p className="text-gray-600 mb-10 max-w-xs mx-auto">Your upcoming events will appear here once you've secured your spot.</p>
                                <Link href="/events" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-purple-500/25 uppercase tracking-widest text-sm">
                                    Explore Experiences
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <NotificationsPanel bookings={bookings} />
                        <div className="bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="font-black text-xl mb-6 text-white uppercase tracking-tighter">Member Perk</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                You have access to early-bird pricing and VIP lounges for being an active member.
                            </p>
                            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                                <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Total Spent</p>
                                <p className="text-2xl font-black text-purple-400">
                                    ${bookings.reduce((acc: number, b: any) => acc + b.totalPrice, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
