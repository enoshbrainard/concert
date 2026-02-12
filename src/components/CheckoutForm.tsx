
"use client";

import { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, Ticket } from "lucide-react";

export default function CheckoutForm({ amount, eventId, tickets, isMock }: { amount: number, eventId: string, tickets: number, isMock?: boolean }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (isMock) {
            // Simulate a short delay then redirect to success
            setTimeout(() => {
                window.location.href = `/checkout/success?eventId=${eventId}&tickets=${tickets}&payment_intent=mock_pi_${Date.now()}`;
            }, 1500);
            return;
        }

        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success?eventId=${eventId}&tickets=${tickets}`,
            },
        });


        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-500" />
                    Order Summary
                </h3>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-gray-400">{tickets}x Tickets</span>
                    <span className="font-bold">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-extrabold text-purple-400">${amount.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    {isMock ? "Demo Payment Terminal" : "Secure Payment"}
                </h3>

                {isMock ? (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-3">
                        <p className="text-xs text-purple-300 font-bold uppercase tracking-widest">Simulated Mode</p>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-mono text-gray-400">
                            4242 4242 4242 4242
                        </div>
                        <p className="text-[10px] text-gray-500 italic">Click the button below to simulate a successful transaction.</p>
                    </div>
                ) : (
                    <PaymentElement id="payment-element" />
                )}

                <button
                    disabled={isLoading || (!isMock && (!stripe || !elements))}
                    id="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isMock ? "Confirm Demo Payment" : `Pay $${amount.toFixed(2)}`)}
                </button>

                {message && <div id="payment-message" className="text-red-500 text-sm text-center mt-4">{message}</div>}
            </div>


            <p className="text-center text-gray-500 text-xs">
                Your payment is processed securely by Stripe. We do not store your card details.
            </p>
        </form>
    );
}
