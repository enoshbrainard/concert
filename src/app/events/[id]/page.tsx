
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import { notFound } from 'next/navigation';
import EventClientDetails from '@/components/EventClientDetails';

async function getEvent(id: string) {
    await connectToDatabase();
    try {
        const event = await Event.findById(id);
        return JSON.parse(JSON.stringify(event));
    } catch (e) {
        return null;
    }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        notFound();
    }

    return <EventClientDetails event={event} />;
}
