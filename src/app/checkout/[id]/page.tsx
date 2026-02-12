
"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [clientSecret, setClientSecret] = useState("");
    const [isMock, setIsMock] = useState(false);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<any>(null);
    const [error, setError] = useState("");

    const eventId = params.id as string;
    const tickets = parseInt(searchParams.get('tickets') || '1');

    useEffect(() => {
        // Fetch Event Details
        fetch(`/api/events/${eventId}`)
            .then(res => res.json())
            .then(data => setEvent(data));

        // Create Payment Intent
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId, tickets }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                    if (data.isMock) setIsMock(true);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to initialize payment. Please try again.");
                setLoading(false);
            });
    }, [eventId, tickets]);


    const appearance = {
        theme: 'night' as const,
        variables: {
            colorPrimary: '#a855f7', // purple-500
            colorBackground: '#0f172a', // slate-900
            colorText: '#f8fafc', // slate-50
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '12px',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    if (loading || !event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                <p className="text-gray-400">Preparing your secure checkout...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Link href={`/events/${eventId}`} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Event
            </Link>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-white mb-4">Finalize Your Booking</h1>
                <p className="text-gray-400">Complete your payment for <span className="text-purple-400 font-bold">{event.title}</span></p>
            </div>

            {error ? (
                <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-3xl text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-tight">Checkout Error</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <Link
                        href={`/events/${eventId}`}
                        className="inline-block bg-slate-800 text-white px-8 py-3 rounded-2xl hover:bg-slate-700 transition-all font-bold uppercase tracking-widest text-xs"
                    >
                        Return to Event
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="hidden md:block">
                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl mb-6">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">{event.title}</h2>
                            <p className="text-gray-400">{event.location}</p>
                            <div className="flex items-center gap-2 text-purple-400 font-bold">
                                <span>{tickets}x Total Tickets</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm amount={event.price * tickets} eventId={eventId} tickets={tickets} isMock={isMock} />
                            </Elements>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
