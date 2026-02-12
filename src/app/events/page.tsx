
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import EventsGrid from '@/components/EventsGrid';

async function getEvents() {
    await connectToDatabase();
    const events = await Event.find({}).sort({ date: 1 });
    return JSON.parse(JSON.stringify(events));
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="py-8">
            <EventsGrid initialEvents={events} />
        </div>
    );
}
