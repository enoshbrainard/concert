
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, date, price } = body;

        if (!title || !date || !price) {
            return NextResponse.json({ error: 'Missing title, date, or price' }, { status: 400 });
        }

        await connectToDatabase();

        const event = await Event.create({
            title,
            date: new Date(date),
            price: Number(price),
            description: body.description || "A fantastic event you don't want to miss!",
            location: body.location || "Main Arena",
            availableSeats: body.availableSeats || 500,
            image: body.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
        });

        return NextResponse.json(event);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
