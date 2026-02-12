
"use client";

import connectToDatabase from '@/lib/db';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calendar, Ticket, Zap, ShieldCheck, Smartphone, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events-featured')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center -mt-8 -mx-4 overflow-hidden rounded-b-[3rem]">
        <div
          className="absolute inset-0 z-0 bg-slate-950"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950"></div>

          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-[0.3em] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
              The Future of Ticketing
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[0.9]">
              EXPERIENCE THE <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500">
                UNFORGETTABLE
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light max-w-3xl mx-auto leading-relaxed">
              Premium access to the world's most exclusive concerts, festivals, and summits. Book instantly with secure Stripe integration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/events"
                className="group relative px-10 py-4 bg-white text-slate-950 font-black rounded-2xl transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
              >
                <span className="relative z-10">EXPLORE EVENTS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              {!session && (
                <Link
                  href="/login"
                  className="px-10 py-4 bg-slate-900/50 text-white font-black rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all backdrop-blur-xl hover:bg-slate-800/80"
                >
                  SIGN IN
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">TRENDING NOW</h2>
            <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          <Link href="/events" className="group flex items-center text-purple-400 hover:text-white transition-all font-bold tracking-widest text-sm">
            VIEW ALL <Ticket className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : events.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {events.map((event: any, i: number) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800 backdrop-blur-sm">
            <p className="text-gray-500 text-xl font-light mb-8 italic">"Silence is golden, but events are better."</p>
            <Link href="/api/seed" className="inline-block px-8 py-3 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">
              SEED DEMO CONTENT
            </Link>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section className="bg-slate-900/30 py-24 rounded-[4rem] border border-slate-900/50 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto md:mx-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">SECURE BOOKING</h3>
            <p className="text-gray-500 font-light leading-relaxed">
              Every transaction is protected by Stripe's bank-grade security protocols. Your safety is our priority.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-pink-600/10 rounded-2xl flex items-center justify-center text-pink-500 mx-auto md:mx-0">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">INSTANT ACCESS</h3>
            <p className="text-gray-500 font-light leading-relaxed">
              No waiting periods. Get your digital tickets delivered instantly to your dashboard and email.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto md:mx-0">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">MOBILE READY</h3>
            <p className="text-gray-500 font-light leading-relaxed">
              Browse, book, and enter events directly from your phone. Our platform is built for the modern traveler.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[3rem] p-12 md:p-20 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">READY FOR THE NEXT VIBE?</h2>
            <p className="text-purple-200 text-lg md:text-xl font-light max-w-2xl mx-auto">
              Join thousands of event enthusiasts and never miss a beat.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!session && (
                <Link href="/login" className="bg-white text-indigo-900 px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-2xl">
                  JOIN THE HORIZON
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
