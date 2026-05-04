"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Calendar,
  Ticket,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function SuccessClient() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const confirmedRef = useRef(false);

  const eventId = searchParams.get("eventId");
  const tickets = searchParams.get("tickets");
  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold">Confirming your tickets...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <XCircle className="w-10 h-10 text-red-500" />
        <p>{error}</p>
      </div>
    );
  }

  return <h1>Booking Confirmed ✅</h1>;
}
