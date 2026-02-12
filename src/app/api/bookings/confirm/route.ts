
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { eventId, tickets, stripePaymentIntentId } = await req.json();

        if (!eventId || !tickets) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Check availability
        if (event.availableSeats < tickets) {
            return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 });
        }

        // Create booking
        const booking = await Booking.create({
            user: session.user.id,
            event: eventId,
            tickets,
            totalPrice: event.price * tickets,
            status: 'paid',
            stripePaymentIntentId,
        });

        // Update event available seats
        await Event.findByIdAndUpdate(eventId, {
            $inc: { availableSeats: -tickets }
        });

        return NextResponse.json({ message: 'Booking confirmed', bookingId: booking._id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
