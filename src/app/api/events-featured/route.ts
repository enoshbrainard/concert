
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';

export async function GET() {
    try {
        await connectToDatabase();
        const events = await Event.find({}).sort({ date: 1 }).limit(6);
        return NextResponse.json(events);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
