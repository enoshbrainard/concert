
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST() {
    try {
        await connectToDatabase();

        const events = await Event.find({});
        const users = await User.find({});

        if (events.length === 0 || users.length === 0) {
            return NextResponse.json({ error: 'Requires events and users. Run seed first.' }, { status: 400 });
        }

        const fakeBookings = [];
        for (let i = 0; i < 20; i++) {
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const tickets = Math.floor(Math.random() * 3) + 1;

            fakeBookings.push({
                user: randomUser._id,
                event: randomEvent._id,
                tickets,
                totalPrice: randomEvent.price * tickets,
                status: 'paid',
                stripePaymentIntentId: 'fake_pi_' + Math.random().toString(36).substring(7),
            });
        }

        await Booking.insertMany(fakeBookings);

        return NextResponse.json({ message: '20 fake bookings generated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
