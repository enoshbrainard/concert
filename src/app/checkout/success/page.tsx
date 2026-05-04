"use client";

export const dynamic = "force-dynamic"; // ✅ Prevent prerender error

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Calendar,
  Ticket,
  XCircle, // ✅ FIXED import
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const confirmedRef = useRef(false);

  const eventId = searchParams.get("eventId");
  const tickets = searchParams.get("tickets");
  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    // ✅ Prevent duplicate calls
    if (!eventId || !tickets || !paymentIntent || confirmedRef.current) return;

    confirmedRef.current = true;

    const confirmBooking = async () => {
      try {
        const res = await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            tickets: parseInt(tickets, 10),
            stripePaymentIntentId: paymentIntent,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to confirm booking");
      } finally {
        setLoading(false);
      }
    };

    confirmBooking();
  }, [eventId, tickets, paymentIntent]);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold">Confirming your tickets...</h2>
        <p className="text-gray-400">Please do not refresh the page.</p>
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link
          href="/"
          className="bg-white text-slate-950 px-8 py-3 rounded-xl font-bold"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // ✅ Success UI
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
        </div>
      </div>

      <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
        Booking Confirmed!
      </h1>

      <p className="text-xl text-gray-400 mb-12">
        Get ready for an amazing experience. Your tickets have been added to your dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-purple-500 p-6 rounded-2xl transition-all group"
        >
          <Ticket className="w-6 h-6 text-purple-500" />
          <div className="text-left">
            <p className="text-xs text-gray-500 uppercase font-bold">
              View Tickets
            </p>
            <p className="font-bold group-hover:text-purple-400">
              Go to Dashboard
            </p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-gray-600 group-hover:text-white" />
        </Link>

        <Link
          href="/events"
          className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-pink-500 p-6 rounded-2xl transition-all group"
        >
          <Calendar className="w-6 h-6 text-pink-500" />
          <div className="text-left">
            <p className="text-xs text-gray-500 uppercase font-bold">
              More Events
            </p>
            <p className="font-bold group-hover:text-pink-400">
              Browse Calendar
            </p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-gray-600 group-hover:text-white" />
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
        <p className="text-gray-400 text-sm">
          A confirmation email has been sent to your account. Please present your digital ticket at the entrance.
        </p>
      </div>
    </div>
  );
}
